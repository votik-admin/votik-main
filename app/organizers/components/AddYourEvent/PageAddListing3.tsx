"use client";

import NcInputNumber from "@app/components/NcInputNumber/NcInputNumber";
import React, { FC, useEffect, useState } from "react";
import Select from "@app/shared/Select/Select";
import CommonLayout from "./CommonLayout";
import FormItem from "./FormItem";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import supabase from "@app/lib/supabase";
import ButtonSecondary from "@app/shared/Button/ButtonSecondary";
import ButtonPrimary from "@app/shared/Button/ButtonPrimary";
import { Tables } from "@app/types/database.types";

export interface PageAddListing3Props {
  event: Tables<"events">;
}

type Page3Form = {
  venueId: string;
  venueLayout: string;
};

const PageAddListing3: FC<PageAddListing3Props> = ({ event }) => {
  const { eventId, id } = useParams();
  const [loading, setLoading] = useState(false);
  const [venuesLoading, setVenuesLoading] = useState(false);
  const [venues, setVenues] = useState<{ id: string; name: string }[]>([]);
  const [layoutLoading, setLayoutLoading] = useState(false);
  const router = useRouter();

  const { register, setValue, formState, handleSubmit, watch } =
    useForm<Page3Form>({
      defaultValues: {
        venueId: event.venue || "",
        venueLayout: event.venue_layout || "",
      },
    });
  const layoutUrl = watch("venueLayout");
  const setLayoutUrl = (url: string) => setValue("venueLayout", url);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // handle image upload
    setLayoutLoading(true);
    const layoutFile = e.target.files?.[0];
    if (!layoutFile) {
      setLayoutLoading(false);
      return;
    }
    const fileName = `events/${layoutFile.name}_${Date.now()}`;

    const uploaderToast = toast.loading("Uploading image...");
    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, layoutFile, {
        cacheControl: "3600",
        upsert: false,
      });

    // delete the previous image
    if (
      layoutUrl &&
      layoutUrl.startsWith("https://jnngyhobdunnabxkdpfm.supabase.co")
    ) {
      const previousImageName = layoutUrl.split("/").pop();
      await supabase.storage
        .from("images")
        .remove([`events/${previousImageName}`]);
    }

    if (error) {
      toast.error(`Error uploading the image: ${error.message}`, {
        id: uploaderToast,
      });
      setLayoutLoading(false);
      return;
    }

    // Get the uploaded image URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(fileName);

    setLayoutUrl(publicUrl);
    toast.success("Image uploaded successfully", { id: uploaderToast });
    setLayoutLoading(false);
  };

  const onSubmit = async (d: Page3Form) => {
    if (!d.venueId) {
      toast.error("Please select a venue");
      return;
    }

    if (!layoutUrl) {
      toast.error("Please upload venue layout image");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Updating event...");
    try {
      const { data, error } = await supabase
        .from("events")
        .update({
          venue: d.venueId,
          venue_layout: d.venueLayout,
        })
        .eq("id", eventId);

      if (error) throw error;

      toast.success("Event updated successfully", { id: toastId });
      router.push(`/organizer/event/${eventId}/edit/4`);
    } catch (error) {
      console.error("Error creating event", error);
      toast.error("Error creating event", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const toastId = toast.loading("Loading venues...");
    setVenuesLoading(true);
    // fetch venues
    const fetchVenues = async () => {
      const { data, error } = await supabase.from("venues").select("id, name");
      if (error || !data) {
        toast.error("Error loading venues", { id: toastId });
        setVenuesLoading(false);
        return;
      }
      setValue("venueId", data[0].id);
      setVenuesLoading(false);
      setVenues(data);
      toast.success("Venues loaded successfully", { id: toastId });
    };

    fetchVenues();
  }, []);

  return (
    <CommonLayout index="03">
      <>
        <h2 className="text-2xl font-semibold">Venue of the location</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        {/* FORM */}
        <div className="space-y-8">
          {/* ITEM */}
          <FormItem label="Acreage (m2)">
            {venuesLoading ? (
              <Select disabled>
                <option>Loading...</option>
              </Select>
            ) : (
              <Select
                onChange={(e) => {
                  setValue("venueId", e.target.value);
                }}
              >
                {venues.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="Layout">
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                Upload venue layout image
              </span>
            </div>
          </FormItem>
        </div>
        <div className="flex justify-end space-x-5">
          <ButtonSecondary href={`/organizer/event/${eventId}/edit/2`}>
            Go back
          </ButtonSecondary>
          <ButtonPrimary
            onClick={handleSubmit(onSubmit)}
            loading={loading || layoutLoading || venuesLoading}
          >
            Continue
          </ButtonPrimary>
        </div>
      </>
    </CommonLayout>
  );
};

export default PageAddListing3;
