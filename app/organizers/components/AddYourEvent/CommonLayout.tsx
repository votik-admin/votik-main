import React from "react";
import { FC } from "react";
import { Toaster } from "react-hot-toast";

export interface CommonLayoutProps {
  index: string;
  children: React.ReactNode;
}

const CommonLayout: FC<CommonLayoutProps> = ({ index = "01", children }) => {
  return (
    <div
      className={`nc-PageAddListing1 px-4 max-w-3xl mx-auto pb-24 pt-14 sm:py-24 lg:pb-32`}
      data-nc-id="PageAddListing1"
    >
      <Toaster />
      <div className="space-y-11">
        <div>
          <span className="text-4xl font-semibold">{index}</span>{" "}
          <span className="text-lg text-neutral-500 dark:text-neutral-400">
            / 5
          </span>
        </div>

        {/* --------------------- */}
        <div className="listingSection__wrap ">{children}</div>
      </div>
    </div>
  );
};

export default CommonLayout;
