import ButtonPrimary from "@app/shared/Button/ButtonPrimary";
import ButtonClose from "@app/shared/ButtonClose/ButtonClose";
import Input from "@app/shared/Input/Input";
import { Tables } from "@app/types/database.types";
import { Dialog, Transition } from "@headlessui/react";
import { ErrorMessage } from "@hookform/error-message";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Label } from "recharts";

type SignupForm = {
  username: string;
  password: string;
};

const SignupForm = ({
  onSignup,
  eventId,
}: {
  onSignup: (
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
  } = useForm<SignupForm>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupForm) => {
    const toastId = toast.loading("Creating bouncer...");

    try {
      const res = await fetch("/api/bouncer/signup", {
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

      onSignup(json);
    } catch (err: any) {
      toast.error(`Failed to login: ${err.message}`, { id: toastId });
      console.error(err);
    }
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
      <ButtonPrimary className="mt-6 w-full" onClick={handleSubmit(onSubmit)}>
        Create Bouncer
      </ButtonPrimary>
    </div>
  );
};

export default function CreateBouncer({
  eventId,
  open,
  setOpen,
}: {
  eventId: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const onSignup = (
    data: Tables<"bouncer_logins"> & { events: Tables<"events"> }
  ) => {
    console.log("Signup", data);
  };

  return (
    <>
      {
        // Modal with transition
        <Transition appear show={open} as={React.Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-50 overflow-y-auto dark bg-neutral-800 text-neutral-200 hiddenScrollbar"
            onClose={() => {
              setOpen(false);
            }}
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
                  <div className="absolute right-2 top-2 md:top-4 md:right-4 z-50">
                    <ButtonClose
                      className="sm:w-12 sm:h-12 bg-neutral-50 dark:bg-neutral-700"
                      onClick={() => setOpen(false)}
                    />
                  </div>
                  <SignupForm
                    onSignup={(data) => {
                      onSignup(data);
                      setOpen(false);
                    }}
                    eventId={eventId}
                  />
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      }
    </>
  );
}
