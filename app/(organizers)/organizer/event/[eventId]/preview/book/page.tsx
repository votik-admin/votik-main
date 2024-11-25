import React from "react";
import Badge from "@app/shared/Badge/Badge";
import LikeSaveBtns from "../LikeSaveBtns";
import BackgroundSection from "@app/components/BackgroundSection/BackgroundSection";
import SectionSliderNewCategories from "@app/components/SectionSliderNewCategoriesCustom/SectionSliderNewCategoriesCustom";
import MobileFooterSticky from "../MobileFooterSticky";
import { getEventFromId, getEventFromSlug } from "@app/queries";
import { notFound, redirect } from "next/navigation";
import formatDate from "@app/utils/formatDate";
import { ENUM_MAP } from "@app/types/hardcoded";
import NcImage from "@app/shared/NcImage/NcImage";
import ReadMoreParagraph from "@app/shared/ReadMoreParagraph/ReadMoreParagraph";
import SectionChoseTicket from "./SectionChoseTicket";
import { getSessionAndUser } from "@app/lib/auth";
import { headers } from "next/headers";
import { createClient } from "@app/lib/supabase/server";
import Ribbon from "@app/components/Ribbon";

const ListingStayDetailPage = async ({
  params: { eventId },
}: {
  params: {
    eventId: string;
  };
}) => {
  const supabase = createClient();

  const { user, session, error: authError } = await getSessionAndUser();

  if (authError || !user) {
    const headersList = headers();
    const header_url = headersList.get("x-url") || "";
    const path = new URL(header_url).pathname;
    redirect(`/auth/login?redirect=${path}`);
  }

  const { data: event, error } = await supabase
    .from("events")
    .select("*, organizers(*), venues(*), tickets(*)")
    .eq("id", eventId)
    .single();

  if (error || !event) {
    if (error) {
      console.log("💣💣💣", error);
    }
    return notFound();
  }

  // sort tickets by price
  event.tickets.sort((a, b) => a.price - b.price);

  const renderSection1 = () => {
    const category = event.category as keyof typeof ENUM_MAP;
    const name = ENUM_MAP[category].name;
    const href = `/events/category/${ENUM_MAP[category].slug}`;
    const color = ENUM_MAP[category].color;

    return (
      <div className="listingSection__wrap !space-y-6">
        {/* 1 */}
        <div className="flex justify-between items-center">
          <Badge
            // TODO: proper slug instead of toLowerCase
            name={name}
            href={href}
            color={color}
          />
          <LikeSaveBtns event={event} />
        </div>

        {/* 2 */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
          {event.name}
        </h2>

        {/* 3 */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <span>
              <i className="las la-map-marker-alt"></i>
              <span className="ml-1">{event.location}</span>
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span>
              <i className="las la-calendar"></i>
              <span className="ml-1">{formatDate(event.start_time)}</span>
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">About Event</h2>
          <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
          <ReadMoreParagraph>{event.description}</ReadMoreParagraph>
        </div>
      </div>
    );
  };
  const renderSection2 = () => {
    return (
      <SectionChoseTicket
        tickets={event.tickets}
        user={user!}
        event_id={event.id}
      />
    );
  };

  const renderSidebar = () => {
    return renderSection2();
  };

  return (
    <div
      className={`ListingDetailPage nc-ListingStayDetailPage relative overflow-hidden`}
      data-nc-id="ListingStayDetailPage"
    >
      <Ribbon text="Preview" className="top-20 -right-3 z-50" />
      <main className="container relative z-10 mt-11 flex flex-col lg:flex-row ">
        {/* CONTENT */}
        <div className="w-full lg:w-3/5 xl:w-1/2 space-y-8 lg:space-y-10 lg:pr-10">
          <NcImage
            src={event.primary_img!}
            className="rounded-2xl aspect-[1/1] object-cover"
          />
          {renderSection1()}
        </div>

        {/* SIDEBAR */}
        <div className="lg:w-1/2 flex-grow mt-14 lg:mt-0">
          <div className="">{renderSidebar()}</div>
        </div>
      </main>

      {/* STICKY FOOTER MOBILE */}
      {/* <MobileFooterSticky /> */}

      {/* OTHER SECTION */}
      {
        <div className="container py-24 lg:py-32">
          {/* SECTION 1 */}
          <div className="relative py-16">
            <BackgroundSection />
            <SectionSliderNewCategories
              heading="Explore trending events"
              subHeading=""
              categoryCardType="card5"
              itemPerRow={4}
              sliderStyle="style2"
              uniqueClassName={"ListingStayDetailPage1"}
            />
          </div>
        </div>
      }
    </div>
  );
};

export default ListingStayDetailPage;

export const revalidate = 0;
