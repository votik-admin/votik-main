import { createClient } from "@app/lib/supabase/server";
import { createServiceClient } from "@app/lib/supabase/serverAdmin";
import { Database } from "@app/types/database.types";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request: Request) {
  const body = await request.json();
  const { amount, currency, notes } = body;

  const supabaseServerClient = createClient();
  const supabaseServiceServerClient = createServiceClient();

  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser();
  if (!user) {
    return Response.json({
      data: null,
      error: new Error("User not found"),
      message: "User not found",
    });
  }

  const options = {
    amount, // in paise
    currency,
    receipt: `receipt#${Date.now()}`, // receipt id MAX 40 characters
    // Maximum 15 key-value pairs, 256 characters (maximum) each
    notes: { ...notes, user_id: user.id },
  };
  const { event_id, selectedTickets } = notes;
  const order = await razorpay.orders.create(options);

  // check if given qty of tickets are available
  const { data: tickets } = await supabaseServerClient
    .from("tickets")
    .select("*")
    .eq("event_id", event_id);
  if (!tickets || tickets.length === 0) {
    return Response.json({
      data: null,
      error: new Error("Tickets not found"),
      message: "Tickets not found",
    });
  }
  for (const ticket_id in selectedTickets) {
    const ticket = tickets.find((ticket) => ticket.id === Number(ticket_id));
    if (
      !ticket ||
      ticket.current_available_count < selectedTickets[ticket_id]
    ) {
      return Response.json({
        data: {
          event_id,
          ticket_id,
          current_available_count: ticket?.current_available_count,
          selected_count: selectedTickets[ticket_id],
        },
        error: new Error("Insufficient tickets available"),
        message: `Insufficient tickets available!\n ${ticket?.name} (available ${ticket?.current_available_count}, selected ${selectedTickets[ticket_id]})`,
      });
    }
  }

  const initiateBookings = [];
  for (const ticketId in selectedTickets) {
    if (selectedTickets[ticketId] > 0) {
      initiateBookings.push({
        status: "INITIATED" as Database["public"]["Enums"]["TicketStatus"],
        user_id: user.id, // *MUST* be populated from auth.uid()
        event_id,
        ticket_id: Number(ticketId),
        booked_count: selectedTickets[ticketId],
        razorpay_order_id: order.id,
        payment_initiated_timestamp: new Date().toISOString(),
      });
    }
  }
  const { data, error } = await supabaseServiceServerClient
    .from("ticket_bookings")
    .insert(initiateBookings)
    .select();

  if (error) {
    return Response.json({
      data: null,
      error: error,
      message: error.message,
    });
  }
  return Response.json({
    data: { orderId: order.id },
    error: null,
    message: null,
  });
}
