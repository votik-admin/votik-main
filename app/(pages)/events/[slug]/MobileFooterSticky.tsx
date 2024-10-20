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

const MobileFooterSticky = () => {
  const [selectedDate, setSelectedDate] = useState<DateRage>({
    startDate: moment().add(4, "days"),
    endDate: moment().add(10, "days"),
  });
  const [guestsState, setGuestsState] = useState<GuestsObject>({
    guestAdults: 0,
    guestChildren: 0,
    guestInfants: 0,
  });

  return (
    <div className="block lg:hidden fixed bottom-0 inset-x-0 py-2 sm:py-3 bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-6000 z-20">
      <div className="container flex items-center justify-between">
        <div className="">
          <span className="block text-xl font-semibold">
            ₹ 5000
            <span className="ml-1 text-sm font-normal text-neutral-500 dark:text-neutral-400">
              Onwards
            </span>
          </span>
        </div>
        <ModalReserveMobile
          defaultGuests={guestsState}
          defaultDate={selectedDate}
          onChangeDate={setSelectedDate}
          onChangeGuests={setGuestsState}
          renderChildren={({ openModal }) => (
            <ButtonCustom>BOOK NOW</ButtonCustom>
          )}
        />
      </div>
    </div>
  );
};

export default MobileFooterSticky;
