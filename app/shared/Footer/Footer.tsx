"use client";

import Logo from "@app/shared/Logo/Logo";
import { CustomLink } from "@app/data/types";
import Link from "next/link";
import React from "react";
import SocialsList1 from "../SocialsList1/SocialsList1";
import { usePathname } from "next/navigation";

export interface WidgetFooterMenu {
  id: string;
  title: string;
  menus: CustomLink[];
}

const widgetMenus: WidgetFooterMenu[] = [
  {
    id: "0",
    title: "Explore",
    menus: [
      { href: "/events/category/music", label: "Music Concerts" },
      { href: "/events/category/comedy", label: "Comedy Shows" },
      { href: "/events/category/experiences", label: "Experiences" },
      { href: "/events/category/nightlife", label: "Nightlife" },
    ],
  },
  {
    id: "1",
    title: "Your Account",
    menus: [
      { href: "/user/account", label: "My Profile" },
      { href: "/user/account/bookings", label: "Manage Bookings" },
      { href: "/user/account/password", label: "Change Password" },
    ],
  },
  {
    id: "2",
    title: "Organizer",
    menus: [
      { href: "/organizer/add-event", label: "List Your Event" },
      { href: "/organizer/dashboard", label: "Dashboard" },
      { href: "/organizer/account", label: "Manage Organiser Account" },
      { href: "/organizer/signup", label: "Signup as an Organiser" },
    ],
  },
  {
    id: "3",
    title: "Legal",
    menus: [
      { href: "/tnc", label: "Terms & Conditions" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/about-us", label: "About Us" },
      { href: "/contact-us", label: "Contact Us" },
    ],
  },
];

const Footer: React.FC = () => {
  const pathName = usePathname();

  if (pathName.includes("/chat")) {
    // Hide footer in chat page
    return null;
  }

  const renderWidgetMenuItem = (menu: WidgetFooterMenu, index: number) => {
    return (
      <div key={index} className="text-sm">
        <h2 className="font-semibold text-neutral-700 dark:text-neutral-200">
          {menu.title}
        </h2>
        <ul className="mt-5 space-y-4">
          {menu.menus.map((item, index) => (
            <li key={index}>
              <Link
                key={index}
                className="text-neutral-6000 dark:text-neutral-300 hover:text-black dark:hover:text-white"
                href={item.href}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="nc-Footer relative py-24 lg:py-28 border-t border-neutral-200 dark:border-neutral-700">
      <div className="container grid grid-cols-2 gap-y-10 gap-x-5 sm:gap-x-8 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-10 ">
        <div className="grid grid-cols-4 gap-5 col-span-2 md:col-span-4 lg:md:col-span-1 lg:flex lg:flex-col">
          <div className="col-span-2 md:col-span-1">
            <Logo />
          </div>
          <div className="col-span-2 flex items-center md:col-span-3">
            <SocialsList1 className="flex items-center space-x-3 lg:space-x-0 lg:flex-col lg:space-y-2.5 lg:items-start" />
          </div>
        </div>
        {widgetMenus.map(renderWidgetMenuItem)}
      </div>
    </div>
  );
};

export default Footer;
