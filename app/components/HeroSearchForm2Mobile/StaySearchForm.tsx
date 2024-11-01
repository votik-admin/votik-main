import { DateRage } from "@app/components/HeroSearchForm/StaySearchForm";
import React, { useState } from "react";
import GuestsInput, { GuestsObject } from "./GuestsInput";
import LocationInput from "./LocationInput";
import StayDatesRangeInput from "./StayDatesRangeInput";

const StaySearchForm = () => {
  //
  const [fieldNameShow, setFieldNameShow] = useState<
    "location" | "dates" | "guests"
  >("location");
  //
  const [locationInputTo, setLocationInputTo] = useState("");
  const [guestInput, setGuestInput] = useState<GuestsObject>({
    guestAdults: 0,
    guestChildren: 0,
    guestInfants: 0,
  });
  const [dateRangeValue, setDateRangeValue] = useState<DateRage>({
    startDate: null,
    endDate: null,
  });

  const renderInputLocation = () => {
    const isActive = fieldNameShow === "location";
    return (
      <div
        className={`w-full bg-white dark:bg-neutral-800 ${
          isActive
            ? "rounded-2xl shadow-lg"
            : "rounded-xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]"
        }`}
      >
        {!isActive ? (
          <button
            className={`w-full flex justify-between text-sm font-medium p-4`}
            onClick={() => setFieldNameShow("location")}
          >
            <span className="text-neutral-400">Where</span>
            <span>{locationInputTo || "Location"}</span>
          </button>
        ) : (
          <LocationInput
            defaultValue={locationInputTo}
            onChange={(value) => {
              setLocationInputTo(value);
              setFieldNameShow("dates");
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="w-full space-y-5">{renderInputLocation()}</div>
    </div>
  );
};

export default StaySearchForm;
