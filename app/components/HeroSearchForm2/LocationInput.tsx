import React, { useState } from "react";
import { FC } from "react";
import { useEffect } from "react";
import ClearDataButton from "./ClearDataButton";
import { useRef } from "react";
import useOutsideAlerter from "@app/hooks/useOutsideAlerter";
import { search } from "@app/queries";
import Link from "next/link";
import { StaySearchFormFields } from "./StaySearchForm";

export interface SearchResult {
  name: string | null;
  slug: string | null;
}

export interface LocationInputProps {
  defaultValue: string;
  onChange?: (value: string) => void;
  onInputDone?: (value: SearchResult) => void;
  placeHolder?: string;
  desc?: string;
  className?: string;
  autoFocus?: boolean;
  setShowHeroSearch: React.Dispatch<
    React.SetStateAction<StaySearchFormFields | null | undefined>
  >;
}

const LocationInput: FC<LocationInputProps> = ({
  defaultValue,
  autoFocus = false,
  onChange,
  onInputDone,
  placeHolder = "Search events, venues, artists and more",
  desc = "Anywhere • Any week • Any event",
  className = "nc-flex-1.5",
  setShowHeroSearch,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState(defaultValue);
  const [results, setResults] = useState<SearchResult[] | null>([]);
  const [showPopover, setShowPopover] = useState(autoFocus);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    setShowPopover(autoFocus);
    if (autoFocus && !!inputRef.current) {
      setTimeout(() => {
        inputRef.current && inputRef.current.focus();
      }, 200);
    }
  }, [autoFocus]);

  useOutsideAlerter(containerRef, () => {
    setShowPopover(false);
  });

  useEffect(() => {
    if (showPopover && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showPopover]);

  const handleSelectLocation = (item: {
    name: string | null;
    slug: string | null;
  }) => {
    const recentSearches = JSON.parse(
      localStorage.getItem("votik_recent_searches") || "[]"
    ) as SearchResult[];

    const uniqueSlugs = new Set();
    localStorage.setItem(
      "votik_recent_searches",
      JSON.stringify(
        [item, ...recentSearches].filter((item) => {
          if (uniqueSlugs.has(item.slug)) {
            return false;
          } else {
            uniqueSlugs.add(item.slug);
            return true;
          }
        })
      )
    );
    setShowHeroSearch(null);
    setShowPopover(false);
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.currentTarget.value;
    setValue(query);
    // debounced search
    setTimeout(async () => {
      if (query === inputRef.current?.value) {
        const { data, error } = await search("events", query);
        setResults(data);
      }
    }, 200);
  };

  const renderRecentSearches = () => {
    const recentSearches = JSON.parse(
      localStorage.getItem("votik_recent_searches") || "[]"
    );
    return (
      <>
        <h3 className="block mt-2 sm:mt-0 px-4 sm:px-8 font-semibold text-base text-neutral-800 dark:text-neutral-100">
          Recent searches
        </h3>
        <div className="mt-2">
          {recentSearches && recentSearches.length ? (
            recentSearches.map(
              (
                item: {
                  name: string | null;
                  slug: string | null;
                },
                key: number
              ) => (
                <Link
                  href={`/events/${item.slug}`}
                  key={key}
                  onClick={() => handleSelectLocation(item)}
                >
                  <span className="flex px-4 sm:px-6 items-center space-x-3 py-4 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer">
                    <span className="block text-neutral-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 sm:h-6 w-4 sm:w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </span>
                    <span className=" block text-neutral-700 dark:text-neutral-200">
                      {item.name}
                    </span>
                  </span>
                </Link>
              )
            )
          ) : (
            <span className="pl-8">Your recent searches will appear here</span>
          )}
        </div>
      </>
    );
  };

  const renderSearchValue = () => {
    return (
      <>
        {results && results.length ? (
          results.map((item, key) => (
            <Link key={key} href={`/events/${item.slug}`}>
              <span
                className="flex px-4 sm:px-6 items-center space-x-3 py-4 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
                onClick={() => handleSelectLocation(item)}
              >
                <span className="block text-neutral-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-6 sm:w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </span>
                <span className="block text-neutral-700 dark:text-neutral-200">
                  {item.name}
                </span>
              </span>
            </Link>
          ))
        ) : (
          <span className="pl-8">No results found</span>
        )}
      </>
    );
  };

  return (
    <div className={`relative flex ${className}`} ref={containerRef}>
      <div
        onClick={() => setShowPopover(true)}
        className={`flex flex-1 relative [ nc-hero-field-padding--small ] flex-shrink-0 items-center space-x-3 cursor-pointer focus:outline-none text-left ${
          showPopover ? "nc-hero-field-focused--2" : ""
        }`}
      >
        <div className="flex-1">
          <input
            className={`block w-full bg-transparent border-none focus:ring-0 p-0 focus:outline-none focus:placeholder-neutral-400 xl:text-base font-semibold placeholder-neutral-800 dark:placeholder-neutral-400 truncate`}
            placeholder={placeHolder}
            value={value}
            autoFocus={showPopover}
            onChange={(e) => handleChange(e)}
            ref={inputRef}
          />
          <span className="block mt-0.5 text-sm text-neutral-400 font-light ">
            <span className="line-clamp-1">{!!value ? placeHolder : desc}</span>
          </span>
          {value && showPopover && (
            <ClearDataButton onClick={() => setValue("")} />
          )}
        </div>
      </div>
      {showPopover && (
        <div className="absolute left-0 z-40 w-full min-w-[300px] sm:min-w-[400px] bg-white dark:bg-neutral-800 top-full mt-3 py-3 sm:py-5 rounded-3xl shadow-xl max-h-96 overflow-y-auto">
          {value ? renderSearchValue() : renderRecentSearches()}
        </div>
      )}
    </div>
  );
};

export default LocationInput;
