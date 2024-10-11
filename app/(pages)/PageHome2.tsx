import SectionSliderNewCategories from "@/app/components/SectionSliderNewCategories/SectionSliderNewCategories";
import React, { useEffect } from "react";
import SectionSubscribe2 from "@/app/components/SectionSubscribe2/SectionSubscribe2";
import SectionOurFeatures from "@/app/components/SectionOurFeatures/SectionOurFeatures";
import SectionHowItWork from "@/app/components/SectionHowItWork/SectionHowItWork";
import BackgroundSection from "@/app/components/BackgroundSection/BackgroundSection";
import { TaxonomyType } from "@/app/data/types";
import SectionGridAuthorBox from "@/app/components/SectionGridAuthorBox/SectionGridAuthorBox";
import SectionHero2 from "@/app/components/SectionHero2/SectionHero2";
//
import logo1 from "@/app/images/logos/nomal/1.png";
import logo1Dark from "@/app/images/logos/dark/1.png";
//
import logo2 from "@/app/images/logos/nomal/2.png";
import logo2Dark from "@/app/images/logos/dark/2.png";
//
import logo3 from "@/app/images/logos/nomal/3.png";
import logo3Dark from "@/app/images/logos/dark/3.png";
//
import logo4 from "@/app/images/logos/nomal/4.png";
import logo4Dark from "@/app/images/logos/dark/4.png";
//
import logo5 from "@/app/images/logos/nomal/5.png";
import logo5Dark from "@/app/images/logos/dark/5.png";
//
import HIW1img from "@/app/images/HIW2-1.png";
import HIW2img from "@/app/images/HIW2-2.png";
import HIW3img from "@/app/images/HIW2-3.png";
import HIW1imgDark from "@/app/images/HIW2-1-dark.png";
import HIW2imgDark from "@/app/images/HIW2-2-dark.png";
import HIW3imgDark from "@/app/images/HIW2-3-dark.png";
import rightImgPng from "@/app/images/our-features-2.png";

import SectionGridFeatureProperty from "./SectionGridFeatureProperty";
import SectionDowloadApp from "./SectionDowloadApp";

const DEMO_CATS_2: TaxonomyType[] = [
  {
    id: "1",
    href: "/listing-stay",
    name: "Enjoy the great cold",
    taxonomy: "category",
    count: 188288,
    thumbnail:
      "https://images.pexels.com/photos/5764100/pexels-photo-5764100.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
  },
  {
    id: "222",
    href: "/listing-stay",
    name: "Sleep in a floating way",
    taxonomy: "category",
    count: 188288,
    thumbnail:
      "https://images.pexels.com/photos/2869499/pexels-photo-2869499.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
  {
    id: "3",
    href: "/listing-stay",
    name: "In the billionaire's house",
    taxonomy: "category",
    count: 188288,
    thumbnail:
      "https://images.pexels.com/photos/7031413/pexels-photo-7031413.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
  {
    id: "4",
    href: "/listing-stay",
    name: "Cool in the deep forest",
    taxonomy: "category",
    count: 188288,
    thumbnail:
      "https://images.pexels.com/photos/247532/pexels-photo-247532.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
  {
    id: "5",
    href: "/listing-stay",
    name: "In the billionaire's house",
    taxonomy: "category",
    count: 188288,
    thumbnail:
      "https://images.pexels.com/photos/7031413/pexels-photo-7031413.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
];

function PageHome2() {
  // CUSTOM THEME STYLE
  useEffect(() => {
    const $body = document.querySelector("body");
    if (!$body) return;
    $body.classList.add("theme-cyan-blueGrey");
    return () => {
      $body.classList.remove("theme-cyan-blueGrey");
    };
  }, []);

  return (
    <div className="nc-PageHome2 relative overflow-hidden">
      {/* GLASSMOPHIN */}
      {/* <BgGlassmorphism /> */}

      <div className="container relative space-y-24 mb-24 lg:space-y-28 lg:mb-28">
        <SectionHero2 className="" />

        {/* SECTION 1 */}
        <div className="ncSectionLogos grid grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-16">
          <div className="flex items-end justify-center">
            <img className="block dark:hidden" src={logo1} alt="logo1" />
            <img className="hidden dark:block" src={logo1Dark} alt="logo1" />
          </div>
          <div className="flex items-end justify-center">
            <img className="block dark:hidden" src={logo4} alt="logo4" />
            <img className="hidden dark:block" src={logo4Dark} alt="logo4" />
          </div>
          <div className="flex items-end justify-center">
            <img className="block dark:hidden" src={logo2} alt="logo2" />
            <img className="hidden dark:block" src={logo2Dark} alt="logo2" />
          </div>
          <div className="flex items-end justify-center">
            <img className="block dark:hidden" src={logo3} alt="logo3" />
            <img className="hidden dark:block" src={logo3Dark} alt="logo3" />
          </div>

          <div className="flex items-end justify-center">
            <img className="block dark:hidden" src={logo5} alt="logo5" />
            <img className="hidden dark:block" src={logo5Dark} alt="logo5" />
          </div>
        </div>

        {/* SECTION */}
        <SectionHowItWork
          data={[
            {
              id: 1,
              img: HIW1img,
              imgDark: HIW1imgDark,
              title: "Smart search",
              desc: "Name the area or type of home you are looking for the search bar. Our app will find you the perfect match.",
            },
            {
              id: 2,
              img: HIW2img,
              imgDark: HIW2imgDark,
              title: "Choose property",
              desc: "From the number of options our app will provide, you can select any property that you like to explore.",
            },
            {
              id: 3,
              img: HIW3img,
              imgDark: HIW3imgDark,
              title: "Book you property",
              desc: "Find a home or space from our search bar. Enter your specific location, property type and price range.",
            },
          ]}
        />

        {/* SECTION */}
        <div className="relative py-16">
          <BackgroundSection />
          <SectionGridFeatureProperty />
        </div>

        {/* SECTION2 */}
        <SectionOurFeatures type="type2" rightImg={rightImgPng} />

        {/* SECTION */}
        <SectionDowloadApp />

        {/* SECTION 1 */}
        <SectionSliderNewCategories
          categories={DEMO_CATS_2}
          categoryCardType="card4"
          itemPerRow={4}
          heading="Suggestions for discovery"
          subHeading="Popular places to stay that Chisfis recommends for you"
          uniqueClassName="PageHome2_s1"
        />

        {/* SECTION */}
        <div className="relative py-16">
          <BackgroundSection className="bg-neutral-100 dark:bg-black dark:bg-opacity-20 " />
          <SectionGridAuthorBox boxCard="box2" />
        </div>

        {/* SECTION 1 */}
        <SectionSliderNewCategories
          heading="Explore by types of stays"
          subHeading="Explore houses based on 10 types of stays"
          categoryCardType="card5"
          itemPerRow={5}
          uniqueClassName="PageHome2_s2"
        />

        {/* SECTION */}
        <SectionSubscribe2 />
      </div>
    </div>
  );
}

export default PageHome2;
