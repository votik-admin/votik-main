"use client";

import StayCard from "@app/components/StayCard/StayCard";
import { DEMO_STAY_LISTINGS } from "@app/data/listings";
import React, { FC } from "react";
import ButtonPrimary from "@app/shared/Button/ButtonPrimary";
import ButtonSecondary from "@app/shared/Button/ButtonSecondary";
import CommonLayout from "./CommonLayout";

export interface PageAddListing10Props {}

const PageAddListing4: FC<PageAddListing10Props> = () => {
  return (
    <CommonLayout index="05">
      <>
        <div>
          <h2 className="text-2xl font-semibold">Congratulations 🎉</h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            Your event will be reviewed by our team and will be live soon!
          </span>
        </div>
        <div className="flex justify-end space-x-5">
          <ButtonPrimary href={"/organizer/dashboard"}>
            Go back to Dashboard
          </ButtonPrimary>
        </div>
      </>
    </CommonLayout>
  );
};

export default PageAddListing4;
