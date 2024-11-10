import { getSessionAndOrganizer, getSessionAndUser } from "@app/lib/auth";
import { decrypt, encrypt } from "@app/lib/enc";
import { createClient } from "@app/lib/supabase/server";
import { createServiceClient } from "@app/lib/supabase/serverAdmin";
import { checkIsAuthorized } from "@app/utils/bouncerUtils";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  // Get the hash from the body
  const { bookingHash } = await request.json();

  if (!bookingHash) {
    return Response.json(
      {
        data: null,
        error: "Invalid request",
        message: null,
      },
      { status: 400 }
    );
  }
  // Get the token from the request
  const bouncerToken = request.cookies.get("bouncer_token")?.value;

  if (!bouncerToken) {
    return Response.json(
      {
        data: null,
        error: "Unauthorized",
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const supabaseAdmin = createServiceClient();

  // Get the booking details
  const bookingId = decrypt(bookingHash);
  console.log("bookingHash", bookingHash);
  console.log("bookingId", bookingId);
  const { data, error } = await supabaseAdmin
    .from("ticket_bookings")
    .select(`*, users(*), events(*), tickets(*)`)
    .eq("id", bookingId)
    .single();

  if (error || !data) {
    return Response.json(
      {
        data: null,
        error: error?.message || "Data not found",
        message: null,
      },
      { status: 404 }
    );
  }

  const eventId = data.events?.id;

  if (!eventId) {
    return Response.json(
      {
        data: null,
        error: "Event not found",
        message: null,
      },
      { status: 404 }
    );
  }

  if (!(await checkIsAuthorized(bouncerToken, eventId))) {
    return Response.json(
      {
        data: null,
        error: "Unauthorized",
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  return Response.json(
    {
      data: data,
      error: null,
      message: null,
    },
    { status: 200 }
  );
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const idInt = parseInt(id);

    return Response.json(
      {
        data: encrypt(idInt),
        error: null,
        message: null,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        data: null,
        // @ts-expect-error - error is not a string
        error: error.message,
        message: null,
      },
      { status: 500 }
    );
  }
}
