import mainImg from "@app/images/aboutUs/about-us.png";
import leftPng from "@app/images/aboutUs/left.jpg";
import rightPng from "@app/images/aboutUs/right.png";

import React from "react";
import BgGlassmorphism from "@app/components/BgGlassmorphism/BgGlassmorphism";
import SectionHero from "./SectionHero";
import SectionOurFeatures from "./SectionOurFeatures";
import { Metadata } from "next";
import ContactUsPage from "../contact-us/ContactUsPage";

const PageAbout = () => {
  return (
    <div
      className={`nc-PageAbout overflow-hidden relative`}
      data-nc-id="PageAbout"
    >
      {/* ======== BG GLASS ======== */}
      <BgGlassmorphism />

      <div className="container py-16 lg:py-28 space-y-16 lg:space-y-28">
        <SectionHero
          rightImg={mainImg.src}
          heading={
            <span>
              👋
              <br />
              Welcome to Votik
            </span>
          }
          description="Your gateway to unforgettable live events."
          btnText=""
          subHeading="At Votik, we don’t just sell tickets we create experiences. Our mission is to make ticket booking seamless, social, and meaningful for event-goers across India."
        />

        <SectionOurFeatures
          img={leftPng.src}
          data={{
            topText: "We’re redefining how India connects with live events.",
            heading: "What Makes Us Different?",
            features: [
              {
                badge: {
                  text: "Ease",
                  color: "green",
                },
                title: "Seamless Booking",
                descritption:
                  "No hidden fees, no hassles just straightforward ticketing for the concerts, comedy shows, and festivals you love.",
              },
              {
                badge: {
                  text: "Connection",
                  color: "blue",
                },
                title: "Social Connectivity",
                descritption:
                  "With our unique Pre-Event Chatrooms, you’ll connect with like-minded attendees before the event even begins. Meet new people, share the excitement, and make every event more than just a moment.",
              },
              {
                badge: {
                  text: "Discovery",
                  color: "pink",
                },
                title: "Curated Experiences",
                descritption:
                  "Discover carefully selected events tailored to your vibe. Whether you’re attending solo or with friends, Votik ensures you get the most out of every experience.",
              },
            ],
          }}
        />
        <SectionOurFeatures
          button={{
            text: "Become a partner",
            href: "/organizer/signup",
          }}
          type="type2"
          img={rightPng.src}
          data={{
            // topText: "We’re redefining how India connects with live events.",
            heading: "Why Choose Votik?",
            features: [
              {
                badge: {
                  text: "Togetherness",
                  color: "green",
                },
                title:
                  "Bring people together through the power of live experiences.",
                // descritption:"No hidden fees, no hassles just straightforward ticketing for the concerts, comedy shows, and festivals you love.",
              },
              {
                badge: {
                  text: "Empower Organizers",
                  color: "pink",
                },
                title:
                  "Support event organizers with user-friendly tools and lower commissions.",
                // descritption:"With our unique Pre-Event Chatrooms, you’ll connect with like-minded attendees before the event even begins. Meet new people, share the excitement, and make every event more than just a moment.",
              },
              {
                badge: {
                  text: "Community Building",
                  color: "blue",
                },
                title:
                  "Build a community that thrives on shared passions and memorable moments.",
                // descritption:"Discover carefully selected events tailored to your vibe. Whether you’re attending solo or with friends, Votik ensures you get the most out of every experience.",
              },
            ],
          }}
        />
        <ContactUsPage />
        {/* <SectionFounder />
        <div className="relative py-16">
          <BackgroundSection />
          <SectionClientSay uniqueClassName="PageAbout_" />
        </div>

        <SectionStatistic />

        <SectionSubscribe2 /> */}
      </div>
    </div>
  );
};

export const metadata: Metadata = {
  title: "About Us",
};

export default PageAbout;
