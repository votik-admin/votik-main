"use client";

import { use, useContext, useEffect, useRef, useState } from "react";
import { Button } from "@app/components/ui/button";
import { Input } from "@app/components/ui/input";
import { ScrollArea } from "@app/components/ui/scroll-area";
import {
  Search,
  MoreVertical,
  Phone,
  Video,
  Send,
  Paperclip,
  Mic,
  ChevronLeft,
} from "lucide-react";
import Logo from "@app/shared/Logo/Logo";
import { ChatSessionContext } from "@app/contexts/UserContext";
import supabase from "@app/lib/supabase";
import Avatar from "@app/shared/Avatar/Avatar";
import { Tables } from "@app/types/database.types";
import { useParams, useRouter } from "next/navigation";
import { BackwardIcon } from "@heroicons/react/24/solid";

type EventChat = Tables<"events"> & {
  messages: ChatMessage[];
};

type ChatMessage = Tables<"messages"> & {
  sender: User;
};

type User = Tables<"users_public">;

export function Chat() {
  const { user: u } = useContext(ChatSessionContext);
  const user = u!;

  const eventId = useParams().eventId;
  const router = useRouter();

  if (!eventId || Array.isArray(eventId)) {
    throw new Error("Event ID is required");
  }

  const [event, setEvent] = useState<EventChat | null>();
  const [inputMessage, setInputMessage] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    setInputMessage(target.value);

    // Reset height to auto to correctly calculate scrollHeight
    target.style.height = "auto";

    // Set new height based on content (with max-height limit)
    const newHeight = Math.min(target.scrollHeight, 150);
    target.style.height = `${newHeight}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const newMessage = inputMessage.trim();

    const message = {
      event_id: eventId,
      sender_id: user.id,
      content: newMessage.trim(),
      created_at: new Date().toISOString(),
    } as ChatMessage;

    setInputMessage("");

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

  useEffect(() => {
    const fetchMessages = async () => {
      const { data: events, error: eventError } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

      if (eventError) {
        console.error("Error fetching event:", eventError);
        return;
      }

      const { data: messages, error } = await supabase
        .from("messages")
        .select(
          `
                * ,
                sender:users_public(*)
              `
        )
        .eq("event_id", eventId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
      }

      // @ts-expect-error - TS doesn't know about the sender property
      setEvent({
        ...events,
        messages: messages ?? [],
      } as EventChat);
    };

    fetchMessages();

    const subscription = supabase
      .channel("messages")
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

          if (error || !senderInfo) {
            console.error("Error fetching sender info:", error);
          }

          const newMessage = {
            ...payload.new,
            sender: senderInfo,
          } as ChatMessage;

          setEvent((prevEvent) => {
            if (prevEvent?.id === newMessage.event_id) {
              return {
                ...prevEvent,
                messages: [...prevEvent.messages, newMessage],
              };
            }
            return prevEvent;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  useEffect(() => {
    if (!isScrolled) {
      scrollToBottom();
    }
  }, [event?.messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    setIsScrolled(
      container.scrollHeight - container.scrollTop >
        container.clientHeight + 100
    );
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="">
      {event ? (
        <div className="grid grid-rows-[auto_1fr_auto] max-h-screen">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 flex justify-between items-center border-b dark:border-gray-700">
            <div className="flex items-center gap-4">
              {/* Back Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/user/chat")}
                className="flex items-center rounded-full p-2"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300 rounded-full" />
              </Button>

              <Avatar
                imgUrl={event.primary_img ?? undefined}
                userName={event.name ?? undefined}
              />
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                {event.name}
              </h2>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </Button>
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </Button>
            </div>
          </div>
          <ScrollArea
            className="flex-1 p-4 bg-[url('/placeholder.svg?height=600&width=800')] bg-cover dark:bg-gray-900"
            onScroll={handleScroll}
            ref={scrollRef}
          >
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
            <div className="space-y-4">
              {event.messages.map((message, i) => {
                const isOwnMessage = message.sender_id === user.id;
                const showSender =
                  !isOwnMessage &&
                  (i === 0 ||
                    event.messages[i - 1]?.sender_id !== message.sender_id);

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
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>
          {/* Message Input */}
          <div className="bg-[#f0f2f5] dark:bg-gray-800 px-4 py-3">
            <div className="flex items-end space-x-2 max-w-7xl mx-auto">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Type a message"
                rows={1}
                className="flex-1 bg-white dark:bg-[#2a3942] text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-green-500 dark:focus:ring-green-600 border-none placeholder-gray-500 dark:placeholder-gray-400 resize-none min-h-[40px] max-h-[150px] leading-5"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim()}
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
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <p className="text-gray-500 dark:text-gray-400">
            Select a chat to start messaging
          </p>
        </div>
      )}
    </div>
  );
}
