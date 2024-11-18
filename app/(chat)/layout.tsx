import type { Metadata } from "next";
import { Bebas_Neue } from "next/font/google";

import "react-dates/lib/css/_datepicker.css";
import "rc-slider/assets/index.css";
// STYLE
import "../styles/index.scss";
import "../globals.css";
import "../fonts/line-awesome-1.3.0/css/line-awesome.css";
import "react-dates/initialize";

import Footer from "@app/shared/Footer/Footer";
import { Tables } from "@app/types/database.types";
import { getSessionAndOrganizer } from "@app/lib/auth";
import NextTopLoader from "nextjs-toploader";

import { GoogleAnalytics } from "@next/third-parties/google";
import SiteHeader from "@app/organizers/components/SiteHeader/SiteHeader";
import { TooltipProvider } from "@radix-ui/react-tooltip";

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Votik",
    default:
      "Book Tickets for Music Festivals, Concerts, Comedy Shows & Club Parties",
  },
  description:
    "Connect with friends and enjoy unforgettable experiences with fast, easy booking. Book tickets on Votik for music festivals, concerts, comedy shows, club parties, and events.",
  keywords: [
    "music festival tickets",
    "concert tickets",
    "music event tickets",
    "live music shows",
    "book music tickets",
    "music ticket booking",
    "concert events",
    "music shows",
  ],
  authors: [
    { name: "tsarprince", url: "https://github.com/tsarprince/" },
    { name: "chakri68", url: "https://github.com/chakri68/" },
  ],
  twitter: {
    card: "summary_large_image",
  },
  openGraph: {
    title: "Votik",
    description: "Your Gate To Epic Experiences",
    url: "https://www.votik.app",

    siteName: "Votik",
    images: [
      {
        url: "https://www.votik.app/og.png",
        width: 1200,
        height: 629,
      },
    ],
    locale: "en-US",
    type: "website",
  },
  manifest: "/site.webmanifest",
  icons: {
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TooltipProvider>
      <NextTopLoader
        showSpinner={false}
        color={"#c4fd07"}
        // color={"#430D7F"}
      />
      <div className="bg-white text-base dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">
        {/* <SiteHeader session={null} organizer={null} /> */}
        {children}
        <Footer />
      </div>
    </TooltipProvider>
  );
}
