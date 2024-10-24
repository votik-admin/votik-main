import supabase from "@app/lib/supabase";
import { Json } from "@app/types/database.types";

const getAllEvents = () => supabase.from("events").select("*, tickets(price)");

const getAllVenues = () => supabase.from("venues").select("*");

const getEventFromSlug = (slug: string) =>
  supabase
    .from("events")
    .select("*, organizers(*), venues(*), tickets(*)")
    .eq("slug", slug);

const changeTicketCount = (row_id: number, change: number) =>
  supabase.rpc("change_count_dynamically", { row_id, change });

const storeBookedTicket = (
  user_id: string,
  event_id: string,
  ticket_id: number,
  booked_count: number,
  metadata?: Json
) =>
  supabase.from("ticket_bookings").insert([
    {
      status: "BOOKED",
      user_id,
      event_id,
      ticket_id,
      booked_count,
      metadata,
    },
  ]);

export {
  getAllEvents,
  getAllVenues,
  getEventFromSlug,
  changeTicketCount,
  storeBookedTicket,
};
