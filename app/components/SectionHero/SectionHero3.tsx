"use client";

import React, { FC } from "react";
import ButtonPrimary from "@app/shared/Button/ButtonPrimary";
import imagePng from "@app/images/stadium.png";
import SectionSliderNewCategories from "@app/components/SectionSliderNewCategoriesCustom/SectionSliderNewCategoriesCustom";
import Input from "@app/shared/Input/Input";

export interface SectionHero3Props {
  className?: string;
}

const SectionHero3: FC<SectionHero3Props> = ({ className = "" }) => {
  const handleClick = (id: string) => {
    const searchDiv = document.querySelector(id) as HTMLDivElement;
    console.log(searchDiv);
    if (searchDiv) {
      searchDiv.click();
    }
  };
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
        <button
          className="hidden lg:flex bg-white space-x-4 items-center px-4 pr-8 md:pr-72 py-4 rounded-lg"
          onClick={() => handleClick("#open_search_modal_desktop")}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M17.2978 15.9997L20.6978 19.2997C20.8422 19.4923 20.9123 19.7305 20.8952 19.9706C20.8782 20.2107 20.7751 20.4366 20.6049 20.6068C20.4347 20.777 20.2088 20.8801 19.9686 20.8972C19.7285 20.9143 19.4903 20.8441 19.2978 20.6997L15.8978 17.2997C14.2911 18.5501 12.2682 19.1409 10.2411 18.9517C8.21401 18.7626 6.33531 17.8077 4.98773 16.2816C3.64015 14.7556 2.92509 12.7732 2.98823 10.7382C3.05136 8.70335 3.88794 6.76906 5.32752 5.32948C6.76711 3.88989 8.70139 3.05331 10.7363 2.99018C12.7712 2.92705 14.7536 3.64211 16.2797 4.98968C17.8057 6.33726 18.7606 8.21596 18.9498 10.243C19.1389 12.2701 18.5481 14.293 17.2978 15.8997V15.9997ZM10.9978 16.9997C11.7857 16.9997 12.5659 16.8445 13.2939 16.543C14.0218 16.2415 14.6832 15.7995 15.2404 15.2423C15.7975 14.6852 16.2395 14.0238 16.541 13.2958C16.8426 12.5679 16.9978 11.7876 16.9978 10.9997C16.9978 10.2118 16.8426 9.43156 16.541 8.70361C16.2395 7.97565 15.7975 7.31422 15.2404 6.75707C14.6832 6.19992 14.0218 5.75796 13.2939 5.45643C12.5659 5.1549 11.7857 4.99971 10.9978 4.99971C9.40646 4.99971 7.88033 5.63185 6.75511 6.75707C5.6299 7.88229 4.99776 9.40841 4.99776 10.9997C4.99776 12.591 5.6299 14.1171 6.75511 15.2423C7.88033 16.3676 9.40646 16.9997 10.9978 16.9997Z"
              fill="black"
            />
          </svg>
          <span className="text-[#181818] font-semibold">
            What do you want to see live?
          </span>
        </button>
        <button
          className="flex lg:hidden bg-white space-x-4 items-center px-4 pr-8 md:pr-72 py-4 rounded-lg"
          onClick={() => handleClick("#open_search_modal_mobile")}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M17.2978 15.9997L20.6978 19.2997C20.8422 19.4923 20.9123 19.7305 20.8952 19.9706C20.8782 20.2107 20.7751 20.4366 20.6049 20.6068C20.4347 20.777 20.2088 20.8801 19.9686 20.8972C19.7285 20.9143 19.4903 20.8441 19.2978 20.6997L15.8978 17.2997C14.2911 18.5501 12.2682 19.1409 10.2411 18.9517C8.21401 18.7626 6.33531 17.8077 4.98773 16.2816C3.64015 14.7556 2.92509 12.7732 2.98823 10.7382C3.05136 8.70335 3.88794 6.76906 5.32752 5.32948C6.76711 3.88989 8.70139 3.05331 10.7363 2.99018C12.7712 2.92705 14.7536 3.64211 16.2797 4.98968C17.8057 6.33726 18.7606 8.21596 18.9498 10.243C19.1389 12.2701 18.5481 14.293 17.2978 15.8997V15.9997ZM10.9978 16.9997C11.7857 16.9997 12.5659 16.8445 13.2939 16.543C14.0218 16.2415 14.6832 15.7995 15.2404 15.2423C15.7975 14.6852 16.2395 14.0238 16.541 13.2958C16.8426 12.5679 16.9978 11.7876 16.9978 10.9997C16.9978 10.2118 16.8426 9.43156 16.541 8.70361C16.2395 7.97565 15.7975 7.31422 15.2404 6.75707C14.6832 6.19992 14.0218 5.75796 13.2939 5.45643C12.5659 5.1549 11.7857 4.99971 10.9978 4.99971C9.40646 4.99971 7.88033 5.63185 6.75511 6.75707C5.6299 7.88229 4.99776 9.40841 4.99776 10.9997C4.99776 12.591 5.6299 14.1171 6.75511 15.2423C7.88033 16.3676 9.40646 16.9997 10.9978 16.9997Z"
              fill="black"
            />
          </svg>
          <span className="text-[#181818] font-semibold">
            What do you want to see live?
          </span>
        </button>
      </div>
      <div className="relative aspect-w-1 aspect-h-1 sm:aspect-w-4 sm:aspect-h-3 lg:aspect-w-16 lg:aspect-h-9 xl:aspect-h-8 ">
        <img
          className="absolute inset-0 object-cover"
          src={imagePng.src}
          alt="hero"
        />
      </div>
      <div className="bg-gradient-to-t from-black to-black 2xl:to-transparent via-black text-white pt-10 2xl:-translate-y-1/2 2xl:-mb-[22rem] pb-1">
        <div className="container relative space-y-24 mb-24">
          <SectionSliderNewCategories
            heading="Explore Trending Events!"
            subHeading=""
            categoryCardType="card5"
            itemPerRow={4}
            uniqueClassName="PageHome_s3"
            disableDark={true}
            sliderStyle="style1"
          />
        </div>
      </div>
    </div>
  );
};

export default SectionHero3;
