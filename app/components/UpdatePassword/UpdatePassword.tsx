import React, { FC } from "react";
import { useForm, SubmitHandler, UseFormRegister } from "react-hook-form";
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
import { useRouter, useSearchParams } from "next/navigation";
import { SignInWithOAuthCredentials } from "@supabase/supabase-js";
import { sanitizeRedirect } from "@app/utils/sanitizeRedirectUrl";

export interface PageSignUpProps {
  className?: string;
}

type FormValues = {
  password: string;
  confirmPassword: string;
};

const PageSignUp: FC<PageSignUpProps> = ({ className = "" }) => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const redirectUrl = sanitizeRedirect(searchParams.get("redirectUrl") ?? "/");

  const {
    register: registerOld,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>();

  const register: UseFormRegister<FormValues> = (name, options) => ({
    ...registerOld(name, options),
    required: !!options?.required,
  });

  const onSubmit: SubmitHandler<FormValues> = async (d) => {
    const toastId = toast.loading("Signing up...");
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: d.password,
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success("Password reset successfully!", { id: toastId });

      router.push(`/auth/login?redirectUrl=${redirectUrl}`);
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    }
  };

  return (
    <div className={`nc-PageSignUp  ${className}`} data-nc-id="PageSignUp">
      <Helmet>
        <title>Sign up || Booking React Template</title>
      </Helmet>
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Signup
        </h2>
        <div className="max-w-md mx-auto space-y-6 ">
          {/* FORM */}
          <form
            className="grid grid-cols-1 gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
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
