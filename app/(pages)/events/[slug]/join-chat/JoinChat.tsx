"use client";

import { ChatSessionContext } from "@app/contexts/UserContext";
import supabase from "@app/lib/supabase";
import ButtonPrimary from "@app/shared/Button/ButtonPrimary";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import toast from "react-hot-toast";

export default function JoinChat({ eventId }: { eventId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { user: u } = useContext(ChatSessionContext);

  const user = u!;

  const handleJoinChat = async () => {
    setLoading(true);
    const toastId = toast.loading("Joining chat...");
    try {
      const { data, error } = await supabase.from("participants").insert([
        {
          user_id: user.id,
          event_id: eventId,
        },
      ]);

      if (error) {
        throw error;
      }

      toast.success("Successfully joined chat", { id: toastId });

      router.push(`/user/chat`);
    } catch (error: any) {
      console.error("Error joining chat:", error);
      toast.error("Error joining chat: " + error.message, { id: toastId });
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen gap-2">
        <h1 className="text-3xl font-semibold">Join the chat!</h1>
        <p className="text-center">Start by joining the chat to get started</p>
        <ButtonPrimary
          onClick={handleJoinChat}
          className="mt-5"
          loading={loading}
        >
          Join Chat
        </ButtonPrimary>
      </div>
    </>
  );
}
