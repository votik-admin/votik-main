import { decrypt } from "@app/lib/enc";
import { createClient } from "@app/lib/supabase/server";
import { createServiceClient } from "@app/lib/supabase/serverAdmin";
import { checkIsAuthorized } from "@app/utils/bouncerUtils";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }

    const bouncerToken = request.cookies.get("bouncer_token")?.value;

    if (!bouncerToken) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decryptedBookingHash = decrypt(id);
    const supabaseAdmin = createServiceClient();

    const booking = await supabaseAdmin
      .from("ticket_bookings")
      .select(`*, users(*), events(*), tickets(*)`)
      .eq("id", decryptedBookingHash)
      .single();

    if (booking.error || !booking.data || booking.data.events === null) {
      return Response.json({ error: "Booking not found" }, { status: 404 });
    }

    const eventId = booking.data.events.id;

    const isAuthorized = await checkIsAuthorized(bouncerToken, eventId);

    if (!isAuthorized) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (booking.data.status === "USED") {
      return Response.json({ error: "Ticket already used" }, { status: 400 });
    }

    const updatedBooking = await supabaseAdmin
      .from("ticket_bookings")
      .update({ status: "USED" })
      .eq("id", decryptedBookingHash);

    if (updatedBooking.error) {
      return Response.json(
        { error: `Failed to mark ticket as used: ${updatedBooking.error}` },
        { status: 500 }
      );
    }

    return Response.json(updatedBooking.data, { status: 200 });
  } catch (e) {
    console.log(e);
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}
