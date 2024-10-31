"use client";

import React, { FC } from "react";
import facebookSvg from "@app/images/Facebook.svg";
import twitterSvg from "@app/images/Twitter.svg";
import googleSvg from "@app/images/Google.svg";
import Input from "@app/shared/Input/Input";
import ButtonPrimary from "@app/shared/Button/ButtonPrimary";
import Link from "next/link";
import Image from "next/image";
import supabase from "@app/lib/supabase";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import { redirect, useRouter } from "next/navigation";
import { SignInWithOAuthCredentials } from "@supabase/supabase-js";

export interface PageLoginProps {
  className?: string;
}

type LoginForm = {
  email: string;
  phone: string;
  password: string;
  otp: string;
};

const PageLogin: FC<PageLoginProps> = ({ className = "" }) => {
  const router = useRouter();

  const [phoneLogin, setPhoneLogin] = React.useState(false);
  const otpTimer = React.useRef<NodeJS.Timeout | null>(null);
  const [otpTimerValue, setOtpTimerValue] = React.useState(60);
  const [otpSent, setOtpSent] = React.useState(false);
  const [otpExpired, setOtpExpired] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
      phone: "",
      otp: "",
    },
  });

  const onSubmit = async (formData: LoginForm) => {
    const toastId = toast.loading("Logging in...");
    try {
      if (phoneLogin) {
        const { data, error } = await supabase.auth.signInWithOtp({
          phone: formData.phone,
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
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          throw new Error(error.message);
        }

        toast.success("Logged in successfully!", { id: toastId });
      }
    } catch (error: any) {
      toast.error(`Login failed: ${error.message}`, { id: toastId });
    }
  };

  const verifyOtp = async (otp: string) => {
    const toastId = toast.loading("Verifying OTP...");
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: watch("phone"),
        token: otp,
        type: "sms",
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success("OTP verified successfully!", { id: toastId });
      router.push("/organizer/dashboard");
    } catch (error: any) {
      toast.error(`OTP verification failed: ${error.message}`, { id: toastId });
    }
  };

  const resendOtp = async () => {
    const toastId = toast.loading("Resending OTP...");
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: watch("phone"),
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

  const email = watch("email");

  return (
    <div className={`nc-PageLogin ${className}`} data-nc-id="PageLogin">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Login
        </h2>
        <div className="max-w-md mx-auto space-y-6">
          <div className="grid gap-3">
            <a
              className="nc-will-change-transform flex w-full rounded-lg bg-primary-50 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px] cursor-pointer"
              onClick={() => {
                setPhoneLogin(!phoneLogin);
              }}
            >
              <h3 className="flex-grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">
                Continue with {phoneLogin ? "Email" : "Phone number"}
              </h3>
            </a>
          </div>
          {/* OR */}
          <div className="relative text-center">
            <span className="relative z-10 inline-block px-4 font-medium text-sm bg-white dark:text-neutral-400 dark:bg-neutral-900">
              OR
            </span>
            <div className="absolute left-0 w-full top-1/2 transform -translate-y-1/2 border border-neutral-100 dark:border-neutral-800"></div>
          </div>
          {/* FORM */}
          <form
            className="grid grid-cols-1 gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            {phoneLogin ? (
              <label className="flex flex-col gap-4">
                <span className="text-neutral-800 dark:text-neutral-200">
                  Phone number
                </span>
                <Input
                  type="tel"
                  autoComplete="tel webauthn"
                  placeholder="Phone number"
                  className="mt-1"
                  {...register("phone", {
                    required: "Phone number is required",
                  })}
                />
                {errors.phone && (
                  <p className="text-red-500">{errors.phone.message}</p>
                )}
                {otpSent && (
                  <label className="flex flex-col gap-4">
                    <span className="text-neutral-800 dark:text-neutral-200">
                      OTP
                    </span>
                    <Input
                      type="text"
                      autoComplete="one-time-code"
                      placeholder="OTP"
                      className="mt-1"
                      {...register("otp", { required: "OTP is required" })}
                    />
                    {errors.otp && (
                      <p className="text-red-500">{errors.otp.message}</p>
                    )}
                    <p className="text-neutral-500 dark:text-neutral-400">
                      OTP expires in {otpTimerValue} seconds
                    </p>
                    <ButtonPrimary
                      type="button"
                      onClick={async () => {
                        await verifyOtp(watch("otp"));
                      }}
                    >
                      Verify OTP
                    </ButtonPrimary>
                  </label>
                )}
                {otpExpired && (
                  <>
                    <p className="text-red-500">
                      OTP expired. Please try again.
                    </p>
                    <ButtonPrimary
                      type="button"
                      onClick={() => {
                        resendOtp();
                      }}
                    >
                      Resend OTP
                    </ButtonPrimary>
                  </>
                )}
              </label>
            ) : (
              <label className="block">
                <span className="text-neutral-800 dark:text-neutral-200">
                  Email address
                </span>
                <Input
                  type="email"
                  autoComplete="email webauthn"
                  placeholder="example@example.com"
                  className="mt-1"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </label>
            )}
            {!otpSent && (
              <>
                {" "}
                <label className="block">
                  <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                    Password
                    <a
                      className="text-sm"
                      onClick={async () => {
                        const toastId = toast.loading("Sending reset email...");

                        try {
                          const { data, error } =
                            await supabase.auth.resetPasswordForEmail(email, {
                              redirectTo:
                                "https://votik.app/auth/update-password",
                            });

                          if (error) {
                            throw new Error(error.message);
                          }

                          toast.success("Reset email sent!", { id: toastId });

                          router.push("/organizer/auth/forgot-pass-mail");
                        } catch (error: any) {
                          toast.error(error.message, { id: toastId });
                        }
                      }}
                    >
                      Forgot password?
                    </a>
                  </span>
                  <Input
                    type="password"
                    className="mt-1"
                    {...register("password", { required: true })}
                  />
                </label>
                <ButtonPrimary type="submit">Continue</ButtonPrimary>
              </>
            )}
          </form>

          {/* ==== */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            New user? {` `}
            <Link
              href="/organizer/auth/signup"
              className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
            >
              Create an account
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageLogin;
