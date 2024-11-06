"use client";

import { Tab } from "@headlessui/react";
import CarCard from "@app/components/CarCard/CarCard";
import ExperiencesCard from "@app/components/ExperiencesCard/ExperiencesCard";
import StayCard from "@app/components/StayCard/StayCard";
import {
  DEMO_CAR_LISTINGS,
  DEMO_EXPERIENCES_LISTINGS,
  DEMO_STAY_LISTINGS,
} from "@app/data/listings";
import React, { Fragment, useEffect, useState } from "react";
import ButtonSecondary from "@app/shared/Button/ButtonSecondary";
import CommonLayout from "./CommonLayout";
import usePagination from "@app/hooks/usePagination";
import supabase from "@app/lib/supabase";
import TicketDetails from "@app/components/TicketDetails/TicketDetails";
import { Tables } from "@app/types/database.types";

type Ticket = Tables<"ticket_bookings"> & {
  events: Tables<"events">;
  tickets: Tables<"tickets">;
};

const TicketTimeline = ["Upcoming", "Past", "Cancelled"] as const;

const TicketTab = ({ type }: { type: (typeof TicketTimeline)[number] }) => {
  const baseQuery = supabase
    .from("ticket_bookings")
    .select(`*, events!inner(*), tickets!inner(*)`); // !inner is required, see https://stackoverflow.com/questions/69137919/filtering-in-join-in-supabase

  const [actualData, setActualData] = useState<{ [ticketId: string]: Ticket }>(
    {}
  );
  const [page, setPage] = useState(1);

  const getQueryForTab = (tabIndex: number) => {
    switch (tabIndex) {
      case 0:
        return baseQuery
          .gt("events.start_time", new Date().toISOString())
          .order("created_at", { ascending: false });
      case 1:
        return baseQuery
          .lte("events.start_time", new Date().toISOString())
          .order("created_at", { ascending: true });
      case 2:
        return baseQuery
          .eq("status", "CANCELED")
          .order("created_at", { ascending: true });
      default:
        return null;
    }
  };

  const { data, loading, error } = usePagination<Ticket>({
    pageSize: 12,
    page,
    query: getQueryForTab(TicketTimeline.indexOf(type)),
  });

  useEffect(() => {
    if (data) {
      setActualData((prev) => {
        return {
          ...prev,
          ...data.reduce((acc, item) => {
            acc[item.id] = item;
            return acc;
          }, {} as { [ticketId: string]: Ticket }),
        };
      });
    }
  }, [data]);

  const renderContent = () => {
    if (error) return <p>Error: {error.message}</p>;

    if (loading)
      return (
        // Show skeleton loader
        <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, key) => {
            return (
              <div key={key}>
                <div className="animate-pulse bg-neutral-200 dark:bg-neutral-800 h-48 rounded-xl"></div>
                <div className="flex justify-between items-center mt-3">
                  <div className="w-1/2 h-4 bg-neutral-200 dark:bg-neutral-800 rounded-full"></div>
                  <div className="w-1/4 h-4 bg-neutral-200 dark:bg-neutral-800 rounded-full"></div>
                </div>
              </div>
            );
          })}
        </div>
      );

    if (Object.keys(actualData).length === 0) {
      return (
        <div className="flex justify-center items-center h-48">
          <p className="text-neutral-500 dark:text-neutral-400">
            No tickets found. 🎟
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Object.values(actualData).map((ticket) => {
            return <TicketDetails key={ticket.id} taxonomy={ticket} />;
          })}
        </div>
        <div className="flex mt-11 justify-center items-center">
          <ButtonSecondary
            onClick={() => {
              setPage((prev) => prev + 1);
            }}
            loading={loading}
          >
            Show me more
          </ButtonSecondary>
        </div>
      </>
    );
  };

  return <Tab.Panel className="mt-8">{renderContent()}</Tab.Panel>;
};

const AccountBookings: React.FC = () => {
  return (
    <div>
      <CommonLayout>
        <div className="space-y-6 sm:space-y-8">
          <div>
            <h2 className="text-3xl font-semibold">Bookings</h2>
          </div>
          <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
          <Tab.Group>
            <Tab.List className="flex space-x-1 overflow-x-auto">
              {TicketTimeline.map((item) => (
                <Tab key={item} as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={`flex-shrink-0 block font-medium px-5 py-2.5 text-sm sm:text-base capitalize rounded-full ${
                        selected
                          ? "bg-secondary-900 text-secondary-50"
                          : "text-neutral-500 dark:text-neutral-400"
                      }`}
                    >
                      {item}
                    </button>
                  )}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels>
              {TicketTimeline.map((item) => (
                <TicketTab key={item} type={item} />
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </CommonLayout>
    </div>
  );
};

export default AccountBookings;
