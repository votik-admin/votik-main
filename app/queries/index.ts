import supabase from "@app/lib/supabase";
import { Database, Tables } from "@app/types/database.types";

const getAllEvents = () =>
  supabase
    .from("events")
    .select("*, tickets(price)")
    .order("created_at", { ascending: false });

const getAllVenues = () =>
  supabase.from("venues").select("*").order("created_at", { ascending: false });

const getEventFromSlug = (slug: string) =>
  supabase
    .from("events")
    .select("*, organizers(*), venues(*), tickets(*)")
    .eq("slug", slug)
    .single();

const getUserFromAuthTable = () => supabase.auth.getUser();
const getUserFromUserTable = (id: string) =>
  supabase.from("users").select("*").eq("id", id).single();

const getEventsFromCategory = (
  category: Database["public"]["Enums"]["EventCategory"]
) =>
  supabase
    .from("events")
    .select("*, tickets(price)")
    .eq("category", category)
    .order("created_at", { ascending: false });

const getCategoryFromSlug = (slug: string) =>
  supabase.from("event_categories").select("*").eq("slug", slug).single();

export {
  getAllEvents,
  getAllVenues,
  getEventFromSlug,
  getUserFromAuthTable,
  getUserFromUserTable,
  getEventsFromCategory,
  getCategoryFromSlug,
};
