import { getSessionAndOrganizer, getSessionAndUser } from "@app/lib/auth";
import { decrypt, encrypt } from "@app/lib/enc";
import { createClient } from "@app/lib/supabase/server";
import { createServiceClient } from "@app/lib/supabase/serverAdmin";

export async function POST(request: Request) {
  // Get the hash from the body
  const { bookingHash } = await request.json();

  const supabase = createClient();
  const supabaseAdmin = createServiceClient();

  const { data: user, error: e } = await supabase.auth.getUser();

  if (e || !user) {
    return Response.json(
      {
        data: null,
        error: e,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  // Get the booking details
  const bookingId = decrypt(bookingHash);
  const { data, error } = await supabaseAdmin
    .from("ticket_bookings")
    .select(`*`)
    .eq("id", bookingId);

  console.log(data);

  if (error || !data || data.length === 0) {
    return Response.json(
      {
        data: null,
        error: error?.message || "Data not found",
        message: null,
      },
      { status: 404 }
    );
  }

  return Response.json(
    {
      data: data[0],
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
