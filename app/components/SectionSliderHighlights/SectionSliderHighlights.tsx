"use client";

import React, { FC, useEffect, useMemo } from "react";
import Heading from "@app/components/Heading/Heading";
import Glide from "@glidejs/glide";
import { TaxonomyType } from "@app/data/types";
import NextPrev from "@app/shared/NextPrev/NextPrev";
import useNcId from "@app/hooks/useNcId";
import NcImage from "@app/shared/NcImage/NcImage";

export interface SectionSliderHighlightsProps {
  data?: string[];
  className?: string;
  itemClassName?: string;
  heading?: string;
  subHeading?: string;
  categories?: TaxonomyType[];
  categoryCardType?: "card3" | "card4" | "card5";
  itemPerRow?: 2 | 3 | 4 | 5;
  sliderStyle?: "style1" | "style2";
  uniqueClassName: string;
}

const SectionSliderHighlights: FC<SectionSliderHighlightsProps> = ({
  data,
  heading = "Heading of sections",
  subHeading = "Descriptions for sections",
  className = "",
  itemClassName = "",
  itemPerRow = 5,
  sliderStyle = "style1",
  uniqueClassName,
}) => {
  const UNIQUE_CLASS =
    "SectionSliderHighlights__" + uniqueClassName + useNcId();

  const MY_GLIDEJS = useMemo(() => {
    return new Glide(`.${UNIQUE_CLASS}`, {
      perView: itemPerRow,
      gap: 32,
      bound: true,
      breakpoints: {
        1280: {
          perView: itemPerRow - 1,
        },
        1024: {
          gap: 20,
          perView: itemPerRow - 1,
        },
        768: {
          gap: 20,
          perView: itemPerRow - 2,
        },
        640: {
          gap: 20,
          perView: itemPerRow - 3,
        },
        500: {
          gap: 20,
          perView: 1.3,
        },
      },
    });
  }, [UNIQUE_CLASS]);
  useEffect(() => {
    setTimeout(() => {
      MY_GLIDEJS.mount();
    }, 100);
  }, [MY_GLIDEJS, UNIQUE_CLASS]);

  return (
    <div className={`nc-SectionSliderHighlights ${className}`}>
      <div className={`${UNIQUE_CLASS} flow-root space-y-8`}>
        <div
          className={`nc-Section-Heading relative flex flex-row items-end justify-between ${className}`}
        >
          <div>
            <h2 className={`text-2xl font-semibold`}>Highlights</h2>
          </div>
          <div className="mt-4 flex justify-end sm:ml-2 sm:mt-0 flex-shrink-0">
            <NextPrev onClickNext={() => {}} onClickPrev={() => {}} />
          </div>
        </div>
        {/* == */}
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        {/* Content */}
        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides">
            {data &&
              data.map((img, index) => (
                <li key={index} className={`glide__slide ${itemClassName}`}>
                  <NcImage
                    key={index}
                    src={img || ""}
                    className="object-cover rounded-2xl h-[16rem]"
                  />
                </li>
              ))}
          </ul>
        </div>

        {sliderStyle === "style2" && (
          <NextPrev className="justify-center mt-16" />
        )}
      </div>
    </div>
  );
};

export default SectionSliderHighlights;
