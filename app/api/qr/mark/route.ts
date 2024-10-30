import { decrypt } from "@app/lib/enc";
import { createClient } from "@app/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;
    const decryptedBookingHash = decrypt(id);

    const supabase = createClient();
    const booking = await supabase
      .from("ticket_bookings")
      .update({ status: "USED" })
      .eq("hash", decryptedBookingHash)
      .single();

    return Response.json(booking, { status: 200 });
  } catch (e) {
    console.log(e);
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}
