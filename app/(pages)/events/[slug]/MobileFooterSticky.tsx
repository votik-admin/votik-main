"use client";

import { DateRage } from "@app/components/HeroSearchForm/StaySearchForm";
import { GuestsObject } from "@app/components/HeroSearchForm2Mobile/GuestsInput";
import ModalSelectDate from "@app/components/ModalSelectDate";
import moment from "moment";
import React, { useState } from "react";
import ButtonPrimary from "@app/shared/Button/ButtonPrimary";
import converSelectedDateToString from "@app/utils/converSelectedDateToString";
import ModalReserveMobile from "./ModalReserveMobile";
import ButtonCustom from "@app/shared/Button/ButtonCustom";
import convertNumbThousand from "@app/utils/convertNumbThousand";
import { Tables } from "@app/types/database.types";

const MobileFooterSticky = ({
  tickets,
  event_id,
}: {
  tickets?: Tables<"tickets">[];
  event_id: string;
}) => {
  return (
    <div className="block lg:hidden fixed bottom-0 inset-x-0 py-2 sm:py-3 bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-6000 z-20">
      <div className="container flex items-center justify-between">
        <div className="">
          <span className="block text-xl font-semibold">
            ₹{" "}
            {convertNumbThousand(
              tickets?.sort((a, b) => a.price - b.price)[0]?.price
            )}{" "}
            Onwards
          </span>
        </div>
        <ModalReserveMobile
          tickets={tickets}
          event_id={event_id}
          renderChildren={({ openModal }) => (
            <ButtonCustom onClick={openModal}>BOOK NOW</ButtonCustom>
          )}
        />
      </div>
    </div>
  );
};

export default MobileFooterSticky;
