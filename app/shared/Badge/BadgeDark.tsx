import { TwMainColor } from "@app/data/types";
import React, { FC, ReactNode } from "react";
import Link from "next/link";

export interface BadgeProps {
  className?: string;
  name: ReactNode;
  color?: TwMainColor;
  href?: string;
}

const BadgeDark: FC<BadgeProps> = ({
  className = "relative",
  name,
  color = "blue",
  href,
}) => {
  const getColorClass = (hasHover = true) => {
    switch (color) {
      case "pink":
        return `text-pink-800 bg-pink-100 ${
          hasHover ? "dark:text-white dark:bg-pink-800" : ""
        }`;
      case "red":
        return `text-red-800 bg-red-100 ${
          hasHover ? "dark:text-white dark:bg-red-800" : ""
        }`;
      case "gray":
        return `text-gray-800 bg-gray-100 ${
          hasHover ? "dark:text-white dark:bg-gray-800" : ""
        }`;
      case "green":
        return `text-green-800 bg-green-100 ${
          hasHover ? "dark:text-white dark:bg-green-800" : ""
        }`;
      case "purple":
        return `text-purple-800 bg-purple-100 ${
          hasHover ? "dark:text-white dark:bg-purple-800" : ""
        }`;
      case "indigo":
        return `text-indigo-800 bg-indigo-100 ${
          hasHover ? "dark:text-white dark:bg-indigo-800" : ""
        }`;
      case "yellow":
        return `text-yellow-800 bg-yellow-100 ${
          hasHover ? "dark:text-white dark:bg-yellow-800" : ""
        }`;
      case "blue":
        return `text-blue-800 bg-blue-100 ${
          hasHover ? "dark:text-white dark:bg-blue-800" : ""
        }`;
      default:
        return `text-pink-800 bg-pink-100 ${
          hasHover ? "dark:text-white dark:bg-pink-800" : ""
        }`;
    }
  };

  const CLASSES =
    "nc-Badge inline-flex px-2.5 py-1 rounded-full font-medium text-xs " +
    className;
  return !!href ? (
    <Link
      href={href || ""}
      className={`transition-colors dark:text-white duration-300 ${CLASSES} ${getColorClass()}`}
    >
      {name}
    </Link>
  ) : (
    <span className={`${CLASSES} ${getColorClass()} ${className}`}>{name}</span>
  );
};

export default BadgeDark;
