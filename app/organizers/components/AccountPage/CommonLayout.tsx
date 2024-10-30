"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FC } from "react";

export interface CommonLayoutProps {
  children?: React.ReactNode;
}

const TABS = [
  { href: "/organizer/account", label: "Account info" },
  { href: "/organizer/account/password", label: "Change password" },
];

const CommonLayout: FC<CommonLayoutProps> = ({ children }) => {
  const NavLink = ({
    to,
    className,
    children,
  }: {
    to: string;
    className: (props: { isActive: boolean }) => string;
    children: React.ReactNode;
  }) => {
    const pathname = usePathname();
    return (
      <Link className={className({ isActive: pathname === to })} href={to}>
        {children}
      </Link>
    );
  };

  return (
    <div className="nc-CommonLayoutProps bg-neutral-50 dark:bg-neutral-900">
      <div className="border-b border-neutral-200 dark:border-neutral-700 pt-12 bg-white dark:bg-neutral-800">
        <div className="container">
          <div className="flex space-x-8 md:space-x-14 overflow-x-auto hiddenScrollbar">
            {TABS.map(({ label, href }) => (
              <NavLink
                to={href}
                key={href}
                className={({ isActive }) =>
                  `block py-5 md:py-8 border-b-2 flex-shrink-0 ${
                    !isActive ? "border-transparent" : "border-primary-500"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
      <div className="container pt-14 sm:pt-20 pb-24 lg:pb-32">{children}</div>
    </div>
  );
};

export default CommonLayout;
