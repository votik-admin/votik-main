import React, { FC } from "react";
import Avatar from "@app/shared/Avatar/Avatar";
import Badge from "@app/shared/Badge/Badge";
import ButtonSecondary from "@app/shared/Button/ButtonSecondary";
import LikeSaveBtns from "./LikeSaveBtns";
import BackgroundSection from "@app/components/BackgroundSection/BackgroundSection";
import SectionSliderNewCategories from "@app/components/SectionSliderNewCategoriesCustom/SectionSliderNewCategoriesCustom";
import MobileFooterSticky from "./MobileFooterSticky";
import GoogleMap from "./GoogleMap";
import { getEventFromSlug } from "@app/queries";
import { notFound } from "next/navigation";
import formatDate from "@app/utils/formatDate";
import { ENUM_MAP } from "@app/types/hardcoded";
import ButtonCustom from "@app/shared/Button/ButtonCustom";
import NcImage from "@app/shared/NcImage/NcImage";
import SectionSliderHighlights from "@app/components/SectionSliderHighlights/SectionSliderHighlights";
import ReadMoreParagraph from "@app/shared/ReadMoreParagraph/ReadMoreParagraph";
import Link from "next/link";
import convertNumbThousand from "@app/utils/convertNumbThousand";

import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug;
  const { data: event, error } = await getEventFromSlug(slug);

  // optionally access and extend (rather than replace) parent metadata
  const parentMetadata = await parent;
  const previousImages = parentMetadata.openGraph?.images || [];

  if (event?.primary_img) {
    return {
      title: event?.name,
      openGraph: {
        images: [event?.primary_img, ...previousImages],
      },
    };
  }

  // default case
  return {
    title: parentMetadata.title,
    openGraph: {
      images: previousImages,
    },
  };
}

