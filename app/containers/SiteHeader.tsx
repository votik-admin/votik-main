"use client";

import React, { useEffect } from "react";
import Header3 from "@app/components/Header/Header3";
import { PathName } from "@app/routers/types";
import { usePathname } from "next/navigation";
import { Database } from "@app/types/database.types";

export type SiteHeaders = "Header 1" | "Header 2" | "Header 3";

const OPTIONS = {
  root: null,
  rootMargin: "0px",
  threshold: 1.0,
};
let OBSERVER: IntersectionObserver | null = null;
const PAGES_HIDE_HEADER_BORDER: PathName[] = [
  "/", // 💡 "/" is the new and default "/home-3",
  "/events", // "/listing-stay-detail",
  "/listing-car-detail",
  "/listing-experiences-detail",
];

const SiteHeader = ({
  user,
}: {
  user: Database["public"]["Tables"]["users"]["Row"] | null;
}) => {
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const [isTopOfPage, setIsTopOfPage] = React.useState(true);
  const location = usePathname();

  const intersectionCallback = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      setIsTopOfPage(entry.isIntersecting);
    });
  };

  let flag = false;
  for (const option of PAGES_HIDE_HEADER_BORDER) {
    flag ||= location.includes(option);
  }
  useEffect(() => {
    // disconnect the observer
    if (!flag) {
      OBSERVER && OBSERVER.disconnect();
      OBSERVER = null;
      return;
    }
    if (!OBSERVER) {
      OBSERVER = new IntersectionObserver(intersectionCallback, OPTIONS);
      anchorRef.current && OBSERVER.observe(anchorRef.current);
    }
  }, [location]);

  const renderHeader = () => {
    let headerClassName = "shadow-sm dark:border-b dark:border-neutral-700";

    if (flag) {
      headerClassName = isTopOfPage
        ? ""
        : "shadow-sm dark:border-b dark:border-neutral-700";
    }
    return <Header3 className={headerClassName} user={user} />;
  };

  return (
    <>
      {renderHeader()}
      <div ref={anchorRef} className="h-1 absolute invisible"></div>
    </>
  );
};

export default SiteHeader;
