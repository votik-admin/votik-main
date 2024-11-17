"use client";

import supabase from "@app/lib/supabase";
import ButtonSecondary from "@app/shared/Button/ButtonSecondary";
import { Tables } from "@app/types/database.types";
import { ErrorMessage } from "@hookform/error-message";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import FormItem from "../AddYourEvent/FormItem";
import ButtonPrimary from "@app/shared/Button/ButtonPrimary";

export interface BouncerUpdateProps {
  bouncers: {
    id: number | null;
    username: string;
    password?: string;
  }[];
  event: Tables<"events">;
}

type BouncersForm = {
  bouncers: {
    id: number | null;
    username: string;
    password?: string;
  }[];
};

const ManageBouncers: FC<BouncerUpdateProps> = ({ bouncers, event }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BouncersForm>({
    defaultValues: {
      bouncers,
    },
  });

  console.log({ bouncers });

  const [loading, setLoading] = useState(false);

  const onSubmit = (data: BouncersForm) => {
    setLoading(true);
    try {
      const existingBouncers = data.bouncers.filter(
        (bouncer) => bouncer.id !== null
      ) as {
        id: number;
        username: string;
      }[];

      for (const bouncer of existingBouncers) {
        toast.promise(
          new Promise(async (res, rej) => {
            const { data, error } = await supabase
              .from("bouncer_logins")
              .update(bouncer)
              .eq("id", bouncer.id);
            if (error) {
              rej(error);
            }
            res(data);
          }),
          {
            loading: "Updating bouncer...",
            success: "Bouncer updated",
            error: (err) => `Failed to update bouncer: ${err.message}`,
          }
        );
      }

      // Add new bouncers
      const newBouncers = data.bouncers.filter(
        (bouncer) => bouncer.id === null
      ) as {
        id: null;
        username: string;
        password: string;
      }[];
      for (const newBoouncer of newBouncers) {
        toast.promise(
          new Promise(async (res, rej) => {
            const r = await fetch("/api/bouncer/signup", {
              method: "POST",
              body: JSON.stringify({
                username: newBoouncer.username,
                password: newBoouncer.password,
                eventId: event.id,
              }),
            });

            if (!r.ok) {
              rej(new Error(`Failed to add bouncer: ${r.statusText}`));
            }

            res({});
          }),
          {
            loading: "Adding bouncer...",
            success: "Bouncer added",
            error: (err) => `Failed to add bouncer: ${err.message}`,
          }
        );
      }
    } catch (err: any) {
      toast.error(`Failed to update bouncers: ${err.message}`);
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div
      className={`nc-PageAddListing1 px-4 max-w-3xl mx-auto pb-24 pt-14 sm:py-24 lg:pb-32`}
      data-nc-id="PageAddListing1"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-3xl font-bold mb-6">Bouncers for {event.name}</h2>
        <div className="border-b-2 border-neutral-200 dark:border-neutral-700 mb-6"></div>
        <div className="space-y-4 my-4">
          {watch("bouncers").map((bouncer, i) => (
            <div
              key={i}
              className="p-6 rounded-md shadow-md dark:bg-slate-800 bg-slate-100"
            >
              <h3 className="text-xl font-semibold mb-4">Bouncer #{i + 1}</h3>
              <FormItem label="Name">
                <input
                  {...register(`bouncers.${i}.username`, {
                    required: "Name is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                    maxLength: {
                      value: 30,
                      message: "Username must be at most 30 characters",
                    },
                  })}
                  type="text"
                  className="input-text w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:border-blue-500 transition"
                />
                <ErrorMessage
                  name={`bouncers.${i}.username`}
                  errors={errors}
                  render={({ message }) => (
                    <p className="text-red-500 text-sm mt-1">{message}</p>
                  )}
                />
              </FormItem>
              <FormItem label="Password" className="mt-4">
                <input
                  {...register(`bouncers.${i}.password`, {
                    required: bouncer.id !== null || "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  type="password"
                  className="input-text w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:border-blue-500 transition"
                  disabled={bouncer.id !== null}
                />
                <ErrorMessage
                  name={`bouncers.${i}.password`}
                  errors={errors}
                  render={({ message }) => (
                    <p className="text-red-500 text-sm mt-1">{message}</p>
                  )}
                />
              </FormItem>
              <button
                className="text-right text-red-500 mt-4"
                disabled={loading}
                onClick={() => {
                  if (!bouncer.id) {
                    setValue(
                      "bouncers",
                      watch("bouncers").filter((b) => b.id !== null)
                    );
                    return;
                  }
                  toast.promise(
                    new Promise(async (res, rej) => {
                      setLoading(true);
                      const { data, error } = await supabase
                        .from("bouncer_logins")
                        .delete()
                        .eq("id", bouncer.id as number);
                      if (error) {
                        rej(error);
                        setLoading(false);
                        return;
                      }
                      res(data);
                      setValue(
                        "bouncers",
                        watch("bouncers").filter((b) => b.id !== bouncer.id)
                      );
                      setLoading(false);
                    }),
                    {
                      loading: "Removing bouncer...",
                      success: "Bouncer removed",
                      error: (err) =>
                        `Failed to remove bouncer: ${err.message}`,
                    }
                  );
                }}
              >
                Remove bouncer
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end gap-4 flex-col sm:flex-row">
          <ButtonSecondary
            className="mt-4"
            type="button"
            onClick={() =>
              setValue("bouncers", [
                ...watch("bouncers"),
                { id: null, username: "", password: "" },
              ])
            }
          >
            Add Bouncer
          </ButtonSecondary>
          <ButtonPrimary type="submit" className="mt-4" disabled={loading}>
            {loading ? "Updating bouncers..." : "Update Bouncers"}
          </ButtonPrimary>
        </div>
      </form>
    </div>
  );
};

export default ManageBouncers;
