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
import { ErrorMessage } from "@hookform/error-message";
import { isValidSlug } from "@app/utils/slug";
import formatRemainingTime from "@app/utils/formatOtp";

export interface AccountPageProps {
  className?: string;
}

function isPhoneNumber(number: string): boolean {
  // Check if the phone number is valid: (+\d{1,3}\d{10})
  return /^\+91[0-9]{10}$/.test(number);
}

type OrganizerDetailsForm = Tables<"organizers">;

function isEmail(email: unknown): boolean {
  if (typeof email !== "string") {
    return false;
  }
  // Check if the email is valid
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

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

  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    organizer.avatar_url
  );

  const [email, setEmail] = useState(organizer.email ?? "");
  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(true);

  const otpTimer = React.useRef<NodeJS.Timeout | null>(null);
  const [otpTimerValue, setOtpTimerValue] = React.useState(300);
  const [otpSent, setOtpSent] = React.useState(false);
  const [otp, setOtp] = React.useState("");
  const [otpExpired, setOtpExpired] = React.useState(false);
  const [phoneVerified, setPhoneVerified] = React.useState(true);
  const [phone, setPhone] = React.useState(
    organizer.phone_number ? `+${organizer.phone_number}` : ""
  );

  // listen to mail change event
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "USER_UPDATED") {
        if (session?.user?.email) {
          if (session.user.email !== email) {
            setEmailVerified(false);
          } else {
            setEmailVerified(true);
            setValue("email", email);
          }
        }
      }
    });
  }, []);

  useEffect(() => {
    const updateEmail = async () => {
      const toastId = toast.loading("Updating user...");

      const { error } = await supabase
        .from("organizers")
        .update({
          email: email,
        })
        .eq("id", organizer.id);

      if (error) {
        toast.error(`Error updating user: ${error.message}`, { id: toastId });
        return;
      }

      toast.success("User updated successfully", { id: toastId });
    };
    if (email !== watch("email") && emailVerified) updateEmail();
  }, [emailVerified]);

  const verifyOtp = async () => {
    const toastId = toast.loading("Verifying OTP...");
    try {
      if (phone === null || /^\+91\d{10}$/.test(phone) === false) {
        throw new Error("Invalid phone number");
      }
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: "phone_change",
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success("OTP verified successfully!", { id: toastId });
      setPhoneVerified(true);
      setValue("phone_number", phone);
      const toastUId = toast.loading("Updating user...");

      const { error: updateError } = await supabase
        .from("organizers")
        .update({
          phone_number: phone,
        })
        .eq("id", organizer.id);

      if (updateError) {
        toast.error(`Error updating user: ${updateError.message}`, {
          id: toastUId,
        });
        return;
      }

      toast.success("User updated successfully", { id: toastUId });
    } catch (error: any) {
      toast.error(`OTP verification failed: ${error.message}`, {
        id: toastId,
      });
    }
  };

  const resendOtp = async (resend: boolean = true) => {
    const toastId = toast.loading("Resending OTP...");
    try {
      if (phone === null || /^\+91\d{10}$/.test(phone) === false) {
        throw new Error("Invalid phone number");
      }
      const { data, error } = resend
        ? await supabase.auth.resend({
            phone,
            type: "phone_change",
          })
        : await supabase.auth.updateUser({
            phone,
          });

      otpTimer.current = setInterval(() => {
        setOtpTimerValue((prev) => {
          if (prev <= 0) {
            clearInterval(otpTimer.current!);
            setOtpExpired(true);
            setOtpSent(false);
            return 300;
          }
          return prev - 1;
        });
      }, 1000);

      setOtpExpired(false);
      setOtpSent(true);

      if (error) {
        throw new Error(error.message);
      }

      toast.success("OTP sent successfully!", { id: toastId });
    } catch (error: any) {
      toast.error(`OTP resend failed: ${error.message}`, { id: toastId });
    }
  };

  const emailChange = async () => {
    const toastId = toast.loading("Sending verification email...");
    try {
      const { data, error } = await supabase.auth.updateUser({
        email,
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success("Verification email sent successfully!", { id: toastId });
      setEmailSent(true);
    } catch (error: any) {
      toast.error(`Email verification failed: ${error.message}`, {
        id: toastId,
      });
    }
  };

  const resendEmail = async () => {
    const toastId = toast.loading("Resending verification email...");
    try {
      const { data, error } = await supabase.auth.resend({
        email,
        type: "email_change",
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success("Verification email sent successfully!", { id: toastId });
    } catch (error: any) {
      toast.error(`Email verification failed: ${error.message}`, {
        id: toastId,
      });
    }
  };

  const { register, handleSubmit, watch, setValue, formState } =
    useForm<OrganizerDetailsForm>({
      defaultValues: organizer,
    });

  const handleUserUpdate = async (data: Partial<OrganizerDetailsForm>) => {
    // handle user update
    const toastId = toast.loading("Updating user...");

    if (!data.phone_number && !data.email) {
      toast.error("Please enter a phone number or email", { id: toastId });
      return;
    }

    const { error } = await supabase
      .from("organizers")
      .update({
        ...data,
        profile_complete: true,
      })
      .eq("id", organizer.id);

    if (error) {
      toast.error(`Error updating user: ${error.message}`, { id: toastId });
      return;
    }

    toast.success("User updated successfully", { id: toastId });
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
      toast.error(`Error uploading image: ${error.message}`, {
        id: uploaderToast,
      });
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

      toast.error(`Error updating avatar: ${updateError.message}`, {
        id: uploaderToast,
      });
      return;
    }
    setAvatarUrl(publicUrl);
    toast.success("Image uploaded successfully", { id: uploaderToast });
  };

  const phone_number = watch("phone_number") ? `+${watch("phone_number")}` : "";

  useEffect(() => {
    setOtpSent(false);
    setOtpExpired(false);
    setPhoneVerified(phone === phone_number);
  }, [phone, phone_number]);

  useEffect(() => {
    setEmailSent(false);
    setEmailVerified(email === (watch("email") ?? ""));
  }, [email]);

  return (
    <div className={`nc-AccountPage ${className}`} data-nc-id="AccountPage">
      <CommonLayout>
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
                  userName={organizer.name ?? ""}
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
                <ErrorMessage
                  render={(data) => (
                    <p className="text-red-500 mt-2 text-sm">{data.message}</p>
                  )}
                  errors={formState.errors}
                  name="name"
                />
              </div>
              {/* Slug */}
              <div>
                <Label>Username</Label>
                <Input
                  className="mt-1.5"
                  {...register("slug", {
                    required: "Username is required",
                    validate: (value) =>
                      (value && isValidSlug(value)) || "Invalid username",
                  })}
                />
                <ErrorMessage
                  render={(data) => (
                    <p className="text-red-500 mt-2 text-sm">{data.message}</p>
                  )}
                  errors={formState.errors}
                  name="slug"
                />
              </div>
              {/* ---- */}
              <div>
                <Label>Email</Label>
                <Input
                  className="mt-1.5"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <ErrorMessage
                  render={(data) => (
                    <p className="text-red-500 mt-2 text-sm">{data.message}</p>
                  )}
                  errors={formState.errors}
                  name="email"
                />
                {email !== watch("email") &&
                  (emailSent ? (
                    <>
                      <p className="text-green-500">Email sent</p>
                      <ButtonPrimary
                        onClick={resendEmail}
                        disabled={!isEmail(email)}
                      >
                        Resend verification email
                      </ButtonPrimary>
                    </>
                  ) : (
                    <ButtonPrimary
                      onClick={emailChange}
                      disabled={!isEmail(email)}
                    >
                      Send verification email
                    </ButtonPrimary>
                  ))}
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
                <ErrorMessage
                  render={(data) => (
                    <p className="text-red-500 mt-2 text-sm">{data.message}</p>
                  )}
                  errors={formState.errors}
                  name="addr"
                />
              </div>
              {/* Phone number field when changed asks for otp and verifies */}
              <div className="flex flex-col gap-2">
                <div>
                  <Label>Phone number</Label>
                  <div className="relative">
                    <Input
                      className="mt-1.5"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                      }}
                    />
                    <ErrorMessage
                      render={(data) => (
                        <p className="text-red-500 mt-2 text-sm">
                          {data.message}
                        </p>
                      )}
                      errors={formState.errors}
                      name="phone_number"
                    />
                    {/* Put the tick symbol if the phone number is verified */}
                    {phoneVerified && isPhoneNumber(phone) && (
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
                {otpSent ? (
                  otpExpired ? (
                    <>
                      <p className="text-red-500">
                        OTP expired. Please try again.
                      </p>
                      <ButtonPrimary type="button" onClick={resendOtp}>
                        Resend OTP
                      </ButtonPrimary>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Input
                        className="mt-1.5"
                        placeholder="Enter OTP"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          // handle otp verification
                          setOtp(e.target.value);
                        }}
                      />
                      <p className="text-neutral-500 dark:text-neutral-400">
                        OTP expires in {formatRemainingTime(otpTimerValue)}{" "}
                        minutes
                      </p>
                      <ButtonPrimary onClick={verifyOtp}>Verify</ButtonPrimary>
                    </div>
                  )
                ) : (
                  <ButtonPrimary
                    disabled={!isPhoneNumber(phone)}
                    onClick={() => resendOtp(false)}
                  >
                    Send OTP
                  </ButtonPrimary>
                )}
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
                  <ErrorMessage
                    render={(data) => (
                      <p className="text-red-500 mt-2 text-sm">
                        {data.message}
                      </p>
                    )}
                    errors={formState.errors}
                    name="pan_number"
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
                  <ErrorMessage
                    render={(data) => (
                      <p className="text-red-500 mt-2 text-sm">
                        {data.message}
                      </p>
                    )}
                    errors={formState.errors}
                    name="gstin_number"
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
                <ErrorMessage
                  render={(data) => (
                    <p className="text-red-500 mt-2 text-sm">{data.message}</p>
                  )}
                  errors={formState.errors}
                  name="bank_acc_type"
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
                <ErrorMessage
                  render={(data) => (
                    <p className="text-red-500 mt-2 text-sm">{data.message}</p>
                  )}
                  errors={formState.errors}
                  name="bank_acc_number"
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
                <ErrorMessage
                  render={(data) => (
                    <p className="text-red-500 mt-2 text-sm">{data.message}</p>
                  )}
                  errors={formState.errors}
                  name="bank_acc_ifsc"
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
                <ErrorMessage
                  render={(data) => (
                    <p className="text-red-500 mt-2 text-sm">{data.message}</p>
                  )}
                  errors={formState.errors}
                  name="bank_acc_beneficiary_name"
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
