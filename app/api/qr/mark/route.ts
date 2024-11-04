import { decrypt } from "@app/lib/enc";
import { createServiceClient } from "@app/lib/supabase/serverAdmin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;
    const decryptedBookingHash = decrypt(id);

    const supabase = createServiceClient();
    const booking = await supabase
      .from("ticket_bookings")
      .update({ status: "USED" })
      .eq("id", decryptedBookingHash)
      .eq("status", "CONFIRMED")
      .select("*, users(*), events(*), tickets(*)")
      .single();

    return Response.json(booking, { status: 200 });
  } catch (e) {
    console.log(e);
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}
