import React from "react";
import SectionGridFeaturePlaces from "./SectionGridFeaturePlaces";
import BackgroundSection from "@/app/components/BackgroundSection/BackgroundSection";
import BgGlassmorphism from "@/app/components/BgGlassmorphism/BgGlassmorphism";
import { TaxonomyType } from "@/app/data/types";
import SectionHero3 from "@/app/components/SectionHero/SectionHero3";
import CardCategory6 from "@/app/components/CardCategory6/CardCategory6";
import Heading from "../components/Heading/Heading";

import imageMusic from "@/app/images/home/music.jpg";
import imageComedy from "@/app/images/home/comedy.png";
import imageWorkshops from "@/app/images/home/workshops.png";
import imageNightlife from "@/app/images/home/nightlife.jpg";
import SectionSliderNewCategories from "@/app/components/SectionSliderNewCategories/SectionSliderNewCategories";

const EVENT_CATEGORIES: TaxonomyType[] = [
  {
    id: "1",
    href: "/category/music",
    name: "Music Concerts",
    taxonomy: "category",
    count: 188,
    thumbnail: imageMusic.src,
  },
  {
    id: "2",
    href: "/category/comedy",
    name: "Comedy",
    taxonomy: "category",
    count: 288,
    thumbnail: imageComedy.src,
  },
  {
    id: "3",
    href: "/category/workshops",
    name: "Workshops",
    taxonomy: "category",
    count: 82,
    thumbnail: imageWorkshops.src,
  },
  {
    id: "4",
    href: "/category/nightlife",
    name: "Nightlife",
    taxonomy: "category",
    count: 81111,
    thumbnail: imageNightlife.src,
  },
];

function PageHome3() {
  return (
    <div className="nc-PageHome3 relative overflow-hidden">
      {/* GLASSMOPHIN */}
      <BgGlassmorphism />

      <SectionHero3 className="" />

      {/* SECTION HERO */}
      <div className="container px-1 sm:px-4 mb-24 "></div>

      <div className="container relative space-y-24 mb-24 ">
        {/* SECTION 1 */}
        <Heading
          desc="Explore epic events by category! Whether you’re into concerts, comedy, or workshops, we’ve got something that’ll get you hyped!"
          isCenter={true}
        >
          Browse Events by Categories
        </Heading>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 sm:col-span-6 lg:col-span-4 flex">
            <CardCategory6 taxonomy={EVENT_CATEGORIES[0]} />
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-4 grid grid-rows-2 gap-6">
            <CardCategory6 taxonomy={EVENT_CATEGORIES[1]} />
            <CardCategory6 taxonomy={EVENT_CATEGORIES[2]} />
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-4 flex">
            <CardCategory6 taxonomy={EVENT_CATEGORIES[3]} />
          </div>
        </div>

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
