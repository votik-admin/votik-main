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

const [selectedEvent, setSelectedEvent] = useState<EventChat | null>(null);
const [events, setEvents] = useState<EventChat[]>([]);
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
content_copy
Use code with caution.

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
event_id: selectedEvent?.id,
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
content_copy
Use code with caution.

};

useEffect(() => {
const fetchMessages = async () => {
const { data: events, error } = await supabase
.from("participants")
.select(_, event:events(_))
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
`            * ,
            sender:users_public(*)
         `
)
// @ts-expect-error - TS doesn't know about the event property
.eq("event_id", event.event.id)
.order("created_at", { ascending: true });

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
setSelectedEvent(null);
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
.select("\*")
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

      setSelectedEvent((prevEvent) => {
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
content_copy
Use code with caution.

}, []);

useEffect(() => {
if (!isScrolled) {
scrollToBottom();
}
}, [selectedEvent?.messages.length]);

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

<div className="flex h-screen bg-gray-100 dark:bg-gray-900">
{/* Sidebar /}
<div className="w-full sm:w-80 bg-white dark:bg-gray-800 border-r dark:border-gray-700">
<div className="p-4 bg-gray-50 dark:bg-gray-800 flex justify-between items-center gap-6">
<Avatar
imgUrl={user.avatar_url ?? undefined}
sizeClass="w-8 h-8 sm:w-9 sm:h-9"
userName={user.username ?? "Kevin"}
/>
{/ Votik logo */}
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
No contacts found
</p>
</div>
)}
{events.map((event) => (
<div
key={event.id}
className={flex items-center p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 gap-4 ${ selectedEvent?.id === event.id ? "bg-gray-100 dark:bg-gray-700" : "" }}
onClick={() => setSelectedEvent(event)}
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

{/_ Main Chat Area _/}

  <div className="flex-1 flex flex-col">
    {selectedEvent ? (
      <>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 flex justify-between items-center border-b dark:border-gray-700">
          <div className="flex items-center gap-4">
            <Avatar
              imgUrl={selectedEvent.primary_img ?? undefined}
              userName={selectedEvent.name ?? undefined}
            />
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">
              {selectedEvent.name}
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
            {selectedEvent.messages.map((message, i) => {
              const isOwnMessage = message.sender_id === user.id;
              const showSender =
                !isOwnMessage &&
                (i === 0 ||
                  selectedEvent.messages[i - 1]?.sender_id !==
                    message.sender_id);

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
      </>
    ) : (
      <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">
          Select a contact to start chatting
        </p>
      </div>
    )}

  </div>
</div>
content_copy
 Use code with caution.

);
}
