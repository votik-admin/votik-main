"use client";

import React, { FC, useEffect, useState } from "react";
import Heading from "@app/shared/Heading/Heading";
import Nav from "@app/shared/Nav/Nav";
import NavItem from "@app/shared/NavItem/NavItem";
import ButtonSecondary from "@app/shared/Button/ButtonSecondary";
import { ReactNode } from "react";

export interface HeaderFilterProps {
  tabActive: string;
  tabs: string[];
  prettyPrintTabsMap?: Record<string, Record<string, string>>;
  heading: ReactNode;
  subHeading?: ReactNode;
  onClickTab: (item: string) => void;
}

const HeaderFilter: FC<HeaderFilterProps> = ({
  tabActive,
  tabs,
  prettyPrintTabsMap,
  subHeading = "",
  heading = "🎈 Latest Articles",
  onClickTab,
}) => {
  const [tabActiveState, setTabActiveState] = useState(tabActive);

  useEffect(() => {
    setTabActiveState(tabActive);
  }, [tabActive]);

  const handleClickTab = (item: string) => {
    onClickTab && onClickTab(item);
    setTabActiveState(item);
  };

  return (
    <div className="flex flex-col mb-8 relative">
      <Heading desc={subHeading}>{heading}</Heading>
      <div className="flex items-center justify-between">
        <Nav
          className="sm:space-x-2"
          containerClassName="relative flex w-full overflow-x-auto text-sm md:text-base hiddenScrollbar"
        >
          {tabs.map((item, index) => (
            <NavItem
              key={index}
              isActive={tabActiveState === item}
              onClick={() => handleClickTab(item)}
            >
              {prettyPrintTabsMap ? prettyPrintTabsMap[item].name : item}
            </NavItem>
          ))}
        </Nav>
        <span className="hidden sm:block flex-shrink-0">
          <ButtonSecondary className="!leading-none">
            <span>View all</span>
            <i className="ml-3 las la-arrow-right text-xl"></i>
          </ButtonSecondary>
        </span>
      </div>
    </div>
  );
};

export default HeaderFilter;
