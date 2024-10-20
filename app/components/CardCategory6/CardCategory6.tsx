import React, { FC } from "react";
import NcImage from "@app/shared/NcImage/NcImage";
import { TaxonomyType } from "@app/data/types";
import Link from "next/link";
import convertNumbThousand from "@app/utils/convertNumbThousand";

export interface CardCategory6Props {
  className?: string;
  taxonomy: TaxonomyType;
}

const CardCategory6: FC<CardCategory6Props> = ({
  className = "flex-1",
  taxonomy,
}) => {
  const { count, name, href = "/", thumbnail } = taxonomy;
  return (
    <Link
      href={href}
      className={`nc-CardCategory6 relative flex w-full group rounded-2xl z-0 overflow-hidden ${className}`}
      data-nc-id="CardCategory6"
    >
      <div className="aspect-w-16 aspect-h-10 sm:aspect-h-12 xl:aspect-h-9 w-full h-0"></div>
      <NcImage
        src={thumbnail}
        className="object-cover absolute inset-0 w-full h-full rounded-2xl group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 text-white">
        <span className="absolute inset-0 bg-gradient-to-t from-black/60"></span>
        <h2 className={`relative text-lg lg:text-xl font-semibold`}>{name}</h2>
        <span className={`relative block mt-1.5 text-sm text-neutral-100`}>
          {convertNumbThousand(count)} events
        </span>
      </div>
    </Link>
  );
};

export default CardCategory6;
