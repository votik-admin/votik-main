import React from "react";
import SectionGridFeaturePlaces from "@app/(pages)/SectionGridFeaturePlaces";
import BackgroundSection from "@app/components/BackgroundSection/BackgroundSection";
import BgGlassmorphism from "@app/components/BgGlassmorphism/BgGlassmorphism";
import SectionSliderNewCategories from "@app/components/SectionSliderNewCategories/SectionSliderNewCategories";
import SectionHeroCategory from "@app/components/SectionHero/SectionHeroCategory";
import { getCategoryFromSlug, getEventsFromCategory } from "@app/queries";
import { notFound } from "next/navigation";

async function PageHome3({
  params: { slug },
}: {
  params: {
    slug: string;
  };
}) {
  console.log(slug);
  const { data, error } = await getCategoryFromSlug(slug);
  if (!data) return notFound();

  const { data: eventData, error: eventError } = await getEventsFromCategory(
    data.category
  );

  return (
    <div className="nc-PageHome3 relative overflow-hidden">
      {/* GLASSMOPHIN */}
      <BgGlassmorphism />

      <SectionHeroCategory
        className=""
        data={data}
        eventData={eventData || []}
      />

      {/* SECTION HERO */}
      <div className="container px-1 sm:px-4 mb-24 "></div>

      <div className="container relative space-y-24 mb-24 ">
        {/* SECTION */}
        <div className="relative py-16">
          <BackgroundSection />
          <SectionGridFeaturePlaces />
        </div>
        <SectionSliderNewCategories
          heading="Browse Events by Venues"
          subHeading=""
          categoryCardType="card5"
          itemPerRow={5}
          uniqueClassName="PageHome_s3"
        />
      </div>
    </div>
  );
}

export default PageHome3;
