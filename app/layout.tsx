import type { Metadata } from "next";
import localFont from "next/font/local";

import "react-dates/lib/css/_datepicker.css";
import "rc-slider/assets/index.css";
// STYLE
import "./styles/index.scss";
import "./globals.css";
import "./fonts/line-awesome-1.3.0/css/line-awesome.css";
import "react-dates/initialize";

import SiteHeader from "@app/containers/SiteHeader";
import Footer from "./shared/Footer/Footer";
import { createClient } from "./lib/supabase/server";
import { Database } from "./types/database.types";
import { getSessionAndUser } from "./lib/auth";
import NextTopLoader from "nextjs-toploader";

import { GoogleAnalytics } from "@next/third-parties/google";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Votik",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userDetails: {
    user: Database["public"]["Tables"]["users"]["Row"] | null;
  } = {
    user: null,
  };

  const { session, user } = await getSessionAndUser();

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader
          color={"#c4fd078b"}
          // color={"#430D7F"}
        />
        <div className="bg-white text-base dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">
          <SiteHeader session={session} user={user} />
          {children}
          <Footer />
        </div>
      </body>
      <GoogleAnalytics gaId="G-R1RJRTNCKF" />
    </html>
  );
}
