"use client";

import React, { FC } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
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

export interface PageSignUpProps {
  className?: string;
}

type FormValues = {
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

const PageSignUp: FC<PageSignUpProps> = ({ className = "" }) => {
  const router = useRouter();

  const [phoneLogin, setPhoneLogin] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (d) => {
    const toastId = toast.loading("Signing up...");
    try {
      if (phoneLogin) {
        const { data, error } = await supabase.auth.signUp({
          phone: d.phone,
          password: d.password,
          options: {
            channel: "sms",
            data: {
              email: "",
              name: d.phone,
              phone_number: d.phone,
              role: "organizer",
            },
          },
        });

        if (error) {
          throw new Error(error.message);
        }

        toast.success("Confirmation mail sent to mail!", { id: toastId });

        router.push("/organizer/auth/login");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: d.email,
          password: d.password,
          options: {
            data: {
              name: d.email,
              phone_number: "",
              email: d.email,
              role: "organizer",
            },
          },
        });
        if (error) {
          throw new Error(error.message);
        }
        toast.success("Signed up successfully!", { id: toastId });
        router.push("/organizer/auth/login");
      }
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    }
  };

  return (
    <div className={`nc-PageSignUp  ${className}`} data-nc-id="PageSignUp">
      <Helmet>
        <title>Sign up || Booking React Template</title>
      </Helmet>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Signup
        </h2>
        <div className="max-w-md mx-auto space-y-6 ">
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
                  })}
                />
                {errors.phone && (
                  <p className="text-red-500">{errors.phone.message}</p>
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
            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                Password
              </span>
              <Input
                type="password"
                autoComplete="new-password webauthn"
                className="mt-1"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
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
              {errors.confirmPassword && (
                <p className="text-red-500">{errors.confirmPassword.message}</p>
              )}
            </label>
            <ButtonPrimary type="submit">Continue</ButtonPrimary>
          </form>

          {/* ==== */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            Already have an account? {` `}
            <Link
              href="/organizer/auth/login"
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
