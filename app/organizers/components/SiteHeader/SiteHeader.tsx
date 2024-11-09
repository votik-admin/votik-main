"use client";

import React, { useEffect } from "react";
import Header3 from "./Header3";
import { PathName } from "@app/routers/types";
import { usePathname } from "next/navigation";
import { Tables } from "@app/types/database.types";
import { Session } from "@supabase/supabase-js";
import OrganizerProvider from "@app/contexts/OrganizerContext";
import { Toaster } from "react-hot-toast";

export type SiteHeaders = "Header 1" | "Header 2" | "Header 3";

const OPTIONS = {
  root: null,
  rootMargin: "0px",
  threshold: 1.0,
};
let OBSERVER: IntersectionObserver | null = null;
const PAGES_HIDE_HEADER_BORDER: PathName[] = [
  "/",
  "/events",
  "/listing-car-detail",
  "/listing-experiences-detail",
];

const SiteHeader = ({
  organizer,
  session,
}: {
  organizer: Tables<"organizers"> | null;
  session: Session | null;
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
    return <Header3 className={headerClassName} />;
  };

  return (
    <OrganizerProvider initialSession={session} initialOrganizer={organizer}>
      <Toaster position="top-center" />
      {renderHeader()}
      <div ref={anchorRef} className="h-1 absolute invisible"></div>
    </OrganizerProvider>
  );
};

export default SiteHeader;
