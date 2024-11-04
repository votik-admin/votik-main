import React, { FC, useEffect, useState } from "react";
import StaySearchForm, { StaySearchFormFields } from "./StaySearchForm";

export type SearchTab = "Search";

export interface HeroSearchFormProps {
  className?: string;
  defaultTab?: SearchTab;
  onTabChange?: (tab: SearchTab) => void;
  defaultFieldFocus?: StaySearchFormFields;
  setShowHeroSearch: React.Dispatch<
    React.SetStateAction<StaySearchFormFields | null | undefined>
  >;
}
const TABS: SearchTab[] = ["Search"];

const HeroSearchForm: FC<HeroSearchFormProps> = ({
  className = "",
  defaultTab = "Search",
  onTabChange,
  defaultFieldFocus,
  setShowHeroSearch,
}) => {
  const [tabActive, setTabActive] = useState<SearchTab>(defaultTab);

  useEffect(() => {
    if (defaultTab === tabActive) {
      return;
    }
    setTabActive(defaultTab);
  }, [defaultTab]);

  const renderTab = () => {
    return (
      <ul className="h-[88px] flex justify-center space-x-5 sm:space-x-9">
        {TABS.map((tab) => {
          const active = tab === tabActive;
          return (
            <li
              onClick={() => {
                setTabActive(tab);
                onTabChange && onTabChange(tab);
              }}
              className={`relative flex-shrink-0 flex items-center cursor-pointer text-base text-neutral-700 dark:text-neutral-300 ${
                active ? "text-neutral-900 dark:text-neutral-200" : ""
              } `}
              key={tab}
            >
              <div className="relative select-none">
                <span>{tab}</span>
                {active && (
                  <span className="absolute top-full mt-1 block w-full h-0.5 rounded-full bg-neutral-800 dark:bg-neutral-100 mr-2" />
                )}
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  const renderForm = () => {
    switch (tabActive) {
      case "Search":
        return (
          <StaySearchForm
            defaultFieldFocus={defaultFieldFocus}
            setShowHeroSearch={setShowHeroSearch}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`nc-HeroSearchForm ${className}`}
      data-nc-id="HeroSearchForm"
    >
      {renderTab()}
      <div className="mt-2">{renderForm()}</div>
    </div>
  );
};

export default HeroSearchForm;
