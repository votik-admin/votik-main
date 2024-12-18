"use client";

import NcInputNumber from "@app/organizers/components/NumberInput/NumberInput";
import React, { FC, useContext, useEffect, useState } from "react";
import Select from "@app/shared/Select/Select";
import CommonLayout from "./CommonLayout";
import FormItem from "./FormItem";
import { useForm, UseFormRegister } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import ButtonSecondary from "@app/shared/Button/ButtonSecondary";
import ButtonPrimary from "@app/shared/Button/ButtonPrimary";
import { notFound, useParams, useRouter } from "next/navigation";
import supabase from "@app/lib/supabase";
import { Tables } from "@app/types/database.types";
import toast from "react-hot-toast";

export interface PageAddListing5Props {
  tickets: Tables<"tickets">[];
  revalidate: () => Promise<void>;
}

type Page5Form = {
  tickets: {
    id: number | null;
    name: string;
    price: number;
    quantity: number;
    description: string;
  }[];
};

const PageAddListing5: FC<PageAddListing5Props> = ({ tickets, revalidate }) => {
  const { eventId, id } = useParams();
  const router = useRouter();

  if (!id || Array.isArray(eventId)) {
    console.error("Invalid id", id);
    notFound();
  }

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    revalidate();
  }, []);

  if (tickets.length === 0) {
    tickets = [
      {
        name: "General Admission",
        price: 0,
        initial_available_count: 0,
        description: "General admission ticket",
      },
    ] as Tables<"tickets">[];
  }

  const {
    register: registerOld,
    formState: { errors },
    watch,
    setValue,
    handleSubmit,
  } = useForm<Page5Form>({
    defaultValues: {
      tickets: tickets.map((ticket) => ({
        name: ticket.name,
        price: ticket.price,
        quantity: ticket.initial_available_count,
        description: ticket.description,
        id: ticket.id ?? null,
      })),
    },
  });

  const register: UseFormRegister<Page5Form> = (name, options) => ({
    ...registerOld(name, options),
    required: !!options?.required,
  });

  const onSubmit = async (d: Page5Form) => {
    if (d.tickets.length === 0) {
      toast.error("Please add at least one ticket type");
      return;
    }

    // Update the old tickets and create new tickets
    const oldTix = tickets
      .filter((t) => t.id !== null)
      .map((t) => ({
        id: t.id,
        name: t.name,
        price: t.price,
        quantity: t.initial_available_count,
        description: t.description,
      }));

    for (const ticket of d.tickets) {
      console.log("Ticket", ticket);
      if (ticket.id !== null) {
        const oldTicket = oldTix.find((t) => t.id === ticket.id);
        if (
          oldTicket?.name === ticket.name &&
          oldTicket?.price === ticket.price &&
          oldTicket?.quantity === ticket.quantity &&
          oldTicket?.description === ticket.description
        ) {
          continue;
        }
        const toastId = toast.loading("Updating ticket " + ticket.name);
        if ((oldTicket?.quantity ?? 0) > ticket.quantity) {
          toast.error("Cannot decrease ticket quantity of " + ticket.name, {
            id: toastId,
          });
          return;
        }
        const { data, error } = await supabase
          .from("tickets")
          .update({
            name: ticket.name,
            price: ticket.price,
            initial_available_count: ticket.quantity,
            description: ticket.description,
          })
          .eq("id", ticket.id);

        if (error) {
          console.error("Error updating ticket", error);
          toast.error(`Error updating ticket: ${error.message}`, {
            id: toastId,
          });
          return;
        }
        toast.success("Ticket updated successfully", { id: toastId });
      }
    }

    const newTix = d.tickets.filter((t) => t.id === null);

    const toastId = toast.loading("Updating event...");

    console.log("New tickets", newTix);

    const newTickets = newTix.map((ticket) => ({
      event_id: eventId,
      name: ticket.name,
      price: ticket.price,
      description: ticket.description,
      current_available_count: ticket.quantity,
      initial_available_count: ticket.quantity,
    }));

    const { data, error } = await supabase.from("tickets").insert(newTickets);

    if (error) {
      console.error("Error creating tickets", error);
      toast.error(`Error creating tickets: ${error.message}`, { id: toastId });
      return;
    }

    toast.success("Tickets created successfully", { id: toastId });
    router.push(`/organizer/event/${eventId}/edit/6`);
  };

  return (
    <CommonLayout index="03">
      <>
        <h2 className="text-3xl font-bold mb-6">Tickets for the Event</h2>
        <div className="border-b-2 border-neutral-200 dark:border-neutral-700 mb-6"></div>
        <div className="space-y-8">
          {watch("tickets").map((ticket, index) => (
            <div
              key={index}
              className="p-6 rounded-md shadow-md dark:bg-slate-800 bg-slate-100"
            >
              <h3 className="text-xl font-semibold mb-4">
                Ticket #{index + 1}
              </h3>
              <FormItem label="Name">
                <input
                  {...register(`tickets.${index}.name`, {
                    required: "Ticket name is required",
                    minLength: {
                      value: 3,
                      message: "Ticket name must be at least 3 characters",
                    },
                    maxLength: {
                      value: 50,
                      message: "Ticket name must be less than 50 characters",
                    },
                  })}
                  type="text"
                  className="input-text w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:border-blue-500 transition"
                />
                <ErrorMessage
                  name={`tickets.${index}.name`}
                  errors={errors}
                  render={({ message }) => (
                    <p className="text-red-500 text-sm mt-1">{message}</p>
                  )}
                />
              </FormItem>
              <div className="grid gap-4 sm:grid-cols-2 mt-4">
                <FormItem label="Price">
                  <div className="flex flex-row gap-2 items-center">
                    <span className="text-neutral-500 text-xl">₹ </span>
                    <input
                      {...register(`tickets.${index}.price`, {
                        required: "Ticket price is required",
                        min: {
                          value: 0,
                          message: "Ticket price must be at least 0",
                        },
                      })}
                      type="number"
                      className="input-text w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                  <ErrorMessage
                    name={`tickets.${index}.price`}
                    errors={errors}
                    render={({ message }) => (
                      <p className="text-red-500 text-sm mt-1">{message}</p>
                    )}
                  />
                </FormItem>
                <FormItem label="Quantity">
                  <input
                    {...register(`tickets.${index}.quantity`, {
                      required: "Ticket quantity is required",
                      min: {
                        value: 1,
                        message: "Ticket quantity must be at least 1",
                      },
                    })}
                    type="number"
                    className="input-text w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:border-blue-500 transition"
                  />
                </FormItem>
              </div>
              <FormItem label="Description" className="mt-4">
                <textarea
                  {...register(`tickets.${index}.description`, {
                    required: "Ticket description is required",
                    minLength: {
                      value: 10,
                      message:
                        "Ticket description must be at least 10 characters",
                    },
                    maxLength: {
                      value: 200,
                      message:
                        "Ticket description must be less than 200 characters",
                    },
                  })}
                  className="input-text w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:border-blue-500 transition"
                ></textarea>
                <ErrorMessage
                  name={`tickets.${index}.description`}
                  errors={errors}
                  render={({ message }) => (
                    <p className="text-red-500 text-sm mt-1">{message}</p>
                  )}
                />
              </FormItem>
              <div className="flex justify-end mt-4">
                <div className="flex justify-end">
                  {ticket.id === null && (
                    <button
                      onClick={() => {
                        const tickets = watch("tickets");
                        const updatedTickets = tickets.filter(
                          (_, ticketIndex) => ticketIndex !== index
                        );
                        setValue("tickets", updatedTickets);
                      }}
                      className="text-red-500 hover:underline"
                    >
                      Remove this ticket type
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-8">
          <ButtonPrimary
            onClick={() => {
              const tickets = watch("tickets");
              const newTickets = [
                ...tickets,
                {
                  name: "",
                  price: 0,
                  quantity: 0,
                  description: "",
                  id: null,
                },
              ];
              setValue("tickets", newTickets);
            }}
          >
            Add Ticket
          </ButtonPrimary>
        </div>
        <div className="flex justify-end space-x-5 mt-8">
          <ButtonSecondary href={`/organizer/event/${eventId}/edit/4`}>
            Go back
          </ButtonSecondary>
          <ButtonPrimary onClick={handleSubmit(onSubmit)} loading={loading}>
            Continue
          </ButtonPrimary>
        </div>
      </>
    </CommonLayout>
  );
};

export default PageAddListing5;
