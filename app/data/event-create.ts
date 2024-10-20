const EventTypes = {
  City: ["MUMBAI", "LUCKNOW", "DELHI", "OTHER"] as const,
  EventCategory: [
    "ACTIVITIES",
    "COMEDY",
    "CULTURE",
    "MUSIC",
    "WORKSHOPS",
    "SPORTS",
    "EXPERIENCES",
    "OTHER",
  ] as const,
  Gender: [
    "MALE",
    "FEMALE",
    "NON_BINARY",
    "GENDERQUEER",
    "GENDERFLUID",
    "AGENDER",
    "BIGENDER",
    "TWO_SPIRIT",
    "TRANSGENDER_MALE",
    "TRANSGENDER_FEMALE",
    "CISGENDER_MALE",
    "CISGENDER_FEMALE",
    "OTHER",
    "UNSPECIFIED",
    "PREFER_NOT_TO_SAY",
  ] as const,
  IdentityStatus: ["VERIFIED", "PENDING", "REJECTED"] as const,
  IdentityType: ["PAN", "GSTIN"] as const,
  TicketStatus: ["BOOKED", "AVAILABLE"] as const,
};

export const CityLatLngMap: {
  [city in (typeof EventTypes)["City"][number]]: [number, number];
} = {
  MUMBAI: [19.076, 72.8777],
  LUCKNOW: [26.8467, 80.9462],
  DELHI: [28.6139, 77.209],
  OTHER: [0, 0],
};

export default EventTypes;
