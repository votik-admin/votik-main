"use client";

import ButtonCustom from "@app/shared/Button/ButtonCustom";
import ButtonClose from "@app/shared/ButtonClose/ButtonClose";
import NcImage from "@app/shared/NcImage/NcImage";
import { Tables } from "@app/types/database.types";
import formatDate from "@app/utils/formatDate";
import { Dialog, Transition } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import Ticket from "../Ticket/Ticket";
import MobileTicket from "../Ticket/MobileTicket";
import Link from "next/link";

export default function ViewBooking({
  event,
  data,
}: {
  event: Tables<"events">;
  data: Tables<"ticket_bookings"> & {
    events: Tables<"events"> | null;
    tickets: Tables<"tickets"> | null;
    users: Tables<"users"> | null;
  };
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookingHash, setBookingHash] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookingHash = async () => {
      setLoading(true);
      const response = await fetch(`/api/qr/${event.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBookingHash(data.data);
      }
      setLoading(false);
    };

    fetchBookingHash();
  }, []);

  return (
    <div className="space-y-6 max-w-3xl my-12 mx-auto shadow-lg p-6 rounded-xl bg-white dark:bg-neutral-800">
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
            <Link href={`/events/${event?.slug}`} passHref>
              <span className="text-base sm:text-lg font-medium mt-1 block hover:underline decoration-dashed decoration-slate-400 underline-offset-4">
                {event?.name}
              </span>
            </Link>
          </div>
          {[data].map((ticket, key) => (
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
              {[data]
                .map((ticket) => ticket.booked_count)
                .reduce((a, b) => a + b, 0)}{" "}
              {[data]
                .map((ticket) => ticket.booked_count)
                .reduce((a, b) => a + b, 0) > 1
                ? "tickets"
                : "ticket"}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-stretch">
        <ButtonCustom
          className="w-full"
          onClick={() => {
            setOpen(true);
          }}
        >
          VIEW TICKET
        </ButtonCustom>
      </div>
      {
        // Modal with transition
        <Transition appear show={open} as={React.Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-50 overflow-y-auto dark bg-neutral-800 text-neutral-200 hiddenScrollbar"
            onClose={() => setOpen(false)}
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
                      className="sm:w-12 sm:h-12"
                      onClick={() => setOpen(false)}
                    />
                  </div>

                  {/* For larger screens */}
                  <div className="hidden md:block">
                    {loading || !bookingHash ? (
                      <NcImage className="animate-pulse" src="" />
                    ) : (
                      <Ticket
                        ticket={{
                          name: event.name!,
                          date: formatDate(event.start_time),
                          venue: event.location ?? "",
                          bookingId: bookingHash!,
                          amount: data.booked_count * data.tickets!.price,
                          count: data.booked_count,
                          price: data.tickets!.price,
                          convenienceFree: 0,
                          imgSrc: event.primary_img!,
                        }}
                      />
                    )}
                  </div>

                  {/* For smaller screens */}
                  <div className="md:hidden">
                    {
                      // If loading, show a loading animation
                      loading || !bookingHash ? (
                        <NcImage
                          className="animate-pulse"
                          src=""
                          alt="loading"
                        />
                      ) : (
                        <MobileTicket
                          ticket={{
                            name: event.name!,
                            date: formatDate(event.start_time),
                            venue: event.location ?? "",
                            bookingId: bookingHash!,
                            amount: data.booked_count * data.tickets!.price,
                            count: data.booked_count,
                            price: data.tickets!.price,
                            convenienceFree: 0,
                            imgSrc: event.primary_img!,
                          }}
                        />
                      )
                    }
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      }
    </div>
  );
}
