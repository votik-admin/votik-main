"use client";
import Label from "@app/components/Label/Label";
import NcInputNumber from "@app/components/NcInputNumber/NcInputNumber";
import ButtonCustom from "@app/shared/Button/ButtonCustom";
import Input from "@app/shared/Input/Input";
import { Tables } from "@app/types/database.types";
import convertNumbThousand from "@app/utils/convertNumbThousand";
import { ErrorMessage } from "@hookform/error-message";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

type ConfirmAccountDetailsForm = {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phoneNumber: string | null;
};

const SectionChoseTicket = ({
  tickets,
  user,
  event_id,
}: {
  tickets: Tables<"tickets">[];
  user: Tables<"users">;
  event_id?: string;
}) => {
  const router = useRouter();

  const [selectedTickets, setSelectedTickets] = useState(
    Object.fromEntries(tickets.map((ticket) => [ticket.id, 0]))
  );
  const [price, setPrice] = useState(
    Object.fromEntries(tickets.map((ticket) => [ticket.id, 0]))
  );

  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<1 | 2>(1);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ConfirmAccountDetailsForm>({
    defaultValues: {
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phoneNumber: user.phone_number,
    },
  });

  const createOrderId = async () => {
    const amount = Object.values(price).reduce((a, b) => a + b, 0);
    const response = await fetch("/api/razorpay/createOrder", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount * 100,
        currency: "INR",
        notes: { event_id, selectedTickets }, // user_id is appended server side
      }),
    });

    const json = await response.json();
    if (json.error) {
      throw new Error(json.message);
    }
    return json.data.orderId;
  };

  const processPayment = async (formData: ConfirmAccountDetailsForm) => {
    setLoading(true);
    try {
      const orderId: string = await createOrderId();

      if (!window.Razorpay) {
        toast.error("Couldn't load Razorpay, please refresh the page.");
        return;
      }

      const amount = Object.values(price).reduce((a, b) => a + b, 0);
      const paymentObject = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: "INR",
        name: "Votik",
        description: "Ticket Payment",
        order_id: orderId,
        handler: async function (response: any) {
          const data = {
            orderCreationId: orderId, // Retrieve the order_id from your server. Do not use the razorpay_order_id returned by Checkout.
            razorpayPaymentId: response.razorpay_payment_id,
            // razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            accountDetails: formData,
          };
          const toastId = toast.loading("Verifying your payment...");
          const result = await fetch("/api/razorpay/verifyPayment", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
          });
          const res = await result.json();
          if (res.error) {
            console.log(res);
            toast.error(res.message, { id: toastId });
          } else {
            toast.success(res.message, { id: toastId });
            router.push(`/pay-success/${response.razorpay_order_id}`);
          }
        },
        prefill: {
          name: user.first_name + " " + user.last_name,
          email: user.email,
          contact: user.phone_number,
        },
        theme: {
          color: "#430D7F",
        },
      });
      paymentObject.on("payment.failed", function (response: any) {
        console.log({ response });
        toast.error(response.error.description);
      });
      paymentObject.open();
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderConfirmYourDetails = () => {
    return (
      <div className="listingSection__wrap !space-y-6">
        {/* Confirm your details */}
        <div>
          <h2 className="text-2xl font-semibold">Confirm your details</h2>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between space-x-2">
              <div className="w-full">
                <Label>First Name</Label>
                <Input
                  type="text"
                  className="mt-1.5 w-full"
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                />
                <ErrorMessage
                  render={(data) => (
                    <p className="text-red-500 mt-2 text-sm">{data.message}</p>
                  )}
                  errors={errors}
                  name="firstName"
                />
              </div>
              <div className="w-full">
                <Label>Last Name</Label>
                <Input
                  type="text"
                  className="mt-1.5 w-full"
                  {...register("lastName")}
                />
                <ErrorMessage
                  render={(data) => (
                    <p className="text-red-500 mt-2 text-sm">{data.message}</p>
                  )}
                  errors={errors}
                  name="lastName"
                />
              </div>
            </div>
            {errors.firstName && (
              <p className="text-red-500 mt-2 text-sm">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Tickets will be sent to this email"
              className="mt-1.5"
              {...register("email", {
                required: "Email is required",
              })}
            />
            <ErrorMessage
              render={(data) => (
                <p className="text-red-500 mt-2 text-sm">{data.message}</p>
              )}
              errors={errors}
              name="email"
            />
          </div>
          <div>
            <Label>Phone Number</Label>
            <Input
              type="tel"
              className="mt-1.5"
              {...register("phoneNumber", {
                required: "Phone number is required",
              })}
            />
            <ErrorMessage
              render={(data) => (
                <p className="text-red-500 mt-2 text-sm">{data.message}</p>
              )}
              errors={errors}
              name="phoneNumber"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderChoseTickets = () => {
    return (
      <div className="listingSection__wrap !space-y-6 pb-24 lg:pb-4">
        {/* Chose tickets */}
        <div>
          <h2 className="text-2xl font-semibold">Chose Tickets</h2>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="border dark:border-neutral-700 rounded-lg p-4"
            >
              <p className="text-lg font-medium">{ticket.name}</p>
              <NcInputNumber
                className="w-full mt-2"
                defaultValue={0}
                onChange={(val) => {
                  setSelectedTickets({
                    ...selectedTickets,
                    [ticket.id]: val,
                  });
                  setPrice({ ...price, [ticket.id]: val * ticket.price });
                }}
                max={Math.min(10, ticket.current_available_count)}
                min={0}
                label={"₹ " + convertNumbThousand(ticket.price)}
                desc=""
                availableCount={ticket.current_available_count}
              />

              <p className="text-neutral-500 dark:text-neutral-400 border-t dark:border-neutral-700 mt-4 pt-4">
                {ticket.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      {stage === 1 && renderChoseTickets()}
      {stage === 2 && renderConfirmYourDetails()}
      <div
        className={`fixed bottom-0 inset-x-0 transition ${
          Object.values(selectedTickets).reduce((a, b) => a + b, 0) !== 0
            ? "opacity-100"
            : "opacity-0"
        }`}
      >
        <div className="flex bg-neutral-800 justify-between items-center border-t dark:border-neutral-700 px-4 py-2 xl:px-8 xl:py-4">
          <div>
            <h2 className="text-2xl font-semibold">
              ₹{" "}
              {convertNumbThousand(
                Object.values(price).reduce((a, b) => a + b, 0)
              )}
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400">
              <span className="font-semibold">
                {Object.values(selectedTickets).reduce((a, b) => a + b, 0)}
              </span>
              {Object.values(selectedTickets).reduce((a, b) => a + b, 0) > 1
                ? " tickets"
                : " ticket"}
            </p>
          </div>
          {stage === 1 && (
            <ButtonCustom onClick={() => setStage(2)}>
              PROCEED TO PAY
            </ButtonCustom>
          )}
          {stage === 2 && (
            <ButtonCustom
              id="rzp-button1"
              onClick={handleSubmit(processPayment)}
              loading={loading}
            >
              CHECK OUT
            </ButtonCustom>
          )}
        </div>
      </div>
    </div>
  );
};

export default SectionChoseTicket;
