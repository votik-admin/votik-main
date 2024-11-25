import { createServiceClient } from "@app/lib/supabase/serverAdmin";
import bcrypt from "bcrypt";
import { Tables } from "@app/types/database.types";
import { signToken } from "@app/utils/bouncerUtils";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

type Session = Tables<"bouncer_logins"> & {
  events: Tables<"events">;
};

export const POST = async (req: Request, res: Response) => {
  const { username, password } = await req.json();

  const supabase = createServiceClient();
  const { data: login } = await supabase
    .from("bouncer_logins")
    .select("*, events(*)")
    .eq("username", username)
    .single();

  if (!login) {
    return Response.json(
      { error: "Invalid username or password" },
      { status: 401 }
    );
  }

  if (!bcrypt.compareSync(password, login.password)) {
    return Response.json(
      { error: "Invalid username or password" },
      { status: 401 }
    );
  }

  // Set a cookie with the token as httpOnly
  const token = signToken({ username, id: login.id });

  const cookieStore = cookies();

  cookieStore.set("bouncer_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60, // 1 hour
  });

  return Response.json({ session: login, error: null }, { status: 200 });
};
