"use client";

import { Tab } from "@headlessui/react";
import CarCard from "@app/components/CarCard/CarCard";
import CommentListing from "@app/components/CommentListing/CommentListing";
import ExperiencesCard from "@app/components/ExperiencesCard/ExperiencesCard";
import StartRating from "@app/components/StartRating/StartRating";
import StayCard from "@app/components/StayCard/StayCard";
import React, { FC, Fragment, useState } from "react";
import Avatar from "@app/shared/Avatar/Avatar";
import ButtonSecondary from "@app/shared/Button/ButtonSecondary";
import SocialsList from "@app/shared/SocialsList/SocialsList";
import { Tables } from "@app/types/database.types";
import supabase from "@app/lib/supabase";
import usePagination from "@app/hooks/usePagination";
import CardCategoryCustomSkeleton from "@app/components/CardCategoryCustom/CardCategoryCustomSkeleton";
import CardCategoryCustom from "@app/components/CardCategoryCustom/CardCategoryCustom";
import getCreatedAt from "@app/utils/getCreatedAt";

export interface VenuePageProps {
  className?: string;
  venue: Tables<"venues">;
}

const TicketTimeline = ["Upcoming", "Past"] as const;

const EventTab = ({
  type,
  venueId: venueId,
}: {
  type: (typeof TicketTimeline)[number];
  venueId: string;
}) => {
  const baseQuery = supabase
    .from("events")
    .select("*, tickets(price)")
    .eq("venue", venueId);

  const [page, setPage] = useState(1);

  const getQueryForTab = (tabIndex: number) => {
    switch (tabIndex) {
      case 0:
        return baseQuery
          .gt("start_time", new Date().toISOString())
          .order("created_at", { ascending: false });
      case 1:
        return baseQuery
          .lte("start_time", new Date().toISOString())
          .order("created_at", { ascending: true });
      default:
        return null;
    }
  };

  const { data, loading, error } = usePagination<
    Tables<"events"> & {
      tickets: Tables<"tickets">[];
    }
  >({
    pageSize: 12,
    page,
    query: getQueryForTab(TicketTimeline.indexOf(type)),
  });

  return (
    <Tab.Panel className="mt-8">
      <div className="mt-8 grid grid-cols-1 gap-6 md:gap-7 sm:grid-cols-2">
        {loading &&
          Array.from({ length: 4 }).map((_, id) => (
            <CardCategoryCustomSkeleton key={id} />
          ))}
        {data &&
          data.map((event) => (
            <CardCategoryCustom key={event.id} taxonomy={event} />
          ))}
        {data.length === 0 && (
          <p className="text-lg text-neutral-500 dark:text-neutral-400 text-center w-full">
            No events found
          </p>
        )}
      </div>
      <div className="flex mt-11 justify-center items-center">
        <ButtonSecondary onClick={() => setPage((prev) => prev + 1)}>
          Show me more
        </ButtonSecondary>
      </div>
    </Tab.Panel>
  );
};

const VenuePage: FC<VenuePageProps> = ({ className = "", venue }) => {
  const renderSidebar = () => {
    return (
      <div className=" w-full flex flex-col items-center text-center sm:rounded-2xl sm:border border-neutral-200 dark:border-neutral-700 space-y-6 sm:space-y-7 px-0 sm:p-6 xl:p-8 bg-white dark:bg-neutral-900">
        <Avatar
          hasChecked
          hasCheckedClass="w-6 h-6 -top-0.5 right-2"
          sizeClass="w-28 h-28"
          imgUrl={venue.image ?? undefined}
        />

        {/* ---- */}
        <div className="space-y-3 text-center flex flex-col items-center">
          <h2 className="text-3xl font-semibold">{venue.name}</h2>
          {/* <StartRating className="!text-base" /> */}
          <p className="text-neutral-500 dark:text-neutral-400">
            @{venue.slug}
          </p>
        </div>

        {/* ---- */}
        <p className="text-neutral-500 dark:text-neutral-400">
          {venue.description}
        </p>

        {/* ---- */}
        {/* <SocialsList
          className="!space-x-3"
          itemClass="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xl"
        /> */}

        {/* ---- */}
        <div className="border-b border-neutral-200 dark:border-neutral-700 w-14"></div>

        {/* ---- */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-neutral-6000 dark:text-neutral-300">
              {venue.address} - {venue.city}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-neutral-6000 dark:text-neutral-300">
              Joined in {getCreatedAt(venue.created_at)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderSection1 = () => {
    return (
      <div className="listingSection__wrap bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-2xl">
        <div>
          <h2 className="text-2xl font-semibold">Events at {venue.name}</h2>
          {/* <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            Kevin Francis's listings is very rich, 5 star reviews help him to be
            more branded.
          </span> */}
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
              <EventTab key={item} type={item} venueId={venue.id} />
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    );
  };

  const renderSection2 = () => {
    return (
      <div className="listingSection__wrap">
        {/* HEADING */}
        <h2 className="text-2xl font-semibold">Reviews (23 reviews)</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        {/* comment */}
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          <CommentListing hasListingTitle className="pb-8" />
          <CommentListing hasListingTitle className="py-8" />
          <CommentListing hasListingTitle className="py-8" />
          <CommentListing hasListingTitle className="py-8" />
          <div className="pt-8">
            <ButtonSecondary>View more 20 reviews</ButtonSecondary>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`${className}`}>
      <main className="container mt-12 mb-24 lg:mb-32 flex flex-col lg:flex-row">
        <div className="block flex-grow mb-24 lg:mb-0">
          <div className="lg:sticky lg:top-24">{renderSidebar()}</div>
        </div>
        <div className="w-full lg:w-3/5 xl:w-2/3 space-y-8 lg:space-y-10 lg:pl-10 flex-shrink-0">
          {renderSection1()}
          {/* {renderSection2()} */}
        </div>
      </main>
    </div>
  );
};

export default VenuePage;
