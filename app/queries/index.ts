import supabase from "@app/lib/supabase";

const getAllEvents = () => supabase.from("events").select("*, tickets(price)");

const getAllVenues = () => supabase.from("venues").select("*");

const getEventFromSlug = (slug: string) =>
  supabase
    .from("events")
    .select("*, organizers(*), venues(*), tickets(*)")
    .eq("slug", slug);

export { getAllEvents, getAllVenues, getEventFromSlug };
