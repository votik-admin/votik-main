import {
  MegamenuItem,
  NavItemType,
} from "@app/shared/Navigation/NavigationItem";
import ncNanoId from "@app/utils/ncNanoId";
import __megamenu from "./jsons/__megamenu.json";

const megaMenuDemo: MegamenuItem[] = [
  {
    id: ncNanoId(),
    image:
      "https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    title: "Company",
    items: __megamenu.map((i) => ({
      id: ncNanoId(),
      href: "/unique_id_",
      name: i.Company,
    })),
  },
  {
    id: ncNanoId(),
    image:
      "https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    title: "App Name",
    items: __megamenu.map((i) => ({
      id: ncNanoId(),
      href: "/unique_id_",
      name: i.AppName,
    })),
  },
  {
    id: ncNanoId(),
    image:
      "https://images.pexels.com/photos/5059013/pexels-photo-5059013.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    title: "City",
    items: __megamenu.map((i) => ({
      id: ncNanoId(),
      href: "/unique_id_",
      name: i.City,
    })),
  },
  {
    id: ncNanoId(),
    image:
      "https://images.pexels.com/photos/5159141/pexels-photo-5159141.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    title: "Contruction",
    items: __megamenu.map((i) => ({
      id: ncNanoId(),
      href: "/unique_id_",
      name: i.Contruction,
    })),
  },
  {
    id: ncNanoId(),
    image:
      "https://images.pexels.com/photos/7473041/pexels-photo-7473041.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    title: "Country",
    items: __megamenu.map((i) => ({
      id: ncNanoId(),
      href: "/unique_id_",
      name: i.Country,
    })),
  },
];

const demoChildMenus: NavItemType[] = [
  {
    id: ncNanoId(),
    href: "/",
    name: "Online Booking",
  },
  {
    id: ncNanoId(),
    href: "/home-2",
    name: "Real Estate",
    isNew: true,
  },
  {
    id: ncNanoId(),
    href: "/home-3",
    name: "Home - 3",
    isNew: true,
  },
];

const otherPageChildMenus: NavItemType[] = [
  {
    id: ncNanoId(),
    href: "/blog",
    name: "Blog Page",
  },
  {
    id: ncNanoId(),
    href: "/blog-single",
    name: "Blog Single",
  },
  {
    id: ncNanoId(),
    href: "/about",
    name: "About",
  },
  {
    id: ncNanoId(),
    href: "/contact",
    name: "Contact us",
  },
  {
    id: ncNanoId(),
    href: "/login",
    name: "Login",
  },
  {
    id: ncNanoId(),
    href: "/signup",
    name: "Signup",
  },
  {
    id: ncNanoId(),
    href: "/subscription",
    name: "Subscription",
  },
];

const templatesChildrenMenus: NavItemType[] = [
  {
    id: ncNanoId(),
    href: "/add-event",
    name: "Add Listings",
    type: "dropdown",
    children: [
      {
        id: ncNanoId(),
        href: "/add-event",
        name: "Add Listings 1",
      },
      {
        id: ncNanoId(),
        href: "/add-event/2",
        name: "Add Listings 2",
      },
      {
        id: ncNanoId(),
        href: "/add-event/3",
        name: "Add Listings 3",
      },
      {
        id: ncNanoId(),
        href: "/add-event/4",
        name: "Add Listings 4",
      },
      {
        id: ncNanoId(),
        href: "/add-event/5",
        name: "Add Listings 5",
      },
      {
        id: ncNanoId(),
        href: "/add-event/6",
        name: "Add Listings 6",
      },
      {
        id: ncNanoId(),
        href: "/add-event/7",
        name: "Add Listings 7",
      },
      {
        id: ncNanoId(),
        href: "/add-event/8",
        name: "Add Listings 8",
      },
      {
        id: ncNanoId(),
        href: "/add-event/9",
        name: "Add Listings 9",
      },
      {
        id: ncNanoId(),
        href: "/add-event/10",
        name: "Add Listings 10",
      },
    ],
  },
  //
  { id: ncNanoId(), href: "/checkout", name: "Checkout" },
  { id: ncNanoId(), href: "/pay-done", name: "Pay done" },
  //
  { id: ncNanoId(), href: "/user/account", name: "Author Page" },
  { id: ncNanoId(), href: "/user/account", name: "Account Page" },
];

export const NAVIGATION_DEMO: NavItemType[] = [
  {
    id: ncNanoId(),
    href: "/",
    name: "Home",
  },
  {
    id: ncNanoId(),
    name: "Account",
    type: "dropdown",
    children: [
      {
        id: ncNanoId(),
        href: "/user/account",
        name: "My profile",
      },
      {
        id: ncNanoId(),
        href: "/user/account/bookings",
        name: "Manage Bookings",
      },
      {
        id: ncNanoId(),
        href: "/user/account/password",
        name: "Change Password",
      },
    ],
  },
  {
    id: ncNanoId(),
    name: "Organiser",
    type: "dropdown",
    children: [
      {
        id: ncNanoId(),
        href: "/organizer/add-event",
        name: "List your event",
      },
      {
        id: ncNanoId(),
        href: "/organizer/account",
        name: "Manage your account",
      },
      {
        id: ncNanoId(),
        href: "/organizer/signup",
        name: "Signup as an Organiser",
      },
      {
        id: ncNanoId(),
        href: "/organizer/scan",
        name: "Scan QR",
      },
    ],
  },
];
