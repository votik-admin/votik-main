import supabase from "@/app/lib/supabase";

const getAllEvents = () => supabase.from("events").select("*");

export { getAllEvents };
