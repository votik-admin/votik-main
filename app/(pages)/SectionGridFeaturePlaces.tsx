"use client";

import React, { FC, ReactNode, useState } from "react";
import { DEMO_STAY_LISTINGS } from "@app/data/listings";
import { StayDataType } from "@app/data/types";
import ButtonPrimary from "@app/shared/Button/ButtonPrimary";
import HeaderFilter from "./HeaderFilter";
import StayCard from "@app/components/StayCard/StayCard";
import useSWR from "swr";
import { getAllEvents } from "@app/queries";
import { Database } from "@app/types/database.types";
import CardCategoryCustom from "@app/components/CardCategoryCustom/CardCategoryCustom";
import CardCategoryCustomSkeleton from "@app/components/CardCategoryCustom/CardCategoryCustomSkeleton";

// OTHER DEMO WILL PASS PROPS
const DEMO_DATA: StayDataType[] = DEMO_STAY_LISTINGS.filter((_, i) => i < 8);

//
export interface SectionGridFeaturePlacesProps {
  stayListings?: StayDataType[];
  gridClass?: string;
  heading?: ReactNode;
  subHeading?: ReactNode;
  headingIsCenter?: boolean;
  tabs?: string[];
}

import { EVENTS, ENUM_MAP } from "../types/hardcoded";

const SectionGridFeaturePlaces: FC<SectionGridFeaturePlacesProps> = ({
  stayListings = DEMO_DATA,
  gridClass = "",
  heading = "Catch the Hottest Events in Town",
  subHeading = "Popular events that Votik recommends for you",
  headingIsCenter,
  tabs = EVENTS,
}) => {
  const { data, error, isLoading } = useSWR("getAllEvents", async () => {
    const { data, error } = await getAllEvents();
    if (error) throw error.message;
    return data;
  });

  const [currentTab, setCurrentTab] = useState<
    Database["public"]["Enums"]["EventCategory"] | "ALL"
  >("ALL");

  return (
    <div className="nc-SectionGridFeaturePlaces relative">
      <HeaderFilter
        tabActive={currentTab}
        subHeading={subHeading}
        tabs={tabs}
        prettyPrintTabsMap={ENUM_MAP}
        heading={heading}
        onClickTab={(tab) => {
          setCurrentTab(tab as keyof typeof ENUM_MAP);
        }}
      />
      <div
        className={`grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${gridClass}`}
      >
        {isLoading &&
          Array.from({ length: 4 }).map((_, id) => (
            <CardCategoryCustomSkeleton key={id} />
          ))}
        {data &&
          data
            .filter(
              (event) => currentTab === "ALL" || event.category === currentTab
            )
            .map((event) => (
              <CardCategoryCustom key={event.id} taxonomy={event} />
            ))}
      </div>
      {data &&
        data.filter(
          (event) => currentTab === "ALL" || event.category === currentTab
        ).length == 0 && (
          <div className="py-8 space-y-2">
            <p className="text-center text-xl font-semibold text-neutral-500 dark:text-neutral-400">
              Sorry, there are no available events in this category.
            </p>
            <p className="text-center text-lg text-neutral-500 dark:text-neutral-400">
              Try selecting a different category.
            </p>
          </div>
        )}
      {/* <div className="flex mt-16 justify-center items-center">
        <ButtonPrimary loading>Show me more</ButtonPrimary>
      </div> */}
    </div>
  );
};

export default SectionGridFeaturePlaces;
