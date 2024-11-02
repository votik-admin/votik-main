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
            <ErrorMessage
              render={(data) => (
                <p className="text-red-500 mt-2 text-sm">{data.message}</p>
              )}
              errors={formState.errors}
              name="slug"
            />
          </FormItem>
          <div>
            <span className="text-lg font-semibold">Cover image</span>
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
                        type="file"
                        accept="image/*"
                        onChange={handlePrimaryImageUpload}
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
          </div>
          {primaryImageUrl && (
            <div className="w-1/2 m-auto relative">
              <img src={primaryImageUrl} alt="Primary Image" />
              <button
                onClick={() => {
                  handleImageDelete(primaryImageUrl);
                  setPrimaryImageUrl("");
                  setValue("primary_img", "");
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
          {/* ITEM */}
          <div>
            <span className="text-lg font-semibold">Pictures of the place</span>
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
                      htmlFor="file-upload-2"
                      className="relative cursor-pointer  rounded-md font-medium text-primary-6000 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                    >
                      <span>Upload files</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleSecondaryImagesUpload}
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
          </div>
          {secondaryImageUrls.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {secondaryImageUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img src={url} alt={`Secondary Image ${index}`} />
                  <button
                    onClick={() => {
                      handleImageDelete(url);
                      setValue(
                        "secondary_imgs",
                        secondaryImageUrls.filter((u) => u !== url)
                      );
                      setSecondaryImageUrls(
                        secondaryImageUrls.filter((u) => u !== url)
                      );
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
              ))}
            </div>
          )}
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
