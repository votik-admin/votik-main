import { avatarColors } from "@app/contains/contants";
import React, { FC, useMemo } from "react";
import avatar1 from "@app/images/avatars/Image-1.png";
import { minidenticon } from "minidenticons";

export interface AvatarProps {
  containerClassName?: string;
  sizeClass?: string;
  radius?: string;
  imgUrl?: string;
  userName?: string;
  hasChecked?: boolean;
  hasCheckedClass?: string;
  saturation?: number;
  lightness?: number;
}

const Avatar: FC<AvatarProps> = ({
  containerClassName = "ring-1 ring-white dark:ring-neutral-900",
  sizeClass = "h-6 w-6 text-sm",
  radius = "rounded-full",
  imgUrl = "",
  userName = "Kevin",
  hasChecked,
  hasCheckedClass = "w-4 h-4 -top-0.5 -right-0.5",
  saturation = 0.5,
  lightness = 0.5,
}) => {
  const svgURI = useMemo(
    () =>
      "data:image/svg+xml;utf8," +
      encodeURIComponent(minidenticon(userName, saturation, lightness)),
    [userName, saturation, lightness]
  );

  const url = imgUrl || "";
  const name = userName || "John Doe";
  const _setBgColor = (name: string) => {
    const backgroundIndex = Math.floor(
      name.charCodeAt(0) % avatarColors.length
    );
    return avatarColors[backgroundIndex];
  };

  return (
    <div
      className={`relative flex-shrink-0 inline-flex items-center justify-center text-neutral-100 uppercase font-semibold shadow-inner ${radius} ${sizeClass} ${containerClassName}`}
      style={{ backgroundColor: url ? undefined : _setBgColor(name) }}
    >
      {url ? (
        <img
          className={`absolute inset-0 w-full h-full object-cover ${radius}`}
          src={url}
          alt={name}
        />
      ) : (
        <img
          src={svgURI}
          className={`absolute inset-0 w-full h-full object-cover ${radius}`}
          alt={userName}
        />
      )}
    </div>
  );
};

export default Avatar;
