import supabase from "@app/lib/supabase";

const getAllEvents = () => supabase.from("events").select("*, tickets(price)");

const getAllVenues = () => supabase.from("venues").select("*");

const getEventFromSlug = (slug: string) =>
  supabase
    .from("events")
    .select("*, organizers(*), venues(*), tickets(*)")
    .eq("slug", slug);

const getUserFromAuthTable = () => supabase.auth.getUser();
const getUserFromUserTable = (id: string) =>
  supabase.from("users").select("*").eq("id", id).single();

export {
  getAllEvents,
  getAllVenues,
  getEventFromSlug,
  getUserFromAuthTable,
  getUserFromUserTable,
};
