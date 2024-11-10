import { createClient } from "@app/lib/supabase/server";
import { createServiceClient } from "@app/lib/supabase/serverAdmin";
import bcrypt from "bcrypt";

export const POST = async (req: Request, res: Response) => {
  const { username, password, eventId } = await req.json();

  const supabase = createClient();
  const supabaseAdmin = createServiceClient();

  const { data: user, error: e } = await supabase.auth.getUser();

  if (e || !user) {
    return Response.json({ error: "Not logged in" }, { status: 401 });
  }

  const event = await supabaseAdmin
    .from("events")
    .select("*")
    .eq("id", eventId)
    .eq("organizer_id", user.user.id)
    .single();

  if (!event) {
    return Response.json({ error: "Event not found" }, { status: 404 });
  }

  const { data: login } = await supabase
    .from("bouncer_logins")
    .select("*, events(*)")
    .eq("username", username)
    .single();

  if (login) {
    // Return that the username is already taken
    return Response.json({ error: "Username already taken" }, { status: 400 });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const { data: newLogin, error } = await supabaseAdmin
    .from("bouncer_logins")
    .insert([{ username, password: hashedPassword, event_id: eventId }])
    .single();

  if (error || !newLogin) {
    return Response.json(
      { error: "Failed to create bouncer" },
      { status: 500 }
    );
  }

  return Response.json({ session: newLogin, error: null }, { status: 200 });
};
