import { TwMainColor } from "@app/data/types";
import { Database, Enums } from "./database.types";

const EVENTS = [
  "COMEDY",
  "MUSIC",
  "NIGHTLIFE",
  "ACTIVITIES",
  "CULTURE",
  "WORKSHOPS",
  "SPORTS",
  "EXPERIENCES",
  "OTHER",
] as Database["public"]["Enums"]["EventCategory"][];

const BANK_ACC_TYPES = [
  "CURRENT",
  "JOINT",
  "SAVINGS",
] as Enums<"BankAccType">[];

const ENUM_MAP = {
  COMEDY: { name: "Comedy", slug: "comedy", color: "blue" },
  ACTIVITIES: { name: "Activities", slug: "activities", color: "pink" },
  CULTURE: { name: "Culture", slug: "culture", color: "red" },
  MUSIC: { name: "Music", slug: "music", color: "purple" },
  WORKSHOPS: { name: "Workshops", slug: "workshops", color: "yellow" },
  SPORTS: { name: "Sports", slug: "sports", color: "green" },
  EXPERIENCES: { name: "Experiences", slug: "experiences", color: "indigo" },
  OTHER: { name: "Other", slug: "other", color: "gray" },
  NIGHTLIFE: { name: "Nightlife", slug: "nightlife", color: "yellow" },
} as Record<
  Database["public"]["Enums"]["EventCategory"],
  { name: string; slug: string; color: TwMainColor }
>;

export { EVENTS, ENUM_MAP, BANK_ACC_TYPES };
