import React, { FC } from "react";
import { DEMO_EXPERIENCES_LISTINGS } from "@app/data/listings";
import { ExperiencesDataType, StayDataType } from "@app/data/types";
import Pagination from "@app/shared/Pagination/Pagination";
import TabFilters from "./TabFilters";
import Heading2 from "@app/components/Heading/Heading2";
import ExperiencesCard from "@app/components/ExperiencesCard/ExperiencesCard";

export interface SectionGridFilterCardProps {
  className?: string;
  data?: StayDataType[];
}

const DEMO_DATA: ExperiencesDataType[] = DEMO_EXPERIENCES_LISTINGS.filter(
  (_, i) => i < 8
);

const SectionGridFilterCard: FC<SectionGridFilterCardProps> = ({
  className = "",
  data = DEMO_DATA,
}) => {
  return (
    <div
      className={`nc-SectionGridFilterCard ${className}`}
      data-nc-id="SectionGridFilterCard"
    >
      <Heading2
        heading="Experiences in Tokyo"
        subHeading={
          <span className="block text-neutral-500 dark:text-neutral-400 mt-3">
            233 experiences
            <span className="mx-2">·</span>
            Aug 12 - 18
            <span className="mx-2">·</span>2 Guests
          </span>
        }
      />

      <div className="mb-8 lg:mb-11">
        <TabFilters />
      </div>
      <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {data.map((stay) => (
          <ExperiencesCard key={stay.id} data={stay} />
        ))}
      </div>
      <div className="flex mt-16 justify-center items-center">
        <Pagination />
      </div>
    </div>
  );
};

export default SectionGridFilterCard;
