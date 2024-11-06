import StartRating from "@app/components/StartRating/StartRating";
import React, { FC } from "react";
import ButtonPrimary from "@app/shared/Button/ButtonPrimary";
import NcImage from "@app/shared/NcImage/NcImage";
import { createClient } from "@app/lib/supabase/server";
import { notFound } from "next/navigation";
import formatDate from "@app/utils/formatDate";
import Link from "next/link";
import ConfettiBoom from "@app/shared/Confetti/Confetti";
import ButtonSecondary from "@app/shared/Button/ButtonSecondary";

const PayPage = async ({
  params: { razorpay_order_id },
}: {
  params: {
    razorpay_order_id: string;
  };
}) => {
  const supabaseServerClient = createClient();
  const { data, error } = await supabaseServerClient
    .from("ticket_bookings")
    .select("*, tickets(*), events(*)")
    .eq("razorpay_order_id", razorpay_order_id);

  if (error || data.length === 0) {
    console.log(error);
    return notFound();
  }

  const event = data[0].events;

  const renderContent = () => {
    return (
      <div className="w-full flex flex-col sm:rounded-2xl sm:border border-neutral-200 dark:border-neutral-700 space-y-8 px-0 sm:p-6 xl:p-8">
        <h2 className="text-3xl lg:text-4xl font-semibold">
          Congratulation 🎉
        </h2>

        <div className="border-b border-neutral-200 dark:border-neutral-700"></div>

        {/* ------------------------ */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">Your booking</h3>
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="flex-shrink-0 w-full sm:w-40">
              <div className=" aspect-w-4 aspect-h-3 sm:aspect-h-4 rounded-2xl overflow-hidden">
                <NcImage src={event?.primary_img || ""} />
              </div>
            </div>
            <div className="pt-5  sm:pb-5 sm:px-5 space-y-3">
              <div>
                <span className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-1">
                  {event?.location}
                </span>
                <span className="text-base sm:text-lg font-medium mt-1 block">
                  {event?.name}
                </span>
              </div>
              {data.map((ticket, key) => (
                <span
                  key={key}
                  className="block  text-sm text-neutral-500 dark:text-neutral-400"
                >
                  {ticket.booked_count + " " + ticket.tickets?.name}
                </span>
              ))}
              {/* <div className="w-10 border-b border-neutral-200  dark:border-neutral-700"></div> */}
              {/* <StartRating /> */}
            </div>
          </div>
          <div className="mt-6 border border-neutral-200 dark:border-neutral-700 rounded-3xl flex flex-col sm:flex-row divide-y sm:divide-x sm:divide-y-0 divide-neutral-200 dark:divide-neutral-700">
            <div className="flex-1 p-5 flex space-x-4">
              <svg
                className="w-8 h-8 text-neutral-300 dark:text-neutral-6000"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.33333 8.16667V3.5M18.6667 8.16667V3.5M8.16667 12.8333H19.8333M5.83333 24.5H22.1667C23.4553 24.5 24.5 23.4553 24.5 22.1667V8.16667C24.5 6.878 23.4553 5.83333 22.1667 5.83333H5.83333C4.54467 5.83333 3.5 6.878 3.5 8.16667V22.1667C3.5 23.4553 4.54467 24.5 5.83333 24.5Z"
                  stroke="#D1D5DB"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <div className="flex flex-col">
                <span className="text-sm text-neutral-400">Time</span>
                <span className="mt-1.5 text-lg font-semibold">
                  {formatDate(event?.start_time || "")}
                </span>
              </div>
            </div>
            <div className="flex-1 p-5 flex space-x-4">
              <svg
                className="w-8 h-8 text-neutral-300 dark:text-neutral-6000"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 5.07987C14.8551 4.11105 16.1062 3.5 17.5 3.5C20.0773 3.5 22.1667 5.58934 22.1667 8.16667C22.1667 10.744 20.0773 12.8333 17.5 12.8333C16.1062 12.8333 14.8551 12.2223 14 11.2535M17.5 24.5H3.5V23.3333C3.5 19.4673 6.63401 16.3333 10.5 16.3333C14.366 16.3333 17.5 19.4673 17.5 23.3333V24.5ZM17.5 24.5H24.5V23.3333C24.5 19.4673 21.366 16.3333 17.5 16.3333C16.225 16.3333 15.0296 16.6742 14 17.2698M15.1667 8.16667C15.1667 10.744 13.0773 12.8333 10.5 12.8333C7.92267 12.8333 5.83333 10.744 5.83333 8.16667C5.83333 5.58934 7.92267 3.5 10.5 3.5C13.0773 3.5 15.1667 5.58934 15.1667 8.16667Z"
                  stroke="#D1D5DB"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <div className="flex flex-col">
                <span className="text-sm text-neutral-400">Tickets</span>
                <span className="mt-1.5 text-lg font-semibold">
                  {data
                    .map((ticket) => ticket.booked_count)
                    .reduce((a, b) => a + b, 0)}{" "}
                  {data
                    .map((ticket) => ticket.booked_count)
                    .reduce((a, b) => a + b, 0) > 1
                    ? "tickets"
                    : "ticket"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------ */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">Booking detail</h3>
          <div className="flex flex-col space-y-4">
            <div className="flex text-neutral-6000 dark:text-neutral-300">
              <span className="flex-1">Order ID</span>
              <span className="flex-1 font-medium text-neutral-900 dark:text-neutral-100">
                {data[0].razorpay_order_id}
              </span>
            </div>
            <div className="flex text-neutral-6000 dark:text-neutral-300">
              <span className="flex-1">Payment ID</span>
              <span className="flex-1 font-medium text-neutral-900 dark:text-neutral-100">
                {data[0].razorpay_payment_id}
              </span>
            </div>
            <div className="flex text-neutral-6000 dark:text-neutral-300">
              <span className="flex-1">Payment initated at</span>
              <span className="flex-1 font-medium text-neutral-900 dark:text-neutral-100">
                {new Date(data[0].payment_initiated_timestamp!).toUTCString()}
              </span>
            </div>
            <div className="flex text-neutral-6000 dark:text-neutral-300">
              <span className="flex-1">Payment completed at</span>
              <span className="flex-1 font-medium text-neutral-900 dark:text-neutral-100">
                {new Date(data[0].payment_successful_timestamp!).toUTCString()}
              </span>
            </div>
            <div className="flex text-neutral-6000 dark:text-neutral-300">
              <span className="flex-1">Total</span>
              <span className="flex-1 font-medium text-neutral-900 dark:text-neutral-100">
                ₹{" "}
                {data
                  .map(
                    (ticket) =>
                      (ticket.tickets?.price ?? 0) * ticket.booked_count
                  )
                  .reduce((a, b) => a + b, 0)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end sm:gap-6 gap-4">
          <Link href="/">
            <ButtonSecondary>Explore more events</ButtonSecondary>
          </Link>
          <Link href={`/user/account/bookings/${data[0].id}`}>
            <ButtonPrimary>View your booking</ButtonPrimary>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className={`nc-PayPage`} data-nc-id="PayPage">
      <ConfettiBoom />
      <main className="container mt-11 mb-24 lg:mb-32 ">
        <div className="max-w-4xl mx-auto">{renderContent()}</div>
      </main>
    </div>
  );
};

export default PayPage;
