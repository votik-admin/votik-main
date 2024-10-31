"use client";

import { OrganizerContext } from "@app/contexts/OrganizerContext";
import supabase from "@app/lib/supabase";
import ButtonPrimary from "@app/shared/Button/ButtonPrimary";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function MainPage() {
  const { organizer: o } = useContext(OrganizerContext);
  const [loading, setLoading] = useState(false);

  const organizer = o!;

  const router = useRouter();

  const handleCreateNewEvent = async () => {
    setLoading(true);
    const toastId = toast.loading("Creating new event...");
    const { data, error } = await supabase
      .from("events")
      .insert({
        organizer_id: organizer.id,
      })
      .select();

    if (error || !data || !data[0]) {
      console.error("Error creating new event", error);
      toast.error("Error creating new event", { id: toastId });
      setLoading(false);
      return;
    }

    toast.success("Event created successfully. Redirecting...", {
      id: toastId,
    });
    setLoading(false);
    router.push(`/organizer/event/${data[0].id}/edit/1`);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen gap-2">
        <h1 className="text-3xl font-semibold">Create your own event!</h1>
        <p className="text-center">
          Start by creating a new event to get started
        </p>
        <ButtonPrimary
          onClick={handleCreateNewEvent}
          className="mt-5"
          loading={loading}
        >
          Create New Event
        </ButtonPrimary>
      </div>
    </>
  );
}
