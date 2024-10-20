import React, { FC } from "react";
import ButtonPrimary from "@app/shared/Button/ButtonPrimary";
import imagePng from "@app/images/stadium.png";
import Input from "@app/shared/Input/Input";
import SectionSliderNewCategories from "@app/components/SectionSliderNewCategoriesCustom/SectionSliderNewCategoriesCustom";

export interface SectionHero3Props {
  className?: string;
}

const SectionHero3: FC<SectionHero3Props> = ({ className = "" }) => {
  return (
    <div
      className={`nc-SectionHero3 relative ${className}`}
      data-nc-id="SectionHero3"
    >
      <div className="absolute z-10 inset-x-0 top-[10%] m:top-[15%] text-center flex flex-col items-center max-w-6xl mx-auto space-y-4 lg:space-y-5 xl:space-y-8">
        <h2 className="font-bold text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl !leading-[115%] ">
          Your Gateway to Unforgettable Live Experiences
        </h2>
        <span className="text-white sm:text-lg md:text-xl font-medium">
          Discover Events. Connect with People. Create Memories.
        </span>
        {/* <Input
          type="text"
          placeholder="What do you want to see live?"
          className="w-[16rem] md:w-[24rem]"
        /> */}
        <ButtonPrimary>Start your search</ButtonPrimary>
      </div>
      <div className="relative aspect-w-1 aspect-h-1 sm:aspect-w-4 sm:aspect-h-3 lg:aspect-w-16 lg:aspect-h-9 xl:aspect-h-8 ">
        <img
          className="absolute inset-0 object-cover"
          src={imagePng.src}
          alt="hero"
        />
      </div>
      <div className="bg-gradient-to-t from-black to-black 2xl:to-transparent via-black text-white 2xl:-translate-y-1/2 2xl:-mb-[22rem] pb-1">
        <div className="container relative space-y-24 mb-24 lg:space-y-28 lg:mb-28">
          <SectionSliderNewCategories
            heading="Mumbai’s Teanding Events!"
            subHeading=""
            categoryCardType="card5"
            itemPerRow={4}
            uniqueClassName="PageHome_s3"
            disableDark={true}
          />
        </div>
      </div>
    </div>
  );
};

export default SectionHero3;
