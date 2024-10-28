"use client";
import NcInputNumber from "@app/components/NcInputNumber/NcInputNumber";
import ButtonCustom from "@app/shared/Button/ButtonCustom";
import { Tables } from "@app/types/database.types";
import convertNumbThousand from "@app/utils/convertNumbThousand";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

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
    console.log(json);
    if (json.error) {
      throw new Error(json.message);
    }
    return json.data.orderId;
  };

  const processPayment = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const amount = Object.values(price).reduce((a, b) => a + b, 0);
    setLoading(true);
    try {
      const orderId: string = await createOrderId();

      if (!window.Razorpay) {
        toast.error("Couldn't load Razorpay, please refresh the page.");
        return;
      }

      const paymentObject = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: "INR",
        // TODO
        name: "Votik",
        description: "Ticket Payment",
        order_id: orderId,
        handler: async function (response: any) {
          const data = {
            orderCreationId: orderId, // Retrieve the order_id from your server. Do not use the razorpay_order_id returned by Checkout.
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };
          const toastId = toast.loading("Verifying your payment...");
          const result = await fetch("/api/razorpay/verifyPayment", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
          });
          const res = await result.json();
          console.log({ res });
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
      console.log("Finally block executed");
      setLoading(false);
    }
  };

  return (
    <div className="listingSection__wrap !space-y-6">
      {/* HEADING */}
      <Toaster position="bottom-center" />
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
      {Object.values(selectedTickets).reduce((a, b) => a + b, 0) !== 0 && (
        <div className="flex justify-between items-center border-t dark:border-neutral-700 pt-4 xl:pt-8 -mx-4 px-4 xl:-mx-8 xl:px-8">
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
          <ButtonCustom
            id="rzp-button1"
            onClick={(e) => processPayment(e)}
            loading={loading}
          >
            PROCEED TO CHECK OUT
          </ButtonCustom>
        </div>
      )}
    </div>
  );
};

export default SectionChoseTicket;
