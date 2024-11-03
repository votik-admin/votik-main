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

  const handleImageDelete = async (url: string) => {
    const fileName = url.split("/").pop();
    const toastId = toast.loading("Deleting image...");
    if (!fileName) {
      toast.error("Invalid image URL", { id: toastId });
      return;
    }
    const { data, error } = await supabase.storage
      .from("images")
      .remove([`events/${fileName}`]);

    if (error) {
      console.error("Error deleting image", error);
      toast.error(`Error deleting the image: ${error.message}`, {
        id: toastId,
      });
      return;
    }

    toast.success("Image deleted successfully", { id: toastId });
  };

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

    // if (!layoutUrl) {
    //   toast.error("Please upload venue layout image");
    //   return;
    // }

    setLoading(true);
    const toastId = toast.loading("Updating event...");
    try {
      const { data, error } = await supabase
        .from("events")
        .update({
          venue: d.venueId,
          venue_layout: d.venueLayout === "" ? null : d.venueLayout,
        })
        .eq("id", eventId);

      if (error) throw error;

      toast.success("Event updated successfully", { id: toastId });
      router.push(`/organizer/event/${eventId}/edit/4?r=true`);
    } catch (error: any) {
      console.error("Error creating event", error);
      toast.error(`Error creating an event ${error?.message}`, { id: toastId });
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
      if (!watch("venueId")) setValue("venueId", data[0].id);
      setVenuesLoading(false);
      setVenues(data);
      toast.success("Venues loaded successfully", { id: toastId });
    };

    fetchVenues();
  }, []);

  console.log({ venueId: watch("venueId") });

  console.log(venues);

  return (
    <CommonLayout index="03">
      <>
        <h2 className="text-2xl font-semibold">Venue of the location</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        {/* FORM */}
        <div className="space-y-8">
          {/* ITEM */}
          <FormItem label="Venue">
            {venuesLoading ? (
              <Select disabled>
                <option>Loading...</option>
              </Select>
            ) : (
              <Select
                onChange={(e) => {
                  setValue("venueId", e.target.value);
                }}
                value={watch("venueId")}
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
            <div>
              <span className="text-lg font-semibold">Upload venue layout</span>
              <div className="mt-5 ">
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 dark:border-neutral-6000 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-neutral-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                    <div className="flex text-sm text-neutral-6000 dark:text-neutral-300">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer  rounded-md font-medium text-primary-6000 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          className="sr-only"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
              {layoutUrl && (
                <div className="w-1/2 m-auto relative mt-5">
                  <img
                    src={layoutUrl}
                    alt="Primary Image"
                    className="w-full rounded-md"
                  />
                  <button
                    onClick={() => {
                      handleImageDelete(layoutUrl);
                      setLayoutUrl("");
                      setValue("venueLayout", "");
                    }}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full"
                  >
                    <svg
                      fill="#000000"
                      width="24px"
                      height="24px"
                      viewBox="0 0 30.72 30.72"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="m20.922 22.776 1.854 -1.854L17.214 15.36l5.562 -5.562 -1.854 -1.854L15.36 13.506 9.798 7.944l-1.854 1.854L13.506 15.36 7.944 20.922l1.854 1.854L15.36 17.214z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </FormItem>
        </div>
        <div className="flex justify-end space-x-5">
          <ButtonSecondary
            href={`/organizer/event/${eventId}/edit/2?r=true`}
            refresh
          >
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
