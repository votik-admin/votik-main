"use client";

import Label from "@app/components/Label/Label";
import React from "react";
import ButtonPrimary from "@app/shared/Button/ButtonPrimary";
import Input from "@app/shared/Input/Input";
import CommonLayout from "./CommonLayout";
import {
  FieldErrors,
  RegisterOptions,
  useForm,
  UseFormRegister,
} from "react-hook-form";
import supabase from "@app/lib/supabase";
import toast, { Toaster } from "react-hot-toast";
import { ErrorMessage } from "@hookform/error-message";

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const checkPassword = (password: string) => {
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
  return re.test(password);
};

const AccountPass = () => {
  const handlePasswordChange = async (formData: PasswordForm) => {
    const toastId = toast.loading("Updating password...");
    const { data, error } = await supabase.auth.updateUser({
      password: formData.newPassword,
    });
    if (error) {
      toast.error(error.message, { id: toastId });
      return;
    }

    toast.success("Password updated successfully!", { id: toastId });

    // Reset form
    setValue("currentPassword", "");
    setValue("newPassword", "");
    setValue("confirmPassword", "");
  };

  const {
    watch,
    handleSubmit,
    register: registerOld,
    formState,
    setValue,
  } = useForm<PasswordForm>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const register: UseFormRegister<PasswordForm> = (name, options) => ({
    ...registerOld(name, options),
    required: !!options?.required,
  });

  return (
    <div>
      <CommonLayout>
        <div className="space-y-6 sm:space-y-8">
          {/* HEADING */}
          <h2 className="text-3xl font-semibold">Update your password</h2>
          <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
          <div className=" max-w-xl space-y-6">
            <div>
              <Label>Current password</Label>
              <Input
                type="password"
                className="mt-1.5"
                {...register("currentPassword", {
                  required: "Current password is required",
                })}
              />
              <ErrorMessage
                render={(data) => (
                  <p className="text-red-500 mt-2 text-sm">{data.message}</p>
                )}
                errors={formState.errors}
                name="currentPassword"
              />
            </div>
            <div>
              <Label>New password</Label>
              <Input
                type="password"
                className="mt-1.5"
                {...register("newPassword", {
                  validate: (value) =>
                    checkPassword(value) ||
                    "Password is not valid: (6-20 characters, at least one uppercase letter, one lowercase letter, and one number",
                  required: "New password is required",
                })}
              />
              <ErrorMessage
                render={(data) => (
                  <p className="text-red-500 mt-2 text-sm">{data.message}</p>
                )}
                errors={formState.errors}
                name="newPassword"
              />
            </div>
            <div>
              <Label>Confirm password</Label>
              <Input
                type="password"
                className="mt-1.5"
                {...register("confirmPassword", {
                  validate: (value) => value === watch("newPassword"),
                  required: "Confirm password is required",
                })}
              />
              <ErrorMessage
                render={(data) => (
                  <p className="text-red-500 mt-2 text-sm">{data.message}</p>
                )}
                errors={formState.errors}
                name="confirmPassword"
              />
            </div>
            <div className="pt-2">
              <ButtonPrimary onClick={handleSubmit(handlePasswordChange)}>
                Update password
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </CommonLayout>
    </div>
  );
};

export default AccountPass;
