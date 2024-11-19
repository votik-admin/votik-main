"use client";

import { useContext, useEffect, useRef, useState } from "react";
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
  X,
} from "lucide-react";
import { ChatSessionContext } from "@app/contexts/UserContext";
import supabase from "@app/lib/supabase";
import Avatar from "@app/shared/Avatar/Avatar";
import { Tables } from "@app/types/database.types";
import { useParams, useRouter } from "next/navigation";

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
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ChatMessage[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim() || !event?.messages) {
      setSearchResults([]);
      setCurrentSearchIndex(-1);
      return;
    }

    const results = event.messages.filter((message) =>
      message.content?.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
    setCurrentSearchIndex(results.length > 0 ? 0 : -1);

    // Scroll to first result if exists
    if (results.length > 0) {
      scrollToMessage(results[0].id);
    }
  };

  const scrollToMessage = (messageId: string) => {
    const element = document.getElementById(`message-${messageId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.classList.add("bg-yellow-100", "dark:bg-yellow-900/30");
      setTimeout(() => {
        element.classList.remove("bg-yellow-100", "dark:bg-yellow-900/30");
      }, 1500);
    }
  };

  const handleNextSearchResult = () => {
    if (searchResults.length === 0) return;
    const nextIndex = (currentSearchIndex + 1) % searchResults.length;
    setCurrentSearchIndex(nextIndex);
    scrollToMessage(searchResults[nextIndex].id);
  };

  const handlePrevSearchResult = () => {
    if (searchResults.length === 0) return;
    const prevIndex =
      currentSearchIndex <= 0
        ? searchResults.length - 1
        : currentSearchIndex - 1;
    setCurrentSearchIndex(prevIndex);
    scrollToMessage(searchResults[prevIndex].id);
  };

  // Original input handling
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    setInputMessage(target.value);
    target.style.height = "auto";
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
    if (!newMessage) return;

    const message = {
      id: crypto.randomUUID(),
      event_id: eventId,
      sender_id: user.id,
      content: newMessage.trim(),
      created_at: new Date().toISOString(),
    } as ChatMessage;

    setInputMessage("");

    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    const { error } = await supabase.from("messages").insert(message);

    if (error) {
      console.error("Error sending message:", error);
    }
  };

  // Message fetching and subscription
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
          *,
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
            return;
          }

          const newMessage = {
            ...payload.new,
            sender: senderInfo,
          } as ChatMessage;

          setEvent((prevEvent) => {
            if (!prevEvent || prevEvent.id !== newMessage.event_id)
              return prevEvent;
            return {
              ...prevEvent,
              messages: [...prevEvent.messages, newMessage],
            };
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [eventId]);

  // Auto-scroll effect
  useEffect(() => {
    if (!isScrolled && !isSearching) {
      scrollToBottom();
    }
  }, [event?.messages.length, isScrolled, isSearching]);

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
    <div className="h-screen">
      {event ? (
        <div className="grid grid-rows-[auto_1fr_auto] h-full">
          <div className="p-4 bg-[#008069] dark:bg-[#202c33] flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/user/chat")}
                className="hover:bg-[#ffffff1a]"
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </Button>

              <div className="flex items-center gap-3 flex-1">
                <Avatar
                  imgUrl={event.primary_img ?? undefined}
                  userName={event.name ?? undefined}
                />
                <div>
                  <h2 className="font-semibold text-white">{event.name}</h2>
                  <span className="text-xs text-gray-200">
                    {event.messages.length} messages
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!isSearching && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsSearching(true);
                      setTimeout(() => searchInputRef.current?.focus(), 0);
                    }}
                    className="hover:bg-[#ffffff1a]"
                  >
                    <Search className="h-5 w-5 text-white" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-[#ffffff1a]"
                  >
                    <MoreVertical className="h-5 w-5 text-white" />
                  </Button>
                </>
              )}

              {isSearching && (
                <div className="flex items-center gap-2 flex-1 bg-[#202c33] rounded-lg p-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsSearching(false);
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    className="hover:bg-[#ffffff1a]"
                  >
                    <X className="h-5 w-5 text-white" />
                  </Button>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                  />
                  {searchResults.length > 0 && (
                    <div className="flex items-center gap-2 text-white text-sm">
                      <span>{`${currentSearchIndex + 1}/${
                        searchResults.length
                      }`}</span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handlePrevSearchResult}
                          className="hover:bg-[#ffffff1a] h-8 w-8"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleNextSearchResult}
                          className="hover:bg-[#ffffff1a] h-8 w-8"
                        >
                          <ChevronLeft className="h-4 w-4 rotate-180" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <ScrollArea
            className="flex-1 p-4 bg-[#efeae2] dark:bg-[#0b141a]"
            onScroll={handleScroll}
            ref={scrollRef}
          >
            <div className="space-y-4">
              {event.messages.map((message, i) => {
                const isOwnMessage = message.sender_id === user.id;
                const showSender =
                  !isOwnMessage &&
                  (i === 0 ||
                    event.messages[i - 1]?.sender_id !== message.sender_id);

                return (
                  <div
                    key={message.id}
                    id={`message-${message.id}`}
                    className={`flex ${
                      isOwnMessage ? "justify-end" : "justify-start"
                    } transition-colors duration-300`}
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
                            ? "bg-[#d9fdd3] dark:bg-[#005c4b]"
                            : "bg-white dark:bg-[#202c33]"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap text-gray-800 dark:text-white">
                          {message.content}
                        </p>
                        <div className="flex justify-end items-center mt-1 space-x-1">
                          <span className="text-[11px] text-gray-500 dark:text-gray-400">
                            {formatTime(message.created_at)}
                          </span>
                          {isOwnMessage && (
                            <svg
                              className="w-4 h-4 text-[#53bdeb]"
                              viewBox="0 0 16 15"
                              fill="currentColor"
                            >
                              <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" />
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

          {isScrolled && !isSearching && (
            <button
              onClick={scrollToBottom}
              className="fixed bottom-24 right-8 p-2 bg-white dark:bg-[#202c33] text-[#00a884] dark:text-[#00a884] rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-[#2a3942] focus:outline-none focus:ring-2 focus:ring-[#00a884] dark:focus:ring-[#00a884] transition-all duration-200"
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
              {event.messages.length - searchResults.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#00a884] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {event.messages.length - searchResults.length}
                </span>
              )}
            </button>
          )}

          {/* Message Input Area */}
          <div className="bg-[#f0f2f5] dark:bg-[#202c33] px-4 py-3">
            <div className="flex items-end space-x-2 max-w-7xl mx-auto">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#8696a0] hover:bg-[#ffffff1a] dark:hover:bg-[#ffffff1a]"
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message"
                  rows={1}
                  className="w-full bg-white dark:bg-[#2a3942] text-gray-900 dark:text-white rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-1 focus:ring-[#00a884] dark:focus:ring-[#00a884] border-none placeholder-gray-500 dark:placeholder-gray-400 resize-none min-h-[40px] max-h-[150px] leading-5"
                />
                <button className="absolute right-3 bottom-2 p-1 text-[#8696a0] hover:text-[#00a884] transition-colors duration-200">
                  <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="hover:scale-110 transition-transform duration-200"
                  >
                    <path
                      fill="currentColor"
                      d="M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm-3.204 1.362c-.026-.307-.131 5.218 6.063 5.551 6.066-.25 6.066-5.551 6.066-5.551-6.078 1.416-12.129 0-12.129 0zm11.363 1.108s-.669 1.959-5.051 1.959c-3.505 0-5.388-1.164-5.607-1.959 0 0 5.912 1.055 10.658 0zM11.804 1.011C5.609 1.011.978 6.033.978 12.228s4.826 10.761 11.021 10.761S23.02 18.423 23.02 12.228c.001-6.195-5.021-11.217-11.216-11.217zM12 21.354c-5.273 0-9.381-3.886-9.381-9.159s3.942-9.548 9.215-9.548 9.548 4.275 9.548 9.548c-.001 5.272-4.109 9.159-9.382 9.159zm3.108-9.751c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962z"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                {inputMessage.trim() ? (
                  <Button
                    onClick={() => handleSendMessage()}
                    className="p-2 rounded-full bg-[#00a884] hover:bg-[#008f72] text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00a884] dark:focus:ring-offset-[#202c33]"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-[#8696a0] hover:bg-[#ffffff1a] dark:hover:bg-[#ffffff1a]"
                  >
                    <Mic className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>

            {/* Typing indicator */}
            <div className="flex justify-center">
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Press Enter to send • Shift + Enter for new line
              </div>
            </div>
          </div>

          {/* Optional: Add typing indicator */}
          {/* {isTyping && (
            <div className="absolute bottom-20 left-4 bg-white dark:bg-[#202c33] px-4 py-2 rounded-lg shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <span className="bg-gray-400 rounded-full w-2 h-2 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="bg-gray-400 rounded-full w-2 h-2 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="bg-gray-400 rounded-full w-2 h-2 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="text-sm text-gray-500">Someone is typing...</span>
              </div>
            </div>
          )} */}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-[#f0f2f5] dark:bg-[#111b21] h-full">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-[#00a884] rounded-full flex items-center justify-center">
              <Search className="h-8 w-8 text-white" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Select a chat to start messaging
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
