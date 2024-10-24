import { Database } from "@app/types/database.types";
import { createClient } from "@supabase/supabase-js";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const supabaseAdmin = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export async function POST(request: Request) {
  const body = await request.json();
  const { amount, currency, notes } = body;

  const options = {
    amount, // in paise
    currency,
    receipt: `receipt#${Date.now()}`, // receipt id MAX 40 characters
    // Maximum 15 key-value pairs, 256 characters (maximum) each
    notes,
  };
  const { user_id, event_id, selectedTickets } = notes;
  const order = await razorpay.orders.create(options);
  console.log(order);

  const initiateBookings = [];
  for (const ticketId in selectedTickets) {
    if (selectedTickets[ticketId] > 0) {
      initiateBookings.push(
        supabaseAdmin.from("ticket_bookings").insert({
          status: "INITIATED",
          // user_id, // *MUST* be populated from auth.uid()
          event_id,
          ticket_id: Number(ticketId),
          booked_count: selectedTickets[ticketId],
          razorpay_order_id: order.id,
          payment_initiated_timestamp: new Date().toISOString(),
        })
      );
    }
  }
  const responses = await Promise.all(initiateBookings);
  console.log(responses);
  for (const response of responses) {
    const { data, error } = response;
    // if any of the response fails, reject the request
    if (error) {
      return Response.json({
        data: null,
        error: error,
        message: error.message,
      });
    }
  }
  return Response.json({
    data: { orderId: order.id },
    error: null,
    message: null,
  });
}
