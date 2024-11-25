"use client";

import React, { FC } from "react";
import ButtonPrimary from "@app/shared/Button/ButtonPrimary";
import CommonLayout from "./CommonLayout";
import { useParams } from "next/navigation";
import ButtonSecondary from "@app/shared/Button/ButtonSecondary";
import CardCategoryCustom from "@app/components/CardCategoryCustom/CardCategoryCustom";
import { Tables } from "@app/types/database.types";

export interface PageAddListing7Props {
  event: Tables<"events"> & {
    tickets: Tables<"tickets">[];
  };
}

const PageAddListing7: FC<PageAddListing7Props> = ({ event }) => {
  const { eventId } = useParams();

  return (
    <CommonLayout index="07">
      <>
        <div>
          <h2 className="text-2xl font-semibold">Congratulations 🎉</h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            Your event will be reviewed by our team and will be live soon!
          </span>
        </div>
        <p className="mt-8 text-lg text-neutral-6000 dark:text-neutral-300">
          Here is a preview of your event:
        </p>
        <div className="max-w-80 m-auto">
          <CardCategoryCustom taxonomy={event} preview />
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

export default PageAddListing7;
