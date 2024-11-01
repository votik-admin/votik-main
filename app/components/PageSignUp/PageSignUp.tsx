"use client";

import React, { FC, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import facebookSvg from "@app/images/Facebook.svg";
import twitterSvg from "@app/images/Twitter.svg";
import googleSvg from "@app/images/Google.svg";
import { Helmet } from "react-helmet";
import Input from "@app/shared/Input/Input";
import ButtonPrimary from "@app/shared/Button/ButtonPrimary";
import Image from "next/image";
import Link from "next/link";
import supabase from "@app/lib/supabase";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { SignInWithOAuthCredentials } from "@supabase/supabase-js";
import { ErrorMessage } from "@hookform/error-message";

export interface PageSignUpProps {
  className?: string;
}

type FormValues = {
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  otp: string;
};

const loginSocials: {
  name: string;
  icon: any;
  provider: SignInWithOAuthCredentials["provider"];
}[] = [
  {
    name: "Continue with Google",
    icon: googleSvg,
    provider: "google",
  },
];

const PageSignUp: FC<PageSignUpProps> = ({ className = "" }) => {
  const router = useRouter();

  const [phoneLogin, setPhoneLogin] = React.useState(false);

  const otpTimer = React.useRef<NodeJS.Timeout | null>(null);
  const [otpTimerValue, setOtpTimerValue] = React.useState(60);
  const [otpSent, setOtpSent] = React.useState(false);
  const [otpExpired, setOtpExpired] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    const toastId = toast.loading("Signing up...");
    try {
      if (phoneLogin) {
        const { data, error } = await supabase.auth.signUp({
          phone: watch("phone"),
          password: watch("password"),
        });

        if (error) {
          throw new Error(error.message);
        }

        otpTimer.current = setInterval(() => {
          setOtpTimerValue((prev) => {
            if (prev === 0) {
              clearInterval(otpTimer.current!);
              setOtpExpired(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        setOtpExpired(false);
        setOtpSent(true);

        toast.success("OTP sent successfully!", { id: toastId });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: watch("email"),
          password: watch("password"),
        });

        if (error) {
          throw new Error(error.message);
        }

        toast.success("Sent verification email!", { id: toastId });
        router.push("/auth/login");
      }
    } catch (err: any) {
      toast.error(`Signup failed: ${err.message}`, { id: toastId });
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
      router.push("/user/account");
    } catch (error: any) {
      toast.error(`OTP verification failed: ${error.message}`, {
        id: toastId,
      });
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

  useEffect(() => {
    if (!phoneLogin) {
      setOtpExpired(false);
      setOtpSent(false);
    }
  }, [phoneLogin]);

  return (
    <div className={`nc-PageSignUp  ${className}`} data-nc-id="PageSignUp">
      <Helmet>
        <title>Sign up</title>
      </Helmet>
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Signup
        </h2>
        <div className="max-w-md mx-auto space-y-6 ">
          <div className="grid gap-3">
            {loginSocials.map((item, index) => (
              <a
                key={index}
                className="nc-will-change-transform flex w-full rounded-lg bg-primary-50 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px] cursor-pointer"
                onClick={async () => {
                  const toastId = toast.loading("Signing up...");
                  try {
                    const { data, error } = await supabase.auth.signInWithOAuth(
                      {
                        provider: item.provider,
                      }
                    );

                    if (error) {
                      throw new Error(error.message);
                    }

                    toast.success("Redirecting...", { id: toastId });

                    router.push("/auth/login");
                  } catch (err: any) {
                    toast.error(err.message, { id: toastId });
                  }
                }}
              >
                <Image
                  className="flex-shrink-0"
                  src={item.icon}
                  alt={item.name}
                />
                <h3 className="flex-grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">
                  {item.name}
                </h3>
              </a>
            ))}
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
              <label className="block">
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
                    // Should start with +91 and contain 10 digits
                    pattern: {
                      value: /^\+91[0-9]{10}$/,
                      message: "Invalid phone number",
                    },
                  })}
                />
                <ErrorMessage errors={errors} name="phone" />
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

                    <ErrorMessage errors={errors} name="otp" />
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
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Invalid email",
                    },
                  })}
                />
                <ErrorMessage errors={errors} name="email" />
              </label>
            )}
            {!otpSent && (
              <>
                <label className="block">
                  <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                    Password
                  </span>
                  <Input
                    type="password"
                    autoComplete="new-password webauthn"
                    className="mt-1"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />
                  <ErrorMessage errors={errors} name="password" />
                </label>
                <label className="block">
                  <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                    Confirm Password
                  </span>
                  <Input
                    type="password"
                    autoComplete="new-password webauthn"
                    className="mt-1"
                    {...register("confirmPassword", {
                      required: "Confirm password is required",
                      validate: (value) =>
                        value === watch("password") || "Passwords do not match",
                    })}
                  />
                  <ErrorMessage errors={errors} name="confirmPassword" />
                </label>
                <ButtonPrimary type="submit">Continue</ButtonPrimary>
              </>
            )}
          </form>

          {/* ==== */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            Already have an account? {` `}
            <Link
              href="/auth/login"
              className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
            >
              Sign in
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageSignUp;
