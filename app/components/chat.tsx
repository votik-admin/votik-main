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
        <div className="grid grid-rows-[auto_1fr_auto] h-screen">
          {/* Header */}
          <div className="p-2 sm:p-4 bg-[#6A0DAD] dark:bg-[#3A0244] flex justify-between items-center max-w-screen overflow-hidden">
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/user/chat")}
                className="hover:bg-[#7C38BC1a] shrink-0"
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </Button>

              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="shrink-0">
                  <Avatar
                    imgUrl={event.primary_img ?? undefined}
                    userName={event.name ?? undefined}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-white text-sm sm:text-base truncate">
                    {event.name}
                  </h2>
                  <span className="text-xs text-purple-200 hidden sm:inline-block">
                    {event.messages.length} messages
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-3 shrink-0">
              {!isSearching && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsSearching(true);
                      setTimeout(() => searchInputRef.current?.focus(), 0);
                    }}
                    className="hover:bg-[#7C38BC1a]"
                  >
                    <Search className="h-5 w-5 text-white" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-[#7C38BC1a]"
                  >
                    <MoreVertical className="h-5 w-5 text-white" />
                  </Button>
                </>
              )}
            </div>
            {isSearching && (
              <div className="flex items-center gap-2 flex-1 bg-[#3A0244] rounded-lg p-2 max-w-[calc(100vw-2rem)] m-auto">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-purple-300 focus:outline-none min-w-0"
                />
                {searchResults.length > 0 && (
                  <div className="flex items-center gap-2 text-white text-sm shrink-0">
                    <span className="hidden sm:inline">{`${
                      currentSearchIndex + 1
                    }/${searchResults.length}`}</span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handlePrevSearchResult}
                        className="hover:bg-[#7C38BC1a] h-8 w-8"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleNextSearchResult}
                        className="hover:bg-[#7C38BC1a] h-8 w-8"
                      >
                        <ChevronLeft className="h-4 w-4 rotate-180" />
                      </Button>
                    </div>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsSearching(false);
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="hover:bg-[#7C38BC1a] shrink-0"
                >
                  <X className="h-5 w-5 text-white" />
                </Button>
              </div>
            )}
          </div>

          {/* Messages Area */}
          <ScrollArea
            className="flex-1 p-2 sm:p-4 bg-[#E6E6FA] dark:bg-[#1A0C2E]"
            onScroll={handleScroll}
            ref={scrollRef}
          >
            <div className="space-y-2 sm:space-y-4">
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
                      className={`flex flex-col max-w-[85%] sm:max-w-[65%] ${
                        isOwnMessage ? "items-end" : "items-start"
                      }`}
                    >
                      {showSender && (
                        <span className="text-xs text-purple-600 dark:text-purple-400 ml-2 mb-1">
                          {message.sender.username}
                        </span>
                      )}
                      <div
                        className={`rounded-lg px-3 py-2 shadow-sm ${
                          isOwnMessage
                            ? // Deeper purple hues
                              "bg-[#d8a7ff] dark:bg-[#4A0E6E]"
                            : "bg-[#F0E6FF] dark:bg-[#2A1442]"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap text-gray-900 dark:text-white">
                          {message.content}
                        </p>
                        <div className="flex justify-end items-center mt-1 space-x-1">
                          <span className="text-[11px] text-purple-700 dark:text-purple-300">
                            {formatTime(message.created_at)}
                          </span>
                          {isOwnMessage && (
                            <svg
                              className="w-4 h-4 text-[#6A1B9A]"
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

          {/* Scroll to Bottom Button */}
          {isScrolled && !isSearching && (
            <button
              onClick={scrollToBottom}
              className="fixed bottom-20 sm:bottom-24 right-4 sm:right-8 p-2 bg-[#F0E6FF] dark:bg-[#2A1442] text-[#6A0DAD] dark:text-[#9C51DB] rounded-full shadow-lg hover:bg-purple-100 dark:hover:bg-[#3A0244] focus:outline-none focus:ring-2 focus:ring-[#6A0DAD] dark:focus:ring-[#9C51DB] transition-all duration-200"
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
                <span className="absolute -top-1 -right-1 bg-[#6A1B9A] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {event.messages.length - searchResults.length}
                </span>
              )}
            </button>
          )}

          {/* Message Input Area */}
          <div className="bg-[#F0E6FF] dark:bg-[#2A1442] px-2 sm:px-4 py-2 sm:py-3">
            <div className="flex items-end gap-2 max-w-7xl mx-auto">
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-purple-600 hover:bg-[#7C38BC1a] dark:hover:bg-[#7C38BC1a] hidden sm:inline-flex"
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
                  className="w-full bg-white dark:bg-[#3A0244] text-gray-900 dark:text-white rounded-lg pl-3 sm:pl-4 pr-10 sm:pr-12 py-2 sm:py-3 focus:outline-none focus:ring-1 focus:ring-[#6A0DAD] dark:focus:ring-[#9C51DB] border-none placeholder-purple-500 dark:placeholder-purple-300 resize-none min-h-[40px] max-h-[150px] text-sm sm:text-base leading-5"
                />
                <button className="absolute right-2 sm:right-3 bottom-1.5 sm:bottom-2 p-1 text-purple-600 hover:text-[#6A1B9A] transition-colors duration-200">
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

              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                {inputMessage.trim() ? (
                  <Button
                    onClick={() => handleSendMessage()}
                    className="p-2 rounded-full bg-[#6A1B9A] hover:bg-[#4A0E6E] text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6A1B9A] dark:focus:ring-offset-[#2A1442]"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-purple-600 hover:bg-[#7C38BC1a] dark:hover:bg-[#7C38BC1a]"
                  >
                    <Mic className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <div className="mt-1 text-xs text-purple-600 dark:text-purple-400 hidden sm:block">
                Press Enter to send • Shift + Enter for new line
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-[#F0E6FF] dark:bg-[#1A0C2E] h-full">
          <div className="text-center space-y-4 p-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-[#6A1B9A] rounded-full flex items-center justify-center">
              <Search className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <p className="text-purple-600 dark:text-purple-400 text-sm sm:text-base">
              Select a chat to start messaging
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
