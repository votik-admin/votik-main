"use client";

import React, { useEffect, useState, useRef, useContext } from "react";
import supabase from "@app/lib/supabase";
import { ChatSessionContext } from "@app/contexts/UserContext";
import { Tables } from "@app/types/database.types";
import NcImage from "@app/shared/NcImage/NcImage";

const ChatBox = ({ event }: { event: Tables<"events"> }) => {
  const { user: u } = useContext(ChatSessionContext);
  const user = u!;
  const eventId = event.id;
  const [messages, setMessages] = useState<
    (Tables<"messages"> & { sender: Tables<"users_public"> })[]
  >([]);
  const [newMessage, setNewMessage] = useState("");
  const [participants, setParticipants] = useState<
    { user_id: string; users_public: Tables<"users_public"> }[]
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to the bottom of the messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch messages and participants
  useEffect(() => {
    const fetchMessages = async () => {
      const { data: existingMessages, error } = await supabase
        .from("messages")
        .select(
          `
          * ,
          sender:users_public(*)
        `
        )
        .eq("event_id", eventId)
        .order("created_at");

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      console.log("existingMessages", existingMessages);

      // @ts-expect-error - Fix this
      setMessages(existingMessages || []);
      scrollToBottom();
    };

    const fetchParticipants = async () => {
      const { data, error } = await supabase
        .from("participants")
        .select(
          `
          user_id,
          users_public(*)
        `
        )
        .eq("event_id", eventId);

      if (error) {
        console.error("Error fetching participants:", error);
        return;
      }

      // @ts-expect-error - Fix this
      setParticipants(data || []);
    };

    fetchMessages();
    fetchParticipants();

    // Real-time subscription for new messages
    const subscription = supabase
      .channel(`event:${eventId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `event_id=eq.${eventId}`,
        },
        async (payload) => {
          const { data: senderInfo, error } = await supabase
            .from("users_public")
            .select("*")
            .eq("id", payload.new.sender_id)
            .single();

          if (error) {
            console.error("Error fetching sender info:", error);
            return;
          }

          const newMessage = {
            ...payload.new,
            sender: [senderInfo],
          } as Tables<"messages"> & { sender: Tables<"users_public">[] };

          // @ts-expect-error - Fix this
          setMessages((prev) => [...prev, newMessage]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [eventId]);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    setIsScrolled(
      container.scrollHeight - container.scrollTop >
        container.clientHeight + 100
    );
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      event_id: eventId,
      sender_id: user.id,
      content: newMessage.trim(),
      created_at: new Date().toISOString(),
    };

    // Optimistically update UI
    // const optimisticMessage = {
    //   ...message,
    //   id: Math.random().toString(),
    //   sender: {
    //     id: user.id,
    //     username: user.username,
    //     avatar_url: user.avatar_url,
    //   },
    // } as Tables<"messages"> & { sender: Tables<"users_public"> };

    // setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage("");
    scrollToBottom();

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    // Send message to backend
    const { error } = await supabase.from("messages").insert(message);

    if (error) {
      console.error("Error sending message:", error);
      // Optionally handle error state
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    setNewMessage(target.value);

    // Reset height to auto to correctly calculate scrollHeight
    target.style.height = "auto";

    // Set new height based on content (with max-height limit)
    const newHeight = Math.min(target.scrollHeight, 150);
    target.style.height = `${newHeight}px`;
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Chat Header */}
      <div className="z-10 bg-[#f0f2f5] dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <NcImage
                src={event.primary_img || "/placeholder-event.png"}
                alt={event.name ?? "Event Image"}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                {event.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {participants.length} participants
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto bg-[#efeae2] dark:bg-gray-900"
      >
        <div className="p-4 space-y-1">
          {messages.map((message, i) => {
            const isOwnMessage = message.sender_id === user.id;
            const showSender =
              !isOwnMessage &&
              (i === 0 || messages[i - 1]?.sender_id !== message.sender_id);

            return (
              <div
                key={i}
                className={`flex ${
                  isOwnMessage ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex flex-col max-w-[65%] ${
                    isOwnMessage ? "items-end" : "items-start"
                  }`}
                >
                  {showSender && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 mb-1">
                      {message.sender.username}
                    </span>
                  )}
                  <div
                    className={`rounded-lg px-3 py-2 shadow-sm ${
                      isOwnMessage
                        ? "bg-[#d9fdd3] dark:bg-[#005c4b] text-gray-800 dark:text-white"
                        : "bg-white dark:bg-[#202c33] text-gray-800 dark:text-white"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <div className="flex justify-end items-center mt-1 space-x-1">
                      <span className="text-[11px] text-gray-500 dark:text-gray-400">
                        {formatTime(message.created_at)}
                      </span>
                      {isOwnMessage && (
                        <svg
                          className="w-4 h-4 text-gray-500 dark:text-gray-400"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <path d="M12.6 4.1l-6.3 6.3-2.6-2.6L2.4 9.1l3.9 3.9 7.6-7.6z" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {isScrolled && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-24 right-8 p-2 bg-white dark:bg-gray-700 text-gray-600 dark:text-white rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 transition-all duration-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Message Input */}
      <div className="bg-[#f0f2f5] dark:bg-gray-800 px-4 py-3">
        <div className="flex items-end space-x-2 max-w-7xl mx-auto">
          <textarea
            ref={inputRef}
            value={newMessage}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Type a message"
            rows={1}
            className="flex-1 bg-white dark:bg-[#2a3942] text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-green-500 dark:focus:ring-green-600 border-none placeholder-gray-500 dark:placeholder-gray-400 resize-none min-h-[40px] max-h-[150px] leading-5"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!newMessage.trim()}
            className="p-2 rounded-full bg-[#00a884] dark:bg-[#00a884] text-white hover:bg-[#008f72] dark:hover:bg-[#008f72] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 self-end"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 12h14M12 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-center">
          Press Enter to send, Shift + Enter for new line
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
