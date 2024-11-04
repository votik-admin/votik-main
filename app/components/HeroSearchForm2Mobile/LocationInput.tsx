import {
  MapPinIcon,
  MagnifyingGlassIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import React, { useState, useEffect, useRef, FC } from "react";
import { SearchResult } from "../HeroSearchForm2/LocationInput";
import { search } from "@app/queries";
import Link from "next/link";

interface Props {
  onClick?: () => void;
  onChange?: (value: string) => void;
  className?: string;
  defaultValue?: string;
  headingText?: string;
  closeModal: () => void;
}

const LocationInput: FC<Props> = ({
  onChange = () => {},
  className = "",
  defaultValue = "United States",
  headingText = "What do you want to see live?",
  closeModal,
}) => {
  const [results, setResults] = useState<SearchResult[] | null>([]);

  const [value, setValue] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

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
    closeModal();
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

  const renderSearchValues = ({
    heading,
    items,
  }: {
    heading: string;
    items: SearchResult[] | null;
  }) => {
    return (
      <>
        <p className="block font-semibold text-base">
          {heading || "Destinations"}
        </p>
        <div className="mt-3">
          {items && items.length ? (
            items.map((item, key) => {
              return (
                <Link href={`/events/${item.slug}`} key={key}>
                  <div
                    className="py-2 mb-1 flex items-center space-x-3 text-sm"
                    onClick={() => handleSelectLocation(item)}
                  >
                    {heading === "Recent Searches" && (
                      <ClockIcon className="w-5 h-5 text-neutral-500 dark:text-neutral-400 shrink-0" />
                    )}
                    {heading === "Search results" && (
                      <MapPinIcon className="w-5 h-5 text-neutral-500 dark:text-neutral-400 shrink-0" />
                    )}
                    <span className="">{item.name}</span>
                  </div>
                </Link>
              );
            })
          ) : (
            <span>No results found</span>
          )}
        </div>
      </>
    );
  };

  return (
    <div className={`${className}`} ref={containerRef}>
      <div className="p-5">
        <span className="block font-semibold text-xl sm:text-2xl">
          {headingText}
        </span>
        <div className="relative mt-5">
          <input
            className={`block w-full bg-transparent border px-4 py-3 pr-12 border-neutral-900 dark:border-neutral-200 rounded-xl focus:ring-0 focus:outline-none text-base leading-none placeholder-neutral-500 dark:placeholder-neutral-300 truncate font-bold placeholder:truncate`}
            placeholder={"Search events, venues, artists"}
            value={value}
            onChange={(e) => handleChange(e)}
            ref={inputRef}
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2">
            <MagnifyingGlassIcon className="w-5 h-5 text-neutral-700 dark:text-neutral-400" />
          </span>
        </div>
        <div className="mt-7">
          {value
            ? renderSearchValues({
                heading: "Search results",
                items: results,
              })
            : renderSearchValues({
                heading: "Recent Searches",
                items: JSON.parse(
                  localStorage.getItem("votik_recent_searches") || "[]"
                ),
              })}
        </div>
      </div>
    </div>
  );
};

export default LocationInput;
