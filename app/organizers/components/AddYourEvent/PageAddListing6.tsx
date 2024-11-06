"use client";

import React, { FC } from "react";
import ButtonPrimary from "@app/shared/Button/ButtonPrimary";
import CommonLayout from "./CommonLayout";
import { useParams } from "next/navigation";
import ButtonSecondary from "@app/shared/Button/ButtonSecondary";

export interface PageAddListing6Props {}

const PageAddListing6: FC<PageAddListing6Props> = () => {
  const { eventId } = useParams();

  return (
    <CommonLayout index="05">
      <>
        <div>
          <h2 className="text-2xl font-semibold">Congratulations 🎉</h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            Your event will be reviewed by our team and will be live soon!
          </span>
        </div>
        <div className="flex justify-end space-x-5 gap-2">
          <ButtonSecondary href="/organizer">
            Go back to dashboard
          </ButtonSecondary>
          <ButtonPrimary href={`/organizer/event/${eventId}/preview`}>
            Preview the event
          </ButtonPrimary>
        </div>
      </>
    </CommonLayout>
  );
};

export default PageAddListing6;
