"use client";

import Label from "@app/components/Label/Label";
import BouncerContext from "@app/contexts/BouncerContext";
import QrCodeScanner from "@app/organizers/components/Scan/QRScanner";
import ButtonPrimary from "@app/shared/Button/ButtonPrimary";
import Input from "@app/shared/Input/Input";
import { Tables } from "@app/types/database.types";
import { Dialog, Transition } from "@headlessui/react";
import { ErrorMessage } from "@hookform/error-message";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type LoginForm = {
  username: string;
  password: string;
};

const LoginForm = ({
  onLogin,
  eventId,
}: {
  onLogin: (
    data: Tables<"bouncer_logins"> & {
      events: Tables<"events">;
    }
  ) => void;
  eventId: string;
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginForm>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LoginForm) => {
    const toastId = toast.loading("Logging in...");
    setLoading(true);

    try {
      const res = await fetch("/api/bouncer/login", {
        method: "POST",
        body: JSON.stringify({
          username: data.username,
          password: data.password,
          eventId,
        }),
      });

      if (!res.ok) {
        throw new Error((await res.json()).error);
      }

      const json = await res.json();

      onLogin(json);
      toast.success("Logged in", { id: toastId });
    } catch (err: any) {
      toast.error(`Failed to login: ${err.message}`, { id: toastId });
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="bg-neutral-800 py-10 rounded-lg shadow-lg max-w-lg w-full px-4 text-left">
      <h1 className="text-3xl text-white text-center">Login</h1>
      <div className="mt-4">
        <Label>Username</Label>
        <Input
          type="text"
          className="mt-1.5"
          {...register("username", {
            required: "Username is required",
          })}
          required
        />
        <ErrorMessage
          render={(data) => (
            <p className="text-red-500 mt-2 text-sm">{data.message}</p>
          )}
          errors={errors}
          name="username"
        />
      </div>
      <div className="mt-4">
        <Label>Password</Label>
        <Input
          type="password"
          className="mt-1.5"
          {...register("password", {
            required: "Password is required",
          })}
          required
        />
        <ErrorMessage
          render={(data) => (
            <p className="text-red-500 mt-2 text-sm">{data.message}</p>
          )}
          errors={errors}
          name="password"
        />
      </div>
      <ButtonPrimary
        className="mt-6 w-full"
        onClick={handleSubmit(onSubmit)}
        loading={loading}
      >
        Login
      </ButtonPrimary>
    </div>
  );
};

export default function ScanPage() {
  const { session, setSession } = useContext(BouncerContext);
  const { eventId } = useParams();

  if (!eventId || Array.isArray(eventId)) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {session && (
        <div className="bg-neutral-800 p-4 rounded-lg shadow-lg max-w-lg w-full">
          <h1 className="text-3xl text-white text-center">Scan QR Code</h1>
          <div className="mt-4">
            <QrCodeScanner />
          </div>
        </div>
      )}
      {
        // Modal with transition
        <Transition appear show={!session} as={React.Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-50 overflow-y-auto dark bg-neutral-800 text-neutral-200 hiddenScrollbar"
            onClose={() => {}}
          >
            <div className="min-h-screen px-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-white dark:bg-neutral-800" />
              </Transition.Child>

              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>

              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="relative inline-flex items-center justify-center w-full max-w-5xl py-5 sm:py-8 h-screen align-middle mx-auto">
                  <LoginForm
                    onLogin={(data) => {
                      setSession(data);
                    }}
                    eventId={eventId}
                  />
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      }
    </div>
  );
}
