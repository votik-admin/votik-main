import supabase from "@app/lib/supabase";

const getAllEvents = () => supabase.from("events").select("*, tickets(price)");

const getAllVenues = () => supabase.from("venues").select("*");

const getEventFromSlug = (slug: string) =>
  supabase
    .from("events")
    .select("*, organizers(*), venues(*), tickets(*)")
    .eq("slug", slug);

const changeTicketCount = (row_id: number, change: number) =>
  supabase.rpc("change_count_dynamically", { row_id, change });

export { getAllEvents, getAllVenues, getEventFromSlug, changeTicketCount };
