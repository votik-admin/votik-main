import React from "react";
import Badge from "@app/shared/Badge/Badge";
import LikeSaveBtns from "../LikeSaveBtns";
import BackgroundSection from "@app/components/BackgroundSection/BackgroundSection";
import SectionSliderNewCategories from "@app/components/SectionSliderNewCategoriesCustom/SectionSliderNewCategoriesCustom";
import MobileFooterSticky from "../MobileFooterSticky";
import { getEventFromSlug } from "@app/queries";
import { notFound } from "next/navigation";
import formatDate from "@app/utils/formatDate";
import { MAP_TO_EVENT } from "@app/types/hardcoded";
import NcImage from "@app/shared/NcImage/NcImage";
import ReadMoreParagraph from "@app/shared/ReadMoreParagraph/ReadMoreParagraph";
import SectionChoseTicket from "./SectionChoseTicket";

const ListingStayDetailPage = async ({
  params: { slug },
}: {
  params: {
    slug: string;
  };
}) => {
  const { data: events, error } = await getEventFromSlug(slug);
  if (error || events.length === 0) {
    if (error) {
      console.log("💣💣💣", error);
    }
    return notFound();
  }
  const event = events[0];

  const renderSection1 = () => {
    return (
      <div className="listingSection__wrap !space-y-6">
        {/* 1 */}
        <div className="flex justify-between items-center">
          <Badge
            name={MAP_TO_EVENT[event.category as keyof typeof MAP_TO_EVENT]}
          />
          <LikeSaveBtns />
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
    return <SectionChoseTicket tickets={event.tickets} event_id={event.id} />;
  };

  const renderSidebar = () => {
    return renderSection2();
  };

  return (
    <div
      className={`ListingDetailPage nc-ListingStayDetailPage`}
      data-nc-id="ListingStayDetailPage"
    >
      <main className="container relative z-10 mt-11 flex flex-col lg:flex-row ">
        {/* CONTENT */}
        <div className="w-full lg:w-3/5 xl:w-1/2 space-y-8 lg:space-y-10 lg:pr-10">
          <NcImage
            src={event.primary_img}
            className="rounded-2xl aspect-[1/1] object-cover"
          />
          {renderSection1()}
        </div>

        {/* SIDEBAR */}
        <div className="hidden lg:block w-1/2 flex-grow mt-14 lg:mt-0">
          <div className="">{renderSidebar()}</div>
        </div>
      </main>

      {/* STICKY FOOTER MOBILE */}
      <MobileFooterSticky />

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
              itemPerRow={5}
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