const ListingStayDetailPage = async ({
  params: { slug },
}: {
  params: {
    slug: string;
  };
}) => {
  const { data: event, error } = await getEventFromSlug(slug);
  if (error || !event) {
    if (error) {
      console.log("💣💣💣", error);
    }
    return notFound();
  }

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

        <div className="hidden lg:flex justify-between items-center border-t dark:border-neutral-700 sm:pt-4 xl:pt-8 sm:-mx-4 sm:px-4 xl:-mx-8 xl:px-8">
          <h2 className="text-2xl font-semibold">
            ₹{" "}
            {convertNumbThousand(
              event.tickets.sort((a, b) => a.price - b.price)[0]?.price
            )}{" "}
            Onwards
          </h2>
          <Link href={`/events/${event.slug}/book`}>
            <ButtonCustom>BOOK NOW</ButtonCustom>
          </Link>
        </div>
      </div>
    );
  };

  const renderSection4 = () => {
    return (
      <div className="listingSection__wrap">
        {/* HEADING */}
        <div>
          <h2 className="text-2xl font-semibold">Venue Layout</h2>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        {/* CONTENT */}
        <NcImage
          src={event.venue_layout || ""}
          className="object-cover rounded-2xl"
        />
      </div>
    );
  };

  const renderSectionHighlights = () => {
    return (
      <div className="listingSection__wrap">
        <SectionSliderHighlights
          heading="Highlights"
          subHeading=""
          data={event.secondary_imgs || [""]}
          uniqueClassName="Section_Slider_Highlights"
          itemPerRow={3}
        />
      </div>
    );
  };

  const renderSection5 = () => {
    return (
      <div className="listingSection__wrap">
        {/* HEADING */}
        <h2 className="text-2xl font-semibold">Host Information</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        {/* host */}
        <div className="flex items-center space-x-4">
          <Avatar
            hasChecked
            hasCheckedClass="w-4 h-4 -top-0.5 right-0.5"
            sizeClass="h-14 w-14"
            radius="rounded-full"
            userName="King"
          />
          <div>
            <a className="block text-xl font-medium" href="##">
              King
            </a>
            <div className="mt-1.5 flex items-center text-sm text-neutral-500 dark:text-neutral-400">
              <span> 12 events</span>
            </div>
          </div>
        </div>

        {/* desc */}
        <span className="block text-neutral-6000 dark:text-neutral-300">
          Providing lake views, The Symphony 9 Tam Coc in Ninh Binh provides
          accommodation, an outdoor swimming pool, a bar, a shared lounge, a
          garden and barbecue facilities...
        </span>

        {/* == */}
        {/* <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        <div>
          <ButtonSecondary href="##">See host profile</ButtonSecondary>
        </div> */}
      </div>
    );
  };

  const renderSection7 = () => {
    return (
      <div className="listingSection__wrap">
        {/* HEADING */}
        <div>
          <h2 className="text-2xl font-semibold">Location</h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            {event.venues?.name + ", " + event.venues?.address ||
              event.location}
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

        {/* MAP */}
        <GoogleMap
          lat={event.venues?.latitude || 0}
          lng={event.venues?.longitude || 0}
        />
      </div>
    );
  };

  const renderSection8 = () => {
    return (
      <div className="listingSection__wrap">
        {/* HEADING */}
        <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

        {/* CONTENT */}
        <div>
          <h4 className="text-lg font-semibold">
            Are there any age restrictions for the event?
          </h4>
          <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
            Yes, the event is [age-specific/18+ only/open to all ages]. Please
            check the event details on the ticketing page for specific age
            restrictions.
          </span>
        </div>
        <div>
          <h4 className="text-lg font-semibold">
            Are there any age restrictions for the event?
          </h4>
          <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
            Yes, the event is [age-specific/18+ only/open to all ages]. Please
            check the event details on the ticketing page for specific age
            restrictions.
          </span>
        </div>
      </div>
    );
  };
  const renderSection9 = () => {
    return (
      <div className="listingSection__wrap">
        {/* HEADING */}
        <h2 className="text-2xl font-semibold">Terms and Conditions</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

        {/* CONTENT */}
        <div>
          <h4 className="text-lg font-semibold"></h4>
          <div className="prose sm:prose">
            <ul className="mt-3 text-neutral-500 dark:text-neutral-400 space-y-2">
              <li>
                Ban and I will work together to keep the landscape and
                environment green and clean by not littering, not using
                stimulants and respecting people around.
              </li>
              <li>Do not sing karaoke past 11:30</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderSidebar = () => {
    return renderSection1();
  };

  return (
    <div
      className={`ListingDetailPage nc-ListingStayDetailPage`}
      data-nc-id="ListingStayDetailPage"
    >
      {/* MODAL PHOTOS */}
      {/* <>
        <ModalPhotos
          imgs={[
            event.primary_img,
            ...(event.secondary_imgs || ["", "", "", ""]),
          ]}
          uniqueClassName="nc-ListingStayDetailPage-modalPhotos"
        />
      </> */}
      {/* MAIn */}
      <main className="container relative z-10 mt-11 flex flex-col lg:flex-row ">
        {/* CONTENT */}
        <div className="w-full lg:w-3/5 xl:w-1/2 space-y-8 lg:space-y-10 lg:pr-10">
          <NcImage
            src={event.primary_img!}
            className="rounded-2xl aspect-[1/1] object-cover"
          />
          <div className="lg:hidden">{renderSection1()}</div>
          {renderSection4()}
          {event.secondary_imgs && renderSectionHighlights()}
          {renderSection7()}
          {/* {renderSection5()} */}
          {renderSection8()}
          {renderSection9()}
        </div>

        {/* SIDEBAR */}
        <div className="hidden lg:block w-1/2 flex-grow mt-14 lg:mt-0">
          <div className="sticky top-28">{renderSidebar()}</div>
        </div>
      </main>
      {/* STICKY FOOTER MOBILE */}

      <MobileFooterSticky tickets={event.tickets} event_id={event.id} />
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
