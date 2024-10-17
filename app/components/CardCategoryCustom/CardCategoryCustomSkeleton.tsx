import React, { FC } from "react";
import NcImage from "@/app/shared/NcImage/NcImage";
import { TaxonomyType } from "@/app/data/types";
import Link from "next/link";
import convertNumbThousand from "@/app/utils/convertNumbThousand";
import { Tables } from "@/app/types/database.types";
import formatDate from "@/app/utils/formatDate";

const CardCategoryCustomSkeleton: FC = () => {
  return (
    <div className="rounded-2xl overflow-hidden">
      <div className={`flex-shrink-0 relative group`}>
        <NcImage
          src={""}
          className="animate-pulse object-cover w-full aspect-[1/1]"
        />
        <span className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black bg-opacity-10 transition-opacity"></span>
      </div>

      <div className="truncate bg-white p-4">
        <div className="w-full animate-pulse h-3 bg-neutral-400 rounded-full"></div>
        <div className="w-1/2 animate-pulse h-3 bg-neutral-400 rounded-full mt-2"></div>
        <span className={`block mt-2 text-sm text-neutral-6000`}>
          <div className="w-3/4 animate-pulse h-2 bg-neutral-400 rounded-full mt-4"></div>
        </span>
        <span className={`block text-sm text-neutral-6000 truncate`}>
          <div className="w-1/2 animate-pulse h-2 bg-neutral-400 rounded-full mt-2"></div>
        </span>
        <div className="mt-4 flex items-center justify-between">
          <h2
            className={`text-sm sm:text-sm text-neutral-900 font-semibold truncate line-clamp-2 text-wrap`}
          >
            <div className="w-20 animate-pulse h-2 bg-neutral-400 rounded-full"></div>
          </h2>
          <button className="ml-auto bg-[#430D7F] text-[#C3FD07] font-semibold px-6 py-4 rounded-lg">
            <div className="w-16 animate-pulse h-2 bg-[#C3FD07] rounded-full"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardCategoryCustomSkeleton;
