"use client";

import React, { FC } from "react";
import ButtonPrimary from "@app/shared/Button/ButtonPrimary";
import ButtonSecondary from "@app/shared/Button/ButtonSecondary";
import CommonLayout from "./CommonLayout";
import toast from "react-hot-toast";
import supabase from "@app/lib/supabase";
import { useForm } from "react-hook-form";
import FormItem from "./FormItem";
import { useParams, useRouter } from "next/navigation";
import { ErrorMessage } from "@hookform/error-message";
import { Tables } from "@app/types/database.types";

export interface PageAddListing4Props {
  event: Tables<"events">;
}

type Page4Form = {
  slug: string;
  primary_img: string;
  secondary_imgs: string[];
};

const PageAddListing4: FC<PageAddListing4Props> = ({ event }) => {
  const { eventId, id } = useParams();
  const [primaryImageLoading, setPrimaryImageLoading] = React.useState(false);
  const [secondaryImageLoading, setSecondaryImageLoading] =
    React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const router = useRouter();

  const { register, setValue, formState, handleSubmit, watch } =
    useForm<Page4Form>({
      defaultValues: {
        slug: event.slug || "",
        primary_img: event.primary_img || "",
        secondary_imgs: event.secondary_imgs || [],
      },
    });

  const primaryImageUrl = watch("primary_img");
  const setPrimaryImageUrl = (url: string) => setValue("primary_img", url);

  const secondaryImageUrls = watch("secondary_imgs");
  const setSecondaryImageUrls = (urls: string[]) =>
    setValue("secondary_imgs", urls);

  const handlePrimaryImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // handle image upload
    setPrimaryImageLoading(true);
    const primaryImageFile = e.target.files?.[0];
    if (!primaryImageFile) {
      setPrimaryImageLoading(false);
      return;
    }

    const fileName = `events/${primaryImageFile.name}_${Date.now()}`;

    const uploaderToast = toast.loading("Uploading image...");
    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, primaryImageFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading image", error);
      toast.error(`Error uploading the image: ${error.message}`, {
        id: uploaderToast,
      });
      setPrimaryImageLoading(false);
      return;
    }
    // Get the uploaded image URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(fileName);

    setPrimaryImageUrl(publicUrl);
    toast.success("Image uploaded successfully", { id: uploaderToast });
    setPrimaryImageLoading(false);
  };

  const handleSecondaryImagesUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // handle image upload
    setSecondaryImageLoading(true);
    const secondaryImageFiles = e.target.files;
    if (!secondaryImageFiles || secondaryImageFiles.length === 0) {
      setSecondaryImageLoading(false);
      return;
    }

    const urls: string[] = [];
    for (let i = 0; i < secondaryImageFiles.length; i++) {
      const secondaryImageFile = secondaryImageFiles[i];
      const fileName = `events/${secondaryImageFile.name}_${Date.now()}`;

      const uploaderToast = toast.loading("Uploading image...");
      const { data, error } = await supabase.storage
        .from("images")
        .upload(fileName, secondaryImageFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Error uploading image", error);
        toast.error(`Error uploading the image: ${error.message}`, {
          id: uploaderToast,
        });
        setSecondaryImageLoading(false);
        return;
      }
      // Get the uploaded image URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(fileName);

      urls.push(publicUrl);
      toast.success("Image uploaded successfully", { id: uploaderToast });
    }

    setSecondaryImageUrls(urls);
    setSecondaryImageLoading(false);
  };

  const onSubmit = async (d: Page4Form) => {
    setLoading(true);
    const toastId = toast.loading("Updating event...");
    try {
      const { data, error } = await supabase
        .from("events")
        .update({
          slug: d.slug,
          primary_img: d.primary_img,
          secondary_imgs: d.secondary_imgs,
        })
        .eq("id", eventId);

      if (error) throw error;

      toast.success("Event updated successfully", { id: toastId });
      // redirect to the next page
      router.push(`/organizer/event/${eventId}/edit/5`);
    } catch (error) {
      console.error("Error creating event", error);
      toast.error("Error creating event", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommonLayout index="04">
      <>
        <h2 className="text-2xl font-semibold">Pictures for the event!</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        {/* FORM */}
        <div className="space-y-8">
          {/* ITEM */}
          <FormItem label="Slug">
            <input
              type="text"
              placeholder="Enter a slug for your event"
              {...register("slug", { required: true })}
            />
            <ErrorMessage errors={formState.errors} name="slug" />
          </FormItem>
          <FormItem label="Primary Image">
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={handlePrimaryImageUpload}
              />
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                Upload a primary image for your event
              </span>
            </div>
          </FormItem>
          {primaryImageUrl && (
            <div className="w-1/2">
              <img src={primaryImageUrl} alt="Primary Image" />
            </div>
          )}
          {/* ITEM */}
          <FormItem label="Secondary Images">
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleSecondaryImagesUpload}
              />
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                Upload secondary images for your event (select multiple images
                at once)
              </span>
            </div>
          </FormItem>
        </div>
        <div className="flex justify-end space-x-5">
          <ButtonSecondary href={`/organizer/event/${eventId}/edit/3`}>
            Go back
          </ButtonSecondary>
          <ButtonPrimary
            onClick={handleSubmit(onSubmit)}
            loading={loading || primaryImageLoading || secondaryImageLoading}
          >
            Publish Event
          </ButtonPrimary>
        </div>
      </>
    </CommonLayout>
  );
};

export default PageAddListing4;
