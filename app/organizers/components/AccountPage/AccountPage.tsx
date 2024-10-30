"use client";

import Label from "@app/components/Label/Label";
import React, { FC, useContext, useEffect, useState } from "react";
import Avatar from "@app/shared/Avatar/Avatar";
import ButtonPrimary from "@app/shared/Button/ButtonPrimary";
import Input from "@app/shared/Input/Input";
import Select from "@app/shared/Select/Select";
import CommonLayout from "./CommonLayout";
import { Tables } from "@app/types/database.types";
import supabase from "@app/lib/supabase";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { GENDER, STATES } from "@app/types/enums";
import { SessionContext } from "@app/contexts/SessionContext";
import { OrganizerContext } from "@app/contexts/OrganizerContext";

export interface AccountPageProps {
  className?: string;
}

function isPhoneNumber(number: string): boolean {
  // Check if the phone number is valid: (+\d{1,3}\d{10})
  return /^\+[1-9]\d{1,14}$/.test(number);
}

type OrganizerDetailsForm = Tables<"organizers">;

function isValidGSTIN(gstin: string): boolean {
  const gstinRegex = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/;

  // First, check if GSTIN matches the required pattern
  if (!gstinRegex.test(gstin)) {
    return false;
  }

  // Checksum calculation
  const a = 65,
    b = 55,
    c = 36;
  let checksum = 0;

  for (let k = 0; k < gstin.length; k++) {
    const char = gstin[k];
    let value =
      char.charCodeAt(0) < a ? parseInt(char) : char.charCodeAt(0) - b;
    value *= (k % 2) + 1;
    value = value > c ? 1 + (value - c) : value;
    checksum += k < 14 ? value : 0;
  }

  const checkChar = gstin[14];
  const computedCheckChar =
    c - (checksum % c) < 10
      ? String(c - (checksum % c))
      : String.fromCharCode(c - (checksum % c) + b);

  // Validate checksum character
  return checkChar === computedCheckChar;
}

