import React, { FC } from "react";
import NcImage from "@/app/shared/NcImage/NcImage";
import { TaxonomyType } from "@/app/data/types";
import Link from "next/link";
import convertNumbThousand from "@/app/utils/convertNumbThousand";
import { Tables } from "@/app/types/database.types";
import formatDate from "@/app/utils/formatDate";

export interface CardCategoryCustomProps {
  className?: string;
  taxonomy: Tables<"events">;
}

const CardCategoryCustom: FC<CardCategoryCustomProps> = ({
  className = "",
  taxonomy,
}) => {
  const { id, name, city, location, start_time, primary_img } = taxonomy;
  const href = `/events/${id}`;

  return (
    <div className="rounded-2xl overflow-hidden">
      <Link
        href={href}
        className={`nc-CardCategory3 flex flex-col ${className}`}
        data-nc-id="CardCategory3"
      >
        <div className={`flex-shrink-0 relative group`}>
          <NcImage
            src={primary_img}
            // 💡 image is expected to be a square
            // 💡 otherwise it is cropped from top to
            // 💡 ensure imp info stays
            className="object-cover w-full aspect-[1/1] origin-top object-top"
          />
          <span className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black bg-opacity-10 transition-opacity"></span>
        </div>
      </Link>

      <div className="truncate bg-white p-4">
        <h2
          className={`text-base sm:text-lg text-neutral-900 font-semibold truncate line-clamp-2 text-wrap`}
        >
          {name}
        </h2>
        <span className={`block mt-2 text-sm text-neutral-6000`}>
          {formatDate(start_time)}
        </span>
        <span className={`block text-sm text-neutral-6000 truncate`}>
          {location}
        </span>
        <div className="mt-4 flex items-center justify-between">
          <h2
            className={`text-sm sm:text-sm text-neutral-900 font-semibold truncate line-clamp-2 text-wrap`}
          >
            Rs. 999 Onwards
          </h2>
          <Link href={href}>
            <button className="ml-auto bg-[#430D7F] text-[#C3FD07] font-semibold px-4 py-2 rounded-lg">
              BOOK NOW
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardCategoryCustom;
