import React, { FC } from "react";
import NcImage from "@app/shared/NcImage/NcImage";
import Badge from "@app/shared/Badge/Badge";
import { TwMainColor } from "@app/data/types";
import { Button } from "@app/components/ui/button";
import ButtonPrimary from "@app/shared/Button/ButtonPrimary";

export interface SectionOurFeaturesProps {
  className?: string;
  img?: string;
  data: {
    topText?: string;
    heading: string;
    features: {
      badge: {
        text: string;
        color?: TwMainColor;
      };
      title: string;
      descritption?: string;
    }[];
  };
  type?: "type1" | "type2";
  button?: {
    text: string;
    href: string;
  };
}

const SectionOurFeatures: FC<SectionOurFeaturesProps> = ({
  className = "lg:py-14",
  img,
  data,
  type = "type1",
  button,
}) => {
  return (
    <div
      className={`nc-SectionOurFeatures relative flex flex-col items-center ${
        type === "type1" ? "lg:flex-row" : "lg:flex-row-reverse"
      } ${className}`}
      data-nc-id="SectionOurFeatures"
    >
      <div className="flex-grow">
        <NcImage src={img} />
      </div>
      <div
        className={`max-w-2xl flex-shrink-0 mt-10 lg:mt-0 lg:w-2/5 ${
          type === "type1" ? "lg:pl-16" : "lg:pr-16"
        }`}
      >
        <span className="uppercase text-sm text-gray-400 tracking-widest">
          {data.topText}
        </span>
        <h2 className="font-semibold text-4xl mt-5">{data.heading} </h2>

        <ul className="space-y-10 mt-16">
          {data.features.map((feature, key) => (
            <li key={key} className="space-y-4">
              <Badge name={feature.badge.text} color={feature.badge.color} />
              <span className="block text-xl font-semibold">
                {feature.title}
              </span>
              <span className="block mt-5 text-neutral-500 dark:text-neutral-400">
                {feature.descritption}
              </span>
            </li>
          ))}
        </ul>
        {!!button && (
          <ButtonPrimary href={button.href} className="mt-8">
            {button.text}
          </ButtonPrimary>
        )}
      </div>
    </div>
  );
};

export default SectionOurFeatures;
