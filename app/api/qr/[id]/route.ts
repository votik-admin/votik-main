import { getSessionAndUser } from "@app/lib/auth";
import { decrypt, encrypt } from "@app/lib/enc";

export async function POST(request: Request) {
  // Get the hash from the body
  const { bookingHash } = await request.json();

  // Check if the user is authorized
  const { user, error, session } = await getSessionAndUser();

  if (error || !user || !session) {
    return Response.json(
      {
        data: null,
        error: error,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  return Response.json(
    {
      data: decrypt(bookingHash),
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
  const id = (await params).id;
  console.log({ id });
  return Response.json(
    {
      data: encrypt(id),
      error: null,
      message: null,
    },
    { status: 200 }
  );
}
