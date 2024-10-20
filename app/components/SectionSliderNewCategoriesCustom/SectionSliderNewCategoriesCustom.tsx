"use client";

import React, { FC, useEffect, useMemo } from "react";
import Heading from "@app/components/Heading/Heading";
import Glide from "@glidejs/glide";
import { TaxonomyType } from "@app/data/types";
import CardCategoryCustom from "@app/components/CardCategoryCustom/CardCategoryCustom";
import NextPrev from "@app/shared/NextPrev/NextPrev";
import useNcId from "@app/hooks/useNcId";
import useSWR from "swr";
import { getAllEvents } from "@app/queries";
import CardCategoryCustomSkeleton from "@app/components/CardCategoryCustom/CardCategoryCustomSkeleton";

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
}

const SectionSliderNewCategoriesCustom: FC<SectionSliderNewCategoriesProps> = ({
  heading = "Heading of sections",
  subHeading = "Descriptions for sections",
  className = "",
  itemClassName = "",
  itemPerRow = 5,
  sliderStyle = "style1",
  uniqueClassName,
  disableDark,
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

  const { data, error, isLoading } = useSWR("getAllEvents", async () => {
    const { data, error } = await getAllEvents();
    if (error) throw error.message;
    return data;
  });

  useEffect(() => {
    MY_GLIDEJS.mount();
  }, [MY_GLIDEJS, UNIQUE_CLASS, isLoading]);

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
            {isLoading &&
              Array.from({ length: 3 }).map((item, index) => (
                <li key={index} className={`glide__slide ${itemClassName}`}>
                  <CardCategoryCustomSkeleton />
                </li>
              ))}
            {data &&
              data.length &&
              data.map((item, index) => (
                <li key={item.id} className={`glide__slide ${itemClassName}`}>
                  <CardCategoryCustom taxonomy={item} />
                </li>
              ))}
          </ul>
          {data && !data.length && (
            <div className="py-[10rem] flex items-center justify-center text-xl">
              Trending events coming soon!
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

export default SectionSliderNewCategoriesCustom;
