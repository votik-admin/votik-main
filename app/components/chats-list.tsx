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

  return (
    <div className="w-full bg-white dark:bg-gray-800 border-r dark:border-gray-700">
      <div className="p-4 bg-gray-50 dark:bg-gray-800 flex justify-between items-center gap-6">
        <Avatar
          imgUrl={user.avatar_url ?? undefined}
          sizeClass="w-8 h-8 sm:w-9 sm:h-9"
          userName={user.username ?? "Kevin"}
        />
        {/* Votik logo */}
        <div className="relative z-10 hidden md:flex flex-1">
          <Logo />
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </Button>
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-72px)]">
        {events.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400 py-40">
              No discussions yet
            </p>
          </div>
        )}
        {events.map((event) => (
          <div
            key={event.id}
            className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 gap-4`}
            onClick={() => handleSelectChat(event)}
          >
            <Avatar imgUrl={event.primary_img ?? undefined} />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 max-w-[200px] truncate">
                {event.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[200px] truncate">
                {event.messages.length > 0
                  ? event.messages[event.messages.length - 1].content
                  : "No messages"}
              </p>
            </div>
            {event.messages.length > 0 && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {formatTime(
                  event.messages[event.messages.length - 1].created_at
                )}
              </span>
            )}
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
