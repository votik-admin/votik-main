import React, { FC } from "react";
import NcImage from "@/app/shared/NcImage/NcImage";

export interface CardCategory5Props {
  className?: string;
}

const CardCategory5Skeleton: FC<CardCategory5Props> = ({ className = "" }) => {
  return (
    <div>
      <div
        className={`flex-shrink-0 relative w-full aspect-w-4 aspect-h-3 h-0 rounded-2xl overflow-hidden group`}
      >
        <NcImage src={""} className="object-cover w-full h-full rounded-2xl" />
        <span className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black bg-opacity-10 transition-opacity"></span>
      </div>
      <div className="mt-4 px-3 truncate">
        <div className="mt-2 w-full animate-pulse h-3 bg-neutral-400 rounded-full"></div>
        <div className="mt-4 space-y-2">
          <div className="w-full animate-pulse h-2 bg-neutral-400 rounded-full mt-2"></div>
          <div className="w-1/2 animate-pulse h-2 bg-neutral-400 rounded-full mt-2"></div>
        </div>
      </div>
    </div>
  );
};

export default CardCategory5Skeleton;
