"use client";

import Label from "@app/components/Label/Label";
import React, { FC, useContext, useEffect, useState } from "react";
import Avatar from "@app/shared/Avatar/Avatar";
import ButtonPrimary from "@app/shared/Button/ButtonPrimary";
import Input from "@app/shared/Input/Input";
import Select from "@app/shared/Select/Select";
import Textarea from "@app/shared/Textarea/Textarea";
import CommonLayout from "./CommonLayout";
import { Database, Tables } from "@app/types/database.types";
import supabase from "@app/lib/supabase";
import toast, { Toaster } from "react-hot-toast";
import { set, useForm } from "react-hook-form";
import { GENDER, STATES } from "@app/types/enums";
import { SessionContext } from "@app/contexts/SessionContext";
import { ErrorMessage } from "@hookform/error-message";

export interface AccountPageProps {
  className?: string;
}

function isPhoneNumber(number: unknown): boolean {
  if (typeof number !== "string") {
    return false;
  }
  // Check if the phone number is valid: (+\d{1,3}\d{10})
  return /^\+91\d{10}$/.test(number);
}

function isEmail(email: unknown): boolean {
  if (typeof email !== "string") {
    return false;
  }
  // Check if the email is valid
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

type UserDetailsForm = Tables<"users">;

const AccountPage: FC<AccountPageProps> = ({ className = "" }) => {
  const { user: u } = useContext(SessionContext);

  const user = u!;

  const [avatarUrl, setAvatarUrl] = useState<string | null>(user.avatar_url);

  const [email, setEmail] = useState(user.email ?? "");
  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(true);

  const otpTimer = React.useRef<NodeJS.Timeout | null>(null);
  const [otpTimerValue, setOtpTimerValue] = React.useState(60);
  const [otpSent, setOtpSent] = React.useState(false);
  const [otp, setOtp] = React.useState("");
  const [otpExpired, setOtpExpired] = React.useState(false);
  const [phoneVerified, setPhoneVerified] = React.useState(true);
  const [phone, setPhone] = React.useState(
    user.phone_number ? `+${user.phone_number}` : ""
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
        .eq("id", user.id);

      if (error) {
        toast.error(`Error updating user: ${error.message}`, { id: toastId });
        return;
      }

      toast.success("User updated successfully", { id: toastId });
    };
    if (emailVerified && email !== watch("email")) updateEmail();
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
        .eq("id", user.id);

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
            return 60;
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

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UserDetailsForm>({
    defaultValues: user,
  });

  const handleUserUpdate = async (data: Partial<UserDetailsForm>) => {
    // handle user update
    const toastId = toast.loading("Updating user...");
    // Remove all the fields that are empty
    Object.keys(data).forEach((key) => {
      // @ts-expect-error - data is of type UserDetailsForm
      if (data[key] === "") {
        // @ts-expect-error - data is of type UserDetailsForm
        delete data[key];
      }
    });

    const { error } = await supabase
      .from("users")
      .update({
        ...data,
      })
      .eq("id", user.id);

    if (error) {
      toast.error(error.message, { id: toastId });
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
      toast.error(error.message, { id: uploaderToast });
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

      toast.error(updateError.message, { id: uploaderToast });
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
                  userName={user.username}
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
              {/* First name and last name */}
              <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2">
                <div>
                  <Label>First name</Label>
                  <Input
                    className="mt-1.5"
                    {...register("first_name", {
                      required: "First name is required",
                    })}
                  />
                  <ErrorMessage errors={errors} name="first_name" />
                </div>
                <div>
                  <Label>Last name</Label>
                  <Input className="mt-1.5" {...register("last_name")} />
                  <ErrorMessage errors={errors} name="last_name" />
                </div>
              </div>
              {/* ---- */}
              <div>
                <Label>Gender</Label>
                <Select
                  className="mt-1.5"
                  value={watch("gender") ?? GENDER[0]}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setValue(
                      "gender",
                      e.target.value as (typeof GENDER)[number]
                    );
                  }}
                >
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
                <Input
                  className="mt-1.5"
                  {...register("username", {
                    required: "Username is required",
                    maxLength: { value: 20, message: "Username is too long" },
                  })}
                />
                <ErrorMessage errors={errors} name="username" />
              </div>
              {/* ---- */}
              <div>
                <Label>Email</Label>
                <Input
                  className="mt-1.5"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <ErrorMessage errors={errors} name="email" />
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
              {/* ---- */}
              <div>
                <Label>Date of birth</Label>
                <Input
                  className="mt-1.5"
                  type="date"
                  {...register("birthday", {
                    required: "Date of birth is required",
                  })}
                />
                <ErrorMessage errors={errors} name="birthday" />
              </div>
              {/* Address field 1 and 2 */}
              <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2">
                <div>
                  <Label>Address 1</Label>
                  <Input
                    className="mt-1.5"
                    {...register("address_1", {
                      required: "Address is required",
                    })}
                  />
                  <ErrorMessage errors={errors} name="address_1" />
                </div>
                <div>
                  <Label>Address 2</Label>
                  <Input className="mt-1.5" {...register("address_2")} />
                  <ErrorMessage errors={errors} name="address_2" />
                </div>
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
                    <ErrorMessage errors={errors} name="phone_number" />
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
                {otpSent &&
                  (otpExpired ? (
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
                        OTP expires in {otpTimerValue} seconds
                      </p>
                      <ButtonPrimary onClick={verifyOtp}>Verify</ButtonPrimary>
                    </div>
                  ))}
                {isPhoneNumber(phone) && phone !== phone_number && (
                  <ButtonPrimary
                    disabled={!isPhoneNumber(phone)}
                    onClick={() => resendOtp(false)}
                  >
                    Send OTP
                  </ButtonPrimary>
                )}
              </div>
              {/* Landmark and pincode */}
              <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2">
                <div>
                  <Label>Landmark</Label>
                  <Input className="mt-1.5" {...register("landmark")} />
                </div>
                <div>
                  <Label>Pincode</Label>
                  <Input
                    className="mt-1.5"
                    {...register("pincode", {
                      pattern: {
                        value: /^\d{6}$/,
                        message: "Invalid pincode",
                      },
                    })}
                  />
                  <ErrorMessage errors={errors} name="pincode" />
                </div>
              </div>
              {/* City and state */}
              <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2">
                <div>
                  <Label>City</Label>
                  <Input
                    className="mt-1.5"
                    {...register("city", {
                      required: "City is required",
                    })}
                  />
                  <ErrorMessage errors={errors} name="city" />
                </div>
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
