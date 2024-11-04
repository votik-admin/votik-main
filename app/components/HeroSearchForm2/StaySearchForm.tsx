import React, { useState } from "react";
import LocationInput from "./LocationInput";
import { FC } from "react";
import "react-dates/initialize";

export type StaySearchFormFields = "location" | "guests" | "dates";

export interface StaySearchFormProps {
  defaultFieldFocus?: StaySearchFormFields;
  setShowHeroSearch: React.Dispatch<
    React.SetStateAction<StaySearchFormFields | null | undefined>
  >;
}

const StaySearchForm: FC<StaySearchFormProps> = ({
  defaultFieldFocus,
  setShowHeroSearch,
}) => {
  const [locationInputValue, setLocationInputValue] = useState("");

  const renderForm = () => {
    return (
      <form className="relative flex rounded-full border border-neutral-200 dark:border-neutral-700">
        <LocationInput
          defaultValue={locationInputValue}
          onChange={(e) => setLocationInputValue(e)}
          className="flex-[1.5]"
          autoFocus={defaultFieldFocus === "location"}
          setShowHeroSearch={setShowHeroSearch}
        />
      </form>
    );
  };

  return renderForm();
};

export default StaySearchForm;
