import { createClient } from "@app/lib/supabase/server";
import { createServiceClient } from "@app/lib/supabase/serverAdmin";
import { Database } from "@app/types/database.types";
import crypto from "crypto";

const generatedSignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string
) => {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    throw new Error(
      "Razorpay key secret is not defined in environment variables."
    );
  }
  const sig = crypto
    .createHmac("sha256", keySecret)
    .update(razorpayOrderId + "|" + razorpayPaymentId)
    .digest("hex");
  return sig;
};

export async function POST(request: Request) {
  const body = await request.json();
  const { orderCreationId, razorpayPaymentId, razorpaySignature } = body;

  const supabaseServerClient = createClient();
  const supabaseServiceServerClient = createServiceClient();

  try {
    // can only read user's own orders
    // no auth cookies => no data
    const { data: prevOrders } = await supabaseServerClient
      .from("ticket_bookings")
      .select("*")
      .eq("razorpay_order_id", orderCreationId);

    if (prevOrders === null || prevOrders.length === 0)
      throw new Error("Order ID not found");
    for (const booking of prevOrders) {
      if (booking.status !== "INITIATED")
        throw new Error("Order ID already fulfilled");
    }

    const signature = generatedSignature(orderCreationId, razorpayPaymentId);
    if (signature !== razorpaySignature)
      throw new Error("Hash mismatch, payment verification failed");

    // decrease count of available tickets
    // only accessible via service key
    const decreaseAvailableCount = [];
    for (const booking of prevOrders) {
      decreaseAvailableCount.push(
        supabaseServiceServerClient.rpc("change_count_dynamically", {
          row_id: booking.ticket_id,
          change: booking.booked_count * -1,
        })
      );
    }
    const responses = await Promise.all(decreaseAvailableCount);
    for (const response of responses) {
      if (response.error) throw new Error(response.error.message);
    }

    // update status from INITIATED to BOOKED in ticket_bookings
    const upsertData = [];
    for (const booking of prevOrders) {
      upsertData.push({
        ...booking,
        status: "BOOKED" as Database["public"]["Enums"]["TicketStatus"],
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: signature,
        payment_successful_timestamp: new Date().toISOString(),
      });
    }

    const { data, error } = await supabaseServiceServerClient
      .from("ticket_bookings")
      .upsert(upsertData);
    if (error) throw new Error(error.message);

    return Response.json(
      { data, message: "Payment verified!", error: null },
      { status: 200 }
    );
  } catch (err: any) {
    return Response.json(
      { data: null, error: err, message: err.message },
      { status: 400 }
    );
  }
}