const AccountPage: FC<AccountPageProps> = ({ className = "" }) => {
  const { organizer: o } = useContext(OrganizerContext);

  const organizer = o!;

  console.log({ organizer });

  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    organizer.avatar_url
  );

  const [otp, setOtp] = useState<string | null>(null);

  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [sendingOtp, setSendingOtp] = useState<boolean>(false);

  // By default, the phone number is verified
  const [phoneNumberData, setPhoneNumberData] = useState<{
    phoneNumber: string;
    isVerified: boolean;
  }>({
    phoneNumber: organizer.phone_number ?? "",
    isVerified: true,
  });

  const { register, handleSubmit, watch, setValue, formState } =
    useForm<OrganizerDetailsForm>({
      defaultValues: organizer,
    });

  useEffect(() => {
    if (phoneNumberData.isVerified)
      setValue("phone_number", phoneNumberData.phoneNumber);
  }, [phoneNumberData]);

  const handleUserUpdate = async (data: OrganizerDetailsForm) => {
    // handle user update
    const toastId = toast.loading("Updating user...");
    // Check for the errors in the form
    if (formState.errors) {
      // Show all the errors
      Object.entries(formState.errors).forEach(([key, value]) => {
        // @ts-expect-error - value is a string
        toast.error(value.message, { id: toastId });
      });
    }

    const { error } = await supabase
      .from("organizers")
      .update({
        ...data,
        profile_complete: true,
      })
      .eq("id", organizer.id);

    if (error) {
      toast.error("Error updating user", { id: toastId });
      return;
    }

    toast.success("User updated successfully", { id: toastId });
  };

  const handleOtpSend = async () => {
    // handle otp send
    if (!isPhoneNumber(phoneNumberData.phoneNumber)) {
      toast.error("Invalid phone number");
      return;
    }

    // Send OTP
    console.log("Sending OTP to", phoneNumberData.phoneNumber);
    const otpToast = toast.loading(
      `Sending OTP to ${phoneNumberData.phoneNumber}`
    );
    setSendingOtp(true);

    const { data, error } = await supabase.auth.updateUser({
      phone: phoneNumberData.phoneNumber,
    });

    //

    if (error) {
      setSendingOtp(false);
      toast.error("Error sending OTP", { id: otpToast });
      return;
    }
    setSendingOtp(false);
    setOtpSent(true);
    toast.success("OTP sent successfully", { id: otpToast });
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }
    const otpToast = toast.loading("Verifying OTP...");
    const { data, error } = await supabase.auth.verifyOtp({
      phone: phoneNumberData.phoneNumber,
      token: otp,
      type: "sms",
    });

    if (error) {
      toast.error("Error verifying OTP", { id: otpToast });
      return;
    }

    setPhoneNumberData({ ...phoneNumberData, isVerified: true });
    toast.success("OTP verified successfully", { id: otpToast });

    // Update the phone number
    const { error: updateError } = await supabase
      .from("organizers")
      .update({ phone_number: phoneNumberData.phoneNumber })
      .eq("id", organizer.id);

    if (updateError) {
      toast.error("Error updating phone number", { id: otpToast });
      return;
    }

    toast.success("Phone number updated successfully", { id: otpToast });
  };

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
      .from("organizers")
      .update({ avatar_url: publicUrl })
      .eq("id", organizer.id);

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
                <Avatar
                  sizeClass="w-32 h-32"
                  imgUrl={avatarUrl ?? undefined}
                  userName={organizer.name}
                />
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
              {/* name */}
              <div>
                <Label>Name</Label>
                <Input
                  className="mt-1.5"
                  {...register("name", {
                    required: "Name is required",
                  })}
                />
              </div>
              {/* Slug */}
              <div>
                <Label>username</Label>
                <Input
                  className="mt-1.5"
                  {...register("slug", {
                    required: "Username is required",
                  })}
                />
              </div>
              {/* ---- */}
              <div>
                <Label>Email</Label>
                <Input
                  disabled
                  className="mt-1.5"
                  {...register("email", {
                    required: "Email is required",
                  })}
                />
              </div>
              {/* Address field */}
              <div>
                <Label>Address 1</Label>
                <Input
                  className="mt-1.5"
                  {...register("addr", {
                    required: "Address is required",
                  })}
                />
              </div>
              {/* Phone number field when changed asks for otp and verifies */}
              <div className="flex flex-col gap-2">
                <div>
                  <Label>Phone number</Label>
                  <div className="relative">
                    <Input
                      className="mt-1.5"
                      value={phoneNumberData.phoneNumber}
                      onChange={(e) =>
                        setPhoneNumberData({
                          phoneNumber: e.target.value,
                          isVerified:
                            e.target.value === (organizer.phone_number ?? ""),
                        })
                      }
                    />
                    {/* Put the tick symbol if the phone number is verified */}
                    {phoneNumberData.isVerified &&
                      isPhoneNumber(phoneNumberData.phoneNumber) && (
                        <span className="text-green-500 absolute top-1/2 right-4 transform -translate-y-1/2">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9.5 17L5.5 13L4 14.5L9.5 20L21 8.5L19.5 7L9.5 17Z"
                              fill="currentColor"
                            />
                          </svg>
                        </span>
                      )}
                  </div>
                </div>
                {!phoneNumberData.isVerified &&
                  (otpSent ? (
                    <div className="flex items-center gap-2">
                      <Input
                        className="mt-1.5"
                        placeholder="Enter OTP"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          // handle otp verification
                          setOtp(e.target.value);
                        }}
                      />
                      <ButtonPrimary onClick={handleVerifyOtp}>
                        Verify
                      </ButtonPrimary>
                    </div>
                  ) : (
                    <ButtonPrimary
                      disabled={!isPhoneNumber(phoneNumberData.phoneNumber)}
                      onClick={handleOtpSend}
                    >
                      Send OTP
                    </ButtonPrimary>
                  ))}
              </div>
              {/* PAN and GSTIN */}
              <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2">
                <div>
                  <Label>PAN</Label>
                  <Input
                    className="mt-1.5"
                    {...register("pan_number", {
                      required: "PAN number is required",
                      pattern: {
                        value:
                          /[A-Z]{3}[ABCFGHLJPTF]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}/,
                        message: "Invalid PAN number",
                      },
                    })}
                  />
                </div>
                <div>
                  <Label>GSTIN</Label>
                  <Input
                    className="mt-1.5"
                    {...register("gstin_number", {
                      validate: (value) =>
                        (value !== null && isValidGSTIN(value)) ||
                        "Invalid GSTIN",
                      required: "GSTIN is required",
                    })}
                  />
                </div>
              </div>
              {/* State */}
              <div>
                <Label>State</Label>
                <Select
                  className="mt-1.5"
                  value={watch("state") ?? STATES[0]}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setValue(
                      "state",
                      e.target.value as (typeof STATES)[number]
                    );
                  }}
                >
                  {STATES.map((item) => (
                    <option key={item} value={item}>
                      {item
                        .toLocaleLowerCase()
                        .replace(/^\w/, (c) => c.toUpperCase())}
                    </option>
                  ))}
                </Select>
              </div>
              {/* Bank details */}
              <div>
                <Label>Bank Account Type</Label>
                <Input
                  className="mt-1.5"
                  {...register("bank_acc_type", {
                    required: "Bank Account Type is required",
                  })}
                />
              </div>
              <div>
                <Label>Bank Account Number</Label>
                <Input
                  className="mt-1.5"
                  {...register("bank_acc_number", {
                    required: "Bank Account Number is required",
                    pattern: /^\d{9,18}$/,
                  })}
                />
              </div>
              <div>
                <Label>Bank IFSC</Label>
                <Input
                  className="mt-1.5"
                  {...register("bank_acc_ifsc", {
                    required: "Bank IFSC is required",
                    pattern: /^[A-Za-z]{4}\d{7}$/,
                  })}
                />
              </div>
              <div>
                <Label>Bank Account Beneficiary Name</Label>
                <Input
                  className="mt-1.5"
                  {...register("bank_acc_beneficiary_name", {
                    required: "Bank Account Beneficiary Name is required",
                  })}
                />
              </div>
              <div className="pt-2">
                <ButtonPrimary onClick={handleSubmit(handleUserUpdate)}>
                  Update info
                </ButtonPrimary>
              </div>
            </div>
          </div>
        </div>
      </CommonLayout>
    </div>
  );
};

export default AccountPage;
