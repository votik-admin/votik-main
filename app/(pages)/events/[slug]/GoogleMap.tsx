"use client";

import React from "react";
import GoogleMapReact from "google-map-react";
import LocationMarker from "@/app/components/AnyReactComponent/LocationMarker";

const GoogleMap = ({ lat, lng }: { lat: number; lng: number }) => {
  return (
    <div className="aspect-w-5 aspect-h-5 sm:aspect-h-3">
      <div className="rounded-xl overflow-hidden">
        <GoogleMapReact
          bootstrapURLKeys={{
            key: process.env.GMAP_API_KEY!,
          }}
          yesIWantToUseGoogleMapApiInternals
          defaultZoom={15}
          defaultCenter={{
            lat,
            lng,
          }}
        >
          <LocationMarker lat={lat} lng={lng} />
        </GoogleMapReact>
      </div>
    </div>
  );
};

export default GoogleMap;
