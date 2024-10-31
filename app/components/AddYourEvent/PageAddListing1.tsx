import React, { FC } from "react";
import Input from "@app/shared/Input/Input";
import Select from "@app/shared/Select/Select";
import CommonLayout from "./CommonLayout";
import FormItem from "./FormItem";
import EventTypes from "@app/data/event-create";

export interface PageAddListing1Props {}

const EventListing1: FC<PageAddListing1Props> = () => {
  return (
    <CommonLayout
      index="01"
      backtHref="/organizer/add-event/1"
      nextHref="/organizer/add-event/2"
    >
      <>
        <h2 className="text-2xl font-semibold">Basic information</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        {/* FORM */}
        <div className="space-y-8">
          {/* ITEM */}
          <FormItem
            label="Choose the event category"
            desc="Select the category that best describes your event"
          >
            <Select>
              {EventTypes.EventCategory.map((item) => (
                <option key={item} value={item}>
                  {item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()}
                </option>
              ))}
            </Select>
          </FormItem>
          <FormItem
            label="Event name"
            desc="Choose a name that reflects your event"
          >
            <Input placeholder="Event name" />
          </FormItem>
          <FormItem
            label="Description"
            desc="Write a short description of your event"
          >
            <Input placeholder="Description" />
          </FormItem>
        </div>
      </>
    </CommonLayout>
  );
};

export default EventListing1;
