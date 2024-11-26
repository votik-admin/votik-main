import React, { FC } from "react";
import { Metadata } from "next";
import ContactUsPage from "./ContactUsPage";

const PageContact = () => {
  return (
    <div
      className={`nc-ContactUsPage overflow-hidden`}
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
