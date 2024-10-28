import React, { FC, useState } from "react";
import NcImage from "@app/shared/NcImage/NcImage";
import { TaxonomyType } from "@app/data/types";
import Link from "next/link";
import convertNumbThousand from "@app/utils/convertNumbThousand";
import { Tables } from "@app/types/database.types";
import formatDate from "@app/utils/formatDate";
import ButtonCustom from "@app/shared/Button/ButtonCustom";
import { Dialog, Transition } from "@headlessui/react";
import ButtonClose from "@app/shared/ButtonClose/ButtonClose";
import Ticket from "../Ticket/Ticket";
import MobileTicket from "../Ticket/MobileTicket";
import generateBookingId from "@app/utils/generateCustomBookingId";

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
  const { slug, name, city, location, start_time, primary_img } =
    taxonomy.events;
  const href = `/events/${slug}`;

  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl overflow-hidden">
      <div
        className={`flex-shrink-0 relative group cursor-pointer ${className}`}
        onClick={() => {
          setOpen(true);
        }}
      >
        <NcImage
          src={primary_img}
          className="object-cover w-full aspect-[1/1] origin-top object-top"
        />
        <span className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black bg-opacity-10 transition-opacity"></span>
      </div>

      <div className="truncate bg-white p-4">
        <Link href={href}>
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
          <ButtonCustom
            className="w-full"
            onClick={() => {
              setOpen(true);
            }}
          >
            VIEW TICKET
          </ButtonCustom>
        </div>
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
                    <Ticket
                      ticket={{
                        name,
                        date: formatDate(start_time),
                        venue: (location ? location + ", " : "") + city,
                        price: taxonomy.tickets.price,
                        convenienceFree: 0,
                        amount: taxonomy.tickets.price,
                        bookingId: generateBookingId(taxonomy.id),
                        count: taxonomy.booked_count,
                        imgSrc: primary_img,
                      }}
                    />
                  </div>

                  {/* For smaller screens */}
                  <div className="md:hidden">
                    <MobileTicket
                      ticket={{
                        name,
                        date: formatDate(start_time),
                        venue: (location ? location + ", " : "") + city,
                        price: taxonomy.tickets.price,
                        convenienceFree: 0,
                        amount: taxonomy.tickets.price,
                        bookingId: generateBookingId(taxonomy.id),
                        count: taxonomy.booked_count,
                        imgSrc: primary_img,
                      }}
                    />
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      }
    </div>
  );
};

export default TicketDetails;
