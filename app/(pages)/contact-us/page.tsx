import React, { FC } from "react";
import { Metadata } from "next";
import ContactUsPage from "./ContactUsPage";

export interface PageContactProps {
  className?: string;
}

const PageContact: FC<PageContactProps> = ({ className = "" }) => {
  return (
    <div
      className={`nc-ContactUsPage overflow-hidden ${className}`}
      data-nc-id="ContactUsPage"
    >
      <div className="mb-24 lg:mb-32">
        <div className="container max-w-7xl mx-auto">
          <ContactUsPage />
        </div>
      </div>
    </div>
  );
};

export default PageContact;

export const metadata: Metadata = {
  title: "Contact Us",
};
