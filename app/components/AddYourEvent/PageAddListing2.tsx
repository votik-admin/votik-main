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

export interface PageAddListing2Props {}

const PageAddListing2: FC<PageAddListing2Props> = () => {
  const [selectedCity, setSelectedCity] =
    React.useState<(typeof EventTypes)["City"][number]>("MUMBAI");

  return (
    <CommonLayout index="02" nextHref="/add-event/3" backtHref="/add-event/1">
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
            <Input placeholder="Address" />
          </FormItem>
          <FormItem label="Postal code">
            <Input placeholder="Postal code" type="number" />
          </FormItem>
          <FormItem label="City/Region">
            <Select
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setSelectedCity(e.target.value as typeof selectedCity);
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
                      key: process.env.NEXT_PUBLIC_GMAP_API_KEY!,
                    }}
                    yesIWantToUseGoogleMapApiInternals
                    defaultZoom={15}
                    defaultCenter={{
                      lat: CityLatLngMap[selectedCity][0],
                      lng: CityLatLngMap[selectedCity][1],
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
      </>
    </CommonLayout>
  );
};

export default PageAddListing2;
