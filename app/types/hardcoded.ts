import { Database } from "./database.types";

const EVENTS = [
  "COMEDY",
  "MUSIC",
  "ACTIVITIES",
  "CULTURE",
  "WORKSHOPS",
  "SPORTS",
  "EXPERIENCES",
  "OTHER",
] as Database["public"]["Enums"]["EventCategory"][];

const MAP_TO_EVENT = {
  COMEDY: "Comedy",
  ACTIVITIES: "Activities",
  CULTURE: "Culture",
  MUSIC: "Music",
  WORKSHOPS: "Workshops",
  SPORTS: "Sports",
  EXPERIENCES: "Experiences",
  OTHER: "Other",
};

export { EVENTS, MAP_TO_EVENT };
