import React, { FC } from "react";
import ButtonPrimary from "@app/shared/Button/ButtonPrimary";
import SectionSliderNewCategories from "@app/components/SectionSliderNewCategoriesCustom/SectionSliderNewCategoriesCustom";
import { Tables } from "@app/types/database.types";
import SectionSliderNewCategoriesCustomPrefetched from "../SectionSliderNewCategoriesCustomPrefetched/SectionSliderNewCategoriesCustomPrefetched";

export interface SectionHero3Props {
  className?: string;
  data: Tables<"event_categories">;
  eventData: (Tables<"events"> & {
    tickets: { price: number }[];
  })[];
}

const SectionHeroCategory: FC<SectionHero3Props> = ({
  className = "",
  data,
  eventData,
}) => {
  return (
    <div
      className={`nc-SectionHero3 relative ${className}`}
      data-nc-id="SectionHero3"
    >
      <div className="container absolute z-10 inset-x-0 top-[5%] space-y-4 lg:space-y-5 xl:space-y-8">
        <h2 className="font-bold text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl !leading-[115%] ">
          {data.title}
        </h2>
        <span className="text-white sm:text-lg md:text-xl font-medium block max-w-[16rem] lg:max-w-xl">
          {data.description}
        </span>
      </div>
      <div className="relative aspect-w-1 aspect-h-1 sm:aspect-w-4 sm:aspect-h-3 lg:aspect-w-16 lg:aspect-h-9 xl:aspect-h-8 ">
        <img
          className="absolute inset-0 object-cover"
          src={data.banner_image}
          alt="hero"
        />
      </div>
      <div className="bg-gradient-to-t from-black to-black 2xl:to-transparent via-black text-white 2xl:-translate-y-1/2 2xl:-mb-[22rem] pb-1">
        <div className="container relative space-y-24 mb-24 lg:space-y-28 lg:mb-28">
          <SectionSliderNewCategoriesCustomPrefetched
            heading="Mumbai’s Must-See Events!"
            subHeading=""
            categoryCardType="card5"
            itemPerRow={4}
            uniqueClassName="PageHome_s3"
            disableDark={true}
            eventData={eventData}
          />
        </div>
      </div>
    </div>
  );
};

export default SectionHeroCategory;
