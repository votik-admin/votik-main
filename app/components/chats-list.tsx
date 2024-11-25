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
} from "lucide-react";
import Logo from "@app/shared/Logo/Logo";
import { ChatSessionContext } from "@app/contexts/UserContext";
import supabase from "@app/lib/supabase";
import Avatar from "@app/shared/Avatar/Avatar";
import { Tables } from "@app/types/database.types";
import { useRouter } from "next/navigation";
import debounce from "lodash.debounce";
import SwitchDarkMode from "@app/shared/SwitchDarkMode/SwitchDarkMode";

type EventChat = Tables<"events"> & {
  messages: ChatMessage[];
};

type ChatMessage = Tables<"messages"> & {
  sender: User;
};

type User = Tables<"users_public">;

export function ChatList() {
  const { user: u } = useContext(ChatSessionContext);
  const user = u!;

  const [events, setEvents] = useState<EventChat[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventChat[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchMessages = async () => {
      const { data: events, error } = await supabase
        .from("participants")
        .select(`*, event:events(*)`)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching events:", error);
        return;
      }

      const eventChats = await Promise.all(
        events.map(async (event) => {
          const { data: messages, error } = await supabase
            .from("messages")
            .select(
              `
                * ,
                sender:users_public(*)
              `
            )
            // @ts-expect-error - TS doesn't know about the event property
            .eq("event_id", event.event.id)
            .order("created_at", { ascending: true })
            .limit(1);

          if (error) {
            console.error("Error fetching messages:", error);
          }

          // @ts-expect-error - TS doesn't know about the event property
          return {
            ...event.event,
            messages: messages ?? [],
          } as EventChat;
        })
      );

      setEvents(eventChats);
      setFilteredEvents(eventChats);
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

          setEvents((prevEvents) =>
            prevEvents.map((event) => {
              if (event.id === newMessage.event_id) {
                return {
                  ...event,
                  messages: [...event.messages, newMessage],
                };
              }
              return event;
            })
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  useEffect(() => {
    const filtered = events.filter(
      (event) =>
        event.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.messages.length > 0 &&
          event.messages[event.messages.length - 1].content
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()))
    );
    setFilteredEvents(filtered);
  }, [searchQuery, events]);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleSelectChat = (event: EventChat) => {
    router.push(`/user/chat/${event.id}`);
  };

  const debouncedSearch = debounce((query: string) => {
    setSearchQuery(query);
  }, 300);

  return (
    <div className="w-full bg-white dark:bg-[#1A0C2E] border-r border-purple-200 dark:border-purple-700 overflow-hidden h-max-screen">
      {/* Header */}
      <div className="p-4 bg-purple-50 dark:bg-[#2A1442] flex justify-between items-center">
        <Avatar
          imgUrl={user.avatar_url ?? undefined}
          sizeClass="w-10 h-10 rounded-full"
          userName={user.username ?? "Kevin"}
        />
        <Logo />
        <div className="flex space-x-4 items-center">
          <SwitchDarkMode />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setShowSearch((prev) => !prev);
            }}
          >
            <Search className="h-6 w-6 text-purple-700 dark:text-purple-300" />
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="p-4">
          <Input
            placeholder="Search chats..."
            onChange={(e) => debouncedSearch(e.target.value)}
            className="w-full bg-white dark:bg-[#3A0244] text-purple-900 dark:text-purple-100 border-purple-300 dark:border-purple-700"
          />
        </div>
      )}

      {/* Chat List */}
      <ScrollArea
        className={`${
          showSearch ? "h-[calc(100vh-144px)]" : "h-[calc(100vh-80px)]"
        }`}
      >
        {filteredEvents.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-purple-500 dark:text-purple-400 py-40">
              No discussions yet
            </p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              className="px-4 py-3 cursor-pointer hover:bg-purple-100 dark:hover:bg-[#3A0244] rounded-lg grid grid-cols-[auto,minmax(0,1fr),auto] gap-4 items-center max-w-full"
              onClick={() => handleSelectChat(event)}
            >
              {/* Avatar */}
              <Avatar
                imgUrl={event.primary_img ?? undefined}
                sizeClass="w-12 h-12 rounded-full"
              />

              {/* Chat Info */}
              <div className="flex-1 ml-4">
                <h3 className="font-semibold text-purple-900 dark:text-purple-100 max-w-full truncate">
                  {event.name}
                </h3>
                <p className="text-sm text-purple-600 dark:text-purple-400 truncate">
                  {event.messages.length > 0
                    ? event.messages[event.messages.length - 1].content
                    : "No messages yet"}
                </p>
              </div>

              {/* Time */}
              {event.messages.length > 0 && (
                <span className="text-xs text-purple-500 dark:text-purple-300">
                  {formatTime(
                    event.messages[event.messages.length - 1].created_at
                  )}
                </span>
              )}
            </div>
          ))
        )}
      </ScrollArea>
    </div>
  );
}
