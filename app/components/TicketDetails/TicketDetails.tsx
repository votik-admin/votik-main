"use client";

import React, { FC, useEffect, useState } from "react";
import NcImage from "@app/shared/NcImage/NcImage";
import Link from "next/link";
import { Tables } from "@app/types/database.types";
import formatDate from "@app/utils/formatDate";
import ButtonCustom from "@app/shared/Button/ButtonCustom";
import { Dialog, Transition } from "@headlessui/react";
import ButtonClose from "@app/shared/ButtonClose/ButtonClose";
import Ticket from "@app/components/Ticket/Ticket";
import MobileTicket from "../Ticket/MobileTicket";
import generateBookingId from "@app/utils/generateCustomBookingId";
import { useRouter } from "next/navigation";

export interface TicketDetailsProps {
  className?: string;
  taxonomy: Tables<"ticket_bookings"> & {
    events: Tables<"events">;
    tickets: Tables<"tickets">;
  };
}

const TicketDetails: FC<TicketDetailsProps> = ({
  className = "",
  taxonomy,
}) => {
  const event = taxonomy.events;

  const router = useRouter();

  const { name, city, location, start_time, primary_img } = event;

  const [open, setOpen] = useState(false);

  const [bookingHash, setBookingHash] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingHash = async () => {
      setLoading(true);
      const response = await fetch(`/api/qr/${taxonomy.id}`, {
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
    <div className="rounded-2xl overflow-hidden">
      <div
        className={`flex-shrink-0 relative group cursor-pointer ${className}`}
        onClick={() => {
          setOpen(true);
        }}
      >
        <NcImage
          src={primary_img!}
          className="object-cover w-full aspect-[1/1] origin-top object-top"
        />
        <span className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black bg-opacity-10 transition-opacity"></span>
      </div>

      <div className="truncate bg-white p-4">
        <Link href={`/user/account/bookings/${taxonomy.id}`}>
          <h2 className="text-base sm:text-lg text-neutral-900 font-semibold truncate line-clamp-2 text-wrap hover:underline decoration-dashed decoration-slate-400 underline-offset-4">
            {name}
          </h2>
        </Link>
        <span className="block mt-2 text-sm text-neutral-6000">
          {formatDate(start_time)}
        </span>
        <span className="block text-sm text-neutral-6000 truncate">
          {location}
        </span>
        <div className="mt-4 flex items-stretch">
          <Link
            href={`/user/account/bookings/${taxonomy.id}`}
            className="font-bebasNeue text-[22px] flex items-center justify-center bg-[#430D7F] text-[#C3FD07] px-4 py-2 rounded-lg hover:shadow w-full"
          >
            VIEW BOOKING
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
