import supabase from "@app/lib/supabase";
import { Database, Tables, TablesInsert } from "@app/types/database.types";

const getAllEvents = () =>
  supabase
    .from("events")
    .select("*, tickets(price)")
    .order("created_at", { ascending: false });

const createEvent = (values: TablesInsert<"events">) =>
  supabase.from("events").insert(values).select();

const addTickets = (values: TablesInsert<"tickets">[]) =>
  supabase.from("tickets").insert(values).select();

const deleteEvent = (id: string) =>
  supabase.from("events").delete().eq("id", id);

const deleteEvents = (ids: string[]) =>
  supabase.from("events").delete().in("id", ids);

const getAllVenues = () =>
  supabase.from("venues").select("*").order("created_at", { ascending: false });

const getEventFromSlug = (slug: string) =>
  supabase
    .from("events")
    .select("*, organizers(*), venues(*), tickets(*)")
    .eq("slug", slug)
    .single();

const getEventFromId = (id: string) =>
  supabase
    .from("events")
    .select("*, organizers(*), venues(*), tickets(*)")
    .eq("id", id)
    .single();

const getBouncersForEvent = (eventId: string) =>
  supabase
    .from("bouncer_logins")
    .select("*, events(*)")
    .eq("event_id", eventId);

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

const search = (tableName: "events" | "venues", query: string) =>
  supabase
    .from(tableName)
    .select("name, slug")
    .textSearch("search_vector", query.split(" ").filter(Boolean).join(" | "));

const getAllEventsByOrganizer = (organizer_id: string) =>
  supabase
    .from("events")
    .select("*, tickets(*)")
    .eq("organizer_id", organizer_id)
    .order("created_at", { ascending: false });

export {
  getAllEvents,
  getAllVenues,
  getEventFromSlug,
  getEventFromId,
  getUserFromAuthTable,
  getUserFromUserTable,
  getEventsFromCategory,
  getCategoryFromSlug,
  search,

  // Organiser
  getAllEventsByOrganizer,
  getBouncersForEvent,

  // POST
  createEvent,
  addTickets,
  deleteEvent,
  deleteEvents,
};
