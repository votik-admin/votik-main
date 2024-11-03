"use client";

import React, { FC } from "react";
import Input from "@app/shared/Input/Input";
import Select from "@app/shared/Select/Select";
import CommonLayout from "./CommonLayout";
import FormItem from "./FormItem";
import EventTypes from "@app/data/event-create";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import supabase from "@app/lib/supabase";
import toast from "react-hot-toast";
import ButtonSecondary from "@app/shared/Button/ButtonSecondary";
import ButtonPrimary from "@app/shared/Button/ButtonPrimary";
import { useParams, useRouter } from "next/navigation";
import { Tables } from "@app/types/database.types";
import Textarea from "@app/shared/Textarea/Textarea";

export interface PageAddListing1Props {
  event: Tables<"events">;
}

type Page1Form = {
  eventCategory: (typeof EventTypes.EventCategory)[number];
  eventName: string;
  description: string;
  startTime: string;
  attendees: number;
};

const formatTimeStringToLibrary = (time: string) => {
  // console.log({ to: time });
  if (time === "") return "";
  // 2024-11-21T14:57:00+00:00 to yyyy-MM-ddThh:mm:ss
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${year}-${month < 10 ? "0" + month : month}-${
    day < 10 ? "0" + day : day
  }T${hours < 10 ? "0" + hours : hours}:${
    minutes < 10 ? "0" + minutes : minutes
  }`;
};

const EventListing1: FC<PageAddListing1Props> = ({ event }) => {
  const router = useRouter();
  const { eventId, id } = useParams();
  const [loading, setLoading] = React.useState(false);

  const { register, setValue, formState, handleSubmit, watch } =
    useForm<Page1Form>({
      defaultValues: {
        eventCategory: event.category || "MUSIC",
        eventName: event.name || "",
        description: event.description || "",
        attendees: event.expected_footfall || 0,
        startTime: formatTimeStringToLibrary(event.start_time || ""),
      },
    });

  const onSubmit = async (d: Page1Form) => {
    setLoading(true);
    const toastId = toast.loading("Updating event...");
    try {
      const { data, error } = await supabase
        .from("events")
        .update({
          category: d.eventCategory,
          name: d.eventName,
          description: d.description,
          expected_footfall: d.attendees,
          start_time: new Date(d.startTime).toISOString(),
        })
        .eq("id", eventId);

      if (error) throw error;
      toast.success("Event updated successfully", { id: toastId });
      router.push(`/organizer/event/${eventId}/edit/2`);
    } catch (error: any) {
      console.error("Error creating event", error);
      toast.error(`Error creating an event ${error?.message}`, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommonLayout index="01">
      <>
        <h2 className="text-2xl font-semibold">Basic information</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        {/* FORM */}
        <div className="space-y-8">
          {/* ITEM */}
          <FormItem
            label="Choose the event category"
            desc="Select the category that best describes your event"
          >
            <Select
              onChange={(cat) => {
                setValue(
                  "eventCategory",
                  cat.target.value as Page1Form["eventCategory"]
                );
              }}
            >
              {EventTypes.EventCategory.map((item) => (
                <option key={item} value={item}>
                  {item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()}
                </option>
              ))}
            </Select>
          </FormItem>
          <FormItem
            label="Event name"
            desc="Choose a name that reflects your event"
          >
            <Input
              placeholder="Event name"
              {...register("eventName", {
                required: "Event name is required",
                minLength: {
                  value: 5,
                  message: "Event name must be at least 5 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Event name must not exceed 50 characters",
                },
              })}
            />
            <ErrorMessage
              render={(data) => (
                <p className="text-red-500 mt-2 text-sm">{data.message}</p>
              )}
              errors={formState.errors}
              name="eventName"
            />
          </FormItem>
          <FormItem
            label="Description"
            desc="Write a short description of your event"
          >
            <Textarea
              placeholder="Description"
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 10,
                  message: "Description must be at least 10 characters",
                },
                maxLength: {
                  value: 300,
                  message: "Description must not exceed 300 characters",
                },
              })}
            />
            <ErrorMessage
              render={(data) => (
                <p className="text-red-500 mt-2 text-sm">{data.message}</p>
              )}
              errors={formState.errors}
              name="description"
            />
          </FormItem>
          <FormItem label="Start time" desc="When will your event start?">
            <Input
              type="datetime-local"
              {...register("startTime", {
                required: "Start time is required",
                validate: (value) => {
                  const date = new Date(value);
                  if (date < new Date()) {
                    return "Start time must be in the future";
                  }
                  return true;
                },
              })}
            />
            <ErrorMessage
              render={(data) => (
                <p className="text-red-500 mt-2 text-sm">{data.message}</p>
              )}
              errors={formState.errors}
              name="startTime"
            />
          </FormItem>
          <FormItem
            label="Expected number of attendees"
            desc="How many people do you expect to attend?"
          >
            <Input
              placeholder="Number of attendees"
              type="number"
              {...register("attendees", {
                required: "Number of attendees is required",
                valueAsNumber: true,
                min: {
                  value: 1,
                  message: "Number of attendees must be at least 1",
                },
              })}
            />
            <ErrorMessage
              render={(data) => (
                <p className="text-red-500 mt-2 text-sm">{data.message}</p>
              )}
              errors={formState.errors}
              name="attendees"
            />
          </FormItem>
        </div>
        <div className="flex justify-end space-x-5">
          <ButtonSecondary href="/organizer/dashboard">Cancel</ButtonSecondary>
          <ButtonPrimary onClick={handleSubmit(onSubmit)} loading={loading}>
            Continue
          </ButtonPrimary>
        </div>
      </>
    </CommonLayout>
  );
};

export default EventListing1;
