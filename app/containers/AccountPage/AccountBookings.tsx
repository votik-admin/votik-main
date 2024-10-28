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

type Ticket = {
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  ticketNumber: string;
  ticketPrice: string;
  ticketStatus: string;
  ticketType: string;
  eventImage: string;
  ticketCount: string;
};

const AccountBookings: React.FC = () => {
  const categories = ["Upcoming", "Past", "Cancelled"];
  const [selectedTab, setSelectedTab] = useState(1);

  const baseQuery = supabase
    .from("ticket_bookings")
    .select(`*, events!inner(*)`); // !inner is required, see https://stackoverflow.com/questions/69137919/filtering-in-join-in-supabase

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

  const { count, data } = usePagination<Ticket>({
    query: getQueryForTab(selectedTab),
    page: 1,
    pageSize: 10,
  });

  console.log({ data });

  useEffect(() => {
    getQueryForTab(selectedTab);
  }, [selectedTab]);

  const renderContent = () => {
    if (!data) return <p>Loading...</p>;

    return (
      <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((ticket) => JSON.stringify(ticket))}
      </div>
    );
  };

  return (
    <div>
      <CommonLayout>
        <div className="space-y-6 sm:space-y-8">
          <div>
            <h2 className="text-3xl font-semibold">Bookings</h2>
          </div>
          <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
          <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
            <Tab.List className="flex space-x-1 overflow-x-auto">
              {categories.map((item) => (
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
              <Tab.Panel className="mt-8">{renderContent()}</Tab.Panel>
              <Tab.Panel className="mt-8">{renderContent()}</Tab.Panel>
              <Tab.Panel className="mt-8">{renderContent()}</Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
          <div className="flex mt-11 justify-center items-center">
            <ButtonSecondary
              onClick={() => {
                console.log("Show me more");
              }}
            >
              Show me more
            </ButtonSecondary>
          </div>
        </div>
      </CommonLayout>
    </div>
  );
};

export default AccountBookings;
