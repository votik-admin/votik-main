"use client";

import React, { FC, useEffect, useMemo } from "react";
import Heading from "@app/components/Heading/Heading";
import Glide from "@glidejs/glide";
import { TaxonomyType } from "@app/data/types";
import CardCategoryCustom from "@app/components/CardCategoryCustom/CardCategoryCustom";
import NextPrev from "@app/shared/NextPrev/NextPrev";
import useNcId from "@app/hooks/useNcId";
import { Tables } from "@app/types/database.types";

export interface SectionSliderNewCategoriesProps {
  className?: string;
  itemClassName?: string;
  heading?: string;
  subHeading?: string;
  categories?: TaxonomyType[];
  categoryCardType?: "card3" | "card4" | "card5";
  itemPerRow?: 4 | 5;
  sliderStyle?: "style1" | "style2";
  uniqueClassName: string;
  disableDark?: boolean;
  eventData: (Tables<"events"> & {
    tickets: { price: number }[];
  })[];
}

const SectionSliderNewCategoriesCustomPrefetched: FC<
  SectionSliderNewCategoriesProps
> = ({
  heading = "Heading of sections",
  subHeading = "Descriptions for sections",
  className = "",
  itemClassName = "",
  itemPerRow = 5,
  sliderStyle = "style1",
  uniqueClassName,
  disableDark,
  eventData,
}) => {
  const UNIQUE_CLASS =
    "SectionSliderNewCategories__" + uniqueClassName + useNcId();

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
    MY_GLIDEJS.mount();
  }, [MY_GLIDEJS, UNIQUE_CLASS]);

  return (
    <div className={`nc-SectionSliderNewCategories ${className}`}>
      <div className={`${UNIQUE_CLASS} flow-root`}>
        <Heading
          desc={subHeading}
          hasNextPrev={sliderStyle === "style1"}
          isCenter={sliderStyle === "style2"}
          disableDark={disableDark}
        >
          {heading}
        </Heading>
        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides relative">
            {eventData &&
              eventData.map((item, index) => (
                <li key={item.id} className={`glide__slide ${itemClassName}`}>
                  <CardCategoryCustom taxonomy={item} />
                </li>
              ))}
          </ul>
          {(!eventData || eventData.length === 0) && (
            <div className="py-[10rem] flex items-center justify-center text-xl">
              More events coming soon!
            </div>
          )}
        </div>

        {sliderStyle === "style2" && (
          <NextPrev
            className="justify-center mt-16"
            disableDark={disableDark}
          />
        )}
      </div>
    </div>
  );
};

export default SectionSliderNewCategoriesCustomPrefetched;
