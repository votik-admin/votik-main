import { ComponentType } from "react";

export interface LocationStates {
  // votik special
  "/"?: {};
  "/events"?: {};

  "/#"?: {};
  "/home-2"?: {};
  "/home-3"?: {};
  "/home-1-header-2"?: {};
  //
  "/listing-flights"?: {};
  //
  "/listing-stay"?: {};
  "/listing-stay-map"?: {};
  "/listing-stay-detail"?: {};
  //
  "/listing-experiences"?: {};
  "/listing-experiences-map"?: {};
  "/listing-experiences-detail"?: {};
  //
  "/listing-real-estate"?: {};
  "/listing-real-estate-map"?: {};
  "/listing-real-estate-detail"?: {};
  //
  "/listing-car"?: {};
  "/listing-car-map"?: {};
  "/listing-car-detail"?: {};
  //
  "/checkout"?: {};
  "/pay-done"?: {};
  //
  "/user/account-savelists"?: {};
  "/user/account-password"?: {};
  "/user/account-billing"?: {};
  //
  "/blog"?: {};
  "/blog-single"?: {};
  //
  "/add-event"?: {};
  "/add-event/2"?: {};
  "/add-event/3"?: {};
  "/add-event/4"?: {};
  "/add-event/5"?: {};
  "/add-event/6"?: {};
  "/add-event/7"?: {};
  "/add-event/8"?: {};
  "/add-event/9"?: {};
  "/add-event/10"?: {};
  //
  "/user/account"?: {};
  "/search"?: {};
  "/about"?: {};
  "/contact"?: {};
  "/login"?: {};
  "/signup"?: {};
  "/forgot-pass"?: {};
  "/page404"?: {};
  "/subscription"?: {};
}

export type PathName = keyof LocationStates;

export interface Page {
  path: PathName;
  exact?: boolean;
  component: ComponentType<object>;
}
