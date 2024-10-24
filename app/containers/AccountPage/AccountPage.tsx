"use client";

import Label from "@app/components/Label/Label";
import React, { FC } from "react";
import Avatar from "@app/shared/Avatar/Avatar";
import ButtonPrimary from "@app/shared/Button/ButtonPrimary";
import Input from "@app/shared/Input/Input";
import Select from "@app/shared/Select/Select";
import Textarea from "@app/shared/Textarea/Textarea";
import CommonLayout from "./CommonLayout";
import { Database } from "@app/types/database.types";
import AutoAvatar from "@app/components/AutoAvatar";
import supabase from "@app/lib/supabase";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { GENDER } from "@app/types/enums";

export interface AccountPageProps {
  className?: string;
  user: Database["public"]["Tables"]["users"]["Row"];
}

type UserDetailsForm = Database["public"]["Tables"]["users"]["Row"];

const AccountPage: FC<AccountPageProps> = ({ className = "", user }) => {
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(
    user.avatar_url
  );

  // By default, the phone number is verified
  const [phoneNumberData, setPhoneNumberData] = React.useState<{
    phoneNumber: string;
    isVerified: boolean;
  }>({
    phoneNumber: user.phone_number,
    isVerified: true,
  });

  const { register, handleSubmit, formState } = useForm<UserDetailsForm>({
    defaultValues: user,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // handle image upload
    const avatarFile = e.target.files?.[0];
    if (!avatarFile) {
      return;
    }

    const uploaderToast = toast.loading("Uploading image...");
    const { data, error } = await supabase.storage
      .from("images")
      .upload(`avatars/${avatarFile.name}`, avatarFile, {
        cacheControl: "3600",
        upsert: false,
      });

    // delete the previous image
    if (
      avatarUrl &&
      avatarUrl.startsWith("https://jnngyhobdunnabxkdpfm.supabase.co")
    ) {
      const previousImageName = avatarUrl.split("/").pop();
      await supabase.storage
        .from("images")
        .remove([`avatars/${previousImageName}`]);
    }

    if (error) {
      toast.error("Error uploading image", { id: uploaderToast });
      return;
    }

    // Get the uploaded image URL
    const {
      data: { publicUrl },
    } = supabase.storage
      .from("images")
      .getPublicUrl("avatars/" + avatarFile.name);

    // Update the user avatar
    const { error: updateError } = await supabase
      .from("users")
      .update({ avatar_url: publicUrl })
      .eq("id", user.id);

    if (updateError) {
      // Delete the uploaded image
      await supabase.storage
        .from("images")
        .remove([`avatars/${avatarFile.name}`]);

      toast.error("Error updating avatar", { id: uploaderToast });
      return;
    }
    setAvatarUrl(publicUrl);
    toast.success("Image uploaded successfully", { id: uploaderToast });
  };

  return (
    <div className={`nc-AccountPage ${className}`} data-nc-id="AccountPage">
      <CommonLayout>
        <Toaster />
        <div className="space-y-6 sm:space-y-8">
          {/* HEADING */}
          <h2 className="text-3xl font-semibold">Account information</h2>
          <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
          <div className="flex flex-col md:flex-row">
            <div className="flex-shrink-0 flex items-start">
              <div className="relative rounded-full overflow-hidden flex">
                {avatarUrl ? (
                  <Avatar sizeClass="w-32 h-32" imgUrl={avatarUrl} />
                ) : (
                  <AutoAvatar username={user.username} />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-neutral-50 cursor-pointer">
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.5 5H7.5C6.83696 5 6.20107 5.26339 5.73223 5.73223C5.26339 6.20107 5 6.83696 5 7.5V20M5 20V22.5C5 23.163 5.26339 23.7989 5.73223 24.2678C6.20107 24.7366 6.83696 25 7.5 25H22.5C23.163 25 23.7989 24.7366 24.2678 24.2678C24.7366 23.7989 25 23.163 25 22.5V17.5M5 20L10.7325 14.2675C11.2013 13.7988 11.8371 13.5355 12.5 13.5355C13.1629 13.5355 13.7987 13.7988 14.2675 14.2675L17.5 17.5M25 12.5V17.5M25 17.5L23.0175 15.5175C22.5487 15.0488 21.9129 14.7855 21.25 14.7855C20.5871 14.7855 19.9513 15.0488 19.4825 15.5175L17.5 17.5M17.5 17.5L20 20M22.5 5H27.5M25 2.5V7.5M17.5 10H17.5125"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <span className="mt-1 text-xs">Change Image</span>
                </div>
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
            <div className="flex-grow mt-10 md:mt-0 md:pl-16 max-w-3xl space-y-6">
              {/* First name and last name */}
              <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2">
                <div>
                  <Label>First name</Label>
                  <Input className="mt-1.5" {...register("first_name")} />
                </div>
                <div>
                  <Label>Last name</Label>
                  <Input className="mt-1.5" {...register("last_name")} />
                </div>
              </div>
              {/* ---- */}
              <div>
                <Label>Gender</Label>
                <Select className="mt-1.5" {...register("gender")}>
                  {GENDER.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </div>
              {/* ---- */}
              <div>
                <Label>Username</Label>
                <Input className="mt-1.5" {...register("username")} />
              </div>
              {/* ---- */}
              <div>
                <Label>Email</Label>
                <Input className="mt-1.5" {...register("email")} />
              </div>
              {/* ---- */}
              <div className="max-w-lg">
                <Label>Date of birth</Label>
                <Input
                  className="mt-1.5"
                  type="date"
                  {...register("birthday")}
                />
              </div>
              {/* Address field 1 and 2 */}
              <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2">
                <div>
                  <Label>Address 1</Label>
                  <Input className="mt-1.5" {...register("address_1")} />
                </div>
                <div>
                  <Label>Address 2</Label>
                  <Input className="mt-1.5" {...register("address_2")} />
                </div>
              </div>
              {/* Phone number field when changed asks for otp and verifies */}
              <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2">
                <div>
                  <Label>Phone number</Label>
                  <Input className="mt-1.5" />
                </div>
                {!phoneNumberData.isVerified && (
                  <div>
                    <Label>OTP</Label>
                    <Input className="mt-1.5" />
                  </div>
                )}
              </div>
              {/* ---- */}
              <div>
                <Label>About you</Label>
                <Textarea className="mt-1.5" defaultValue="..." />
              </div>
              <div className="pt-2">
                <ButtonPrimary>Update info</ButtonPrimary>
              </div>
            </div>
          </div>
        </div>
      </CommonLayout>
    </div>
  );
};

export default AccountPage;
