import React, { FC } from "react";
import NcImage from "@app/shared/NcImage/NcImage";
import Link from "next/link";
import { Tables } from "@app/types/database.types";

export interface CardCategory5Props {
  className?: string;
  taxonomy: Tables<"venues">;
}

const CardCategory5: FC<CardCategory5Props> = ({
  className = "",
  taxonomy,
}) => {
  const { name, slug, image, address } = taxonomy;
  const href = `/venue/${slug}`;
  return (
    <Link
      href={href}
      className={`nc-CardCategory5 flex flex-col ${className}`}
      data-nc-id="CardCategory5"
    >
      <>
        <div
          className={`flex-shrink-0 relative w-full aspect-w-4 aspect-h-3 h-0 rounded-2xl overflow-hidden group`}
        >
          <NcImage
            src={image || ""}
            className="object-cover w-full h-full rounded-2xl"
          />
          <span className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black bg-opacity-10 transition-opacity"></span>
        </div>
        <div className="mt-4 px-3 truncate">
          <h2
            className={`text-base sm:text-lg text-neutral-900 dark:text-neutral-100 font-medium truncate text-wrap line-clamp-1`}
          >
            {name}
          </h2>
          <p
            className={`mt-2 text-sm text-neutral-6000 dark:text-neutral-400 truncate text-wrap line-clamp-2`}
          >
            {address}
          </p>
        </div>
      </>
    </Link>
  );
};

export default CardCategory5;
