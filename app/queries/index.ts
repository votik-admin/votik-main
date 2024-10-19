import supabase from "@/app/lib/supabase";

const getAllEvents = () => supabase.from("events").select("*");

const getAllVenues = () => supabase.from("venues").select("*");

export { getAllEvents, getAllVenues };
