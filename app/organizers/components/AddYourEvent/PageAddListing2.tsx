"use client";

import { MapPinIcon } from "@heroicons/react/24/solid";
import LocationMarker from "@app/components/AnyReactComponent/LocationMarker";
import Label from "@app/components/Label/Label";
import GoogleMapReact from "google-map-react";
import React, { ChangeEvent, FC } from "react";
import ButtonSecondary from "@app/shared/Button/ButtonSecondary";
import Input from "@app/shared/Input/Input";
import Select from "@app/shared/Select/Select";
import CommonLayout from "./CommonLayout";
import FormItem from "./FormItem";
import EventTypes, { CityLatLngMap } from "@app/data/event-create";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import ButtonPrimary from "@app/shared/Button/ButtonPrimary";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import supabase from "@app/lib/supabase";
import { Tables } from "@app/types/database.types";

export interface PageAddListing2Props {
  event: Tables<"events">;
}

type Page2Form = {
  address: string;
  postalCode: number;
  city: (typeof EventTypes)["City"][number];
  latitute: number;
  longitude: number;
};

const PageAddListing2: FC<PageAddListing2Props> = ({ event }) => {
  const { eventId, id } = useParams();
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const { register, setValue, formState, handleSubmit, watch } =
    useForm<Page2Form>({
      defaultValues: {
        address: event.location || "",
        postalCode: 0,
        city: event.city || "MUMBAI",
      },
    });

  const selectedCity = watch("city");

  const onSubmit = async (d: Page2Form) => {
    setLoading(true);
    const toastId = toast.loading("Updating event...");
    try {
      const { data, error } = await supabase
        .from("events")
        .update({
          location: d.address,
          city: d.city,
        })
        .eq("id", eventId);

      if (error) throw error;

      toast.success("Event updated successfully", { id: toastId });
      router.push(`/organizer/event/${eventId}/edit/3`);
    } catch (error: any) {
      console.error("Error creating event", error);
      toast.error(`Error creating an event ${error?.message}`, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommonLayout index="02">
      <>
        <h2 className="text-2xl font-semibold">Event location</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        {/* FORM */}
        <div className="space-y-8">
          {/* <ButtonSecondary>
            <MapPinIcon className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
            <span className="ml-3">Use current location</span>
          </ButtonSecondary> */}
          {/* ITEM */}
          <FormItem label="Event address">
            <Input
              placeholder="Address"
              {...register("address", {
                required: "Address is required",
              })}
            />
            <ErrorMessage
              render={(data) => (
                <p className="text-red-500 mt-2 text-sm">{data.message}</p>
              )}
              errors={formState.errors}
              name="address"
            />
          </FormItem>
          <FormItem label="Postal code">
            <Input
              placeholder="Postal code"
              type="number"
              {...register("postalCode", {
                required: "Postal code is required",
                validate: (value) =>
                  value.toString().length === 6 || "Invalid postal code",
              })}
            />
            <ErrorMessage
              render={(data) => (
                <p className="text-red-500 mt-2 text-sm">{data.message}</p>
              )}
              errors={formState.errors}
              name="postalCode"
            />
          </FormItem>
          <FormItem label="City/Region">
            <Select
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setValue("city", e.target.value as Page2Form["city"]);
              }}
            >
              {EventTypes.City.map((item) => (
                <option key={item} value={item}>
                  {item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()}
                </option>
              ))}
            </Select>
          </FormItem>
          <div>
            <Label>Location on map</Label>
            <span className="block mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Drag the pin to set the exact location
            </span>
            <div className="mt-4">
              <div className="aspect-w-5 aspect-h-5 sm:aspect-h-3">
                <div className="rounded-xl overflow-hidden">
                  <GoogleMapReact
                    bootstrapURLKeys={{
                      key: "AIzaSyAGVJfZMAKYfZ71nzL_v5i3LjTTWnCYwTY",
                    }}
                    yesIWantToUseGoogleMapApiInternals
                    defaultZoom={15}
                    defaultCenter={{
                      lat: CityLatLngMap[selectedCity][0],
                      lng: CityLatLngMap[selectedCity][1],
                    }}
                    onChange={(e) => {
                      setValue("latitute", e.center.lat);
                      setValue("longitude", e.center.lng);
                    }}
                  >
                    <LocationMarker
                      lat={CityLatLngMap[selectedCity][0]}
                      lng={CityLatLngMap[selectedCity][1]}
                    />
                  </GoogleMapReact>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-5">
          <ButtonSecondary href={`/organizer/event/${eventId}/edit/1`}>
            Go back
          </ButtonSecondary>
          <ButtonPrimary onClick={handleSubmit(onSubmit)} loading={loading}>
            Continue
          </ButtonPrimary>
        </div>
      </>
    </CommonLayout>
  );
};

export default PageAddListing2;
