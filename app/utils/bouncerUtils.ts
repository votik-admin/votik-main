import { createServiceClient } from "@app/lib/supabase/serverAdmin";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "secret";

export function signToken(user: { username: string; id: number }) {
  return jwt.sign(user, JWT_SECRET, {
    expiresIn: "1h",
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

export function decodeToken(token: string) {
  return jwt.decode(token);
}

export async function checkIsAuthorized(token: string, eventId: string) {
  const decoded = decodeToken(token) as { id: number };
  const supabase = createServiceClient();

  const bouncer = await supabase
    .from("bouncer_logins")
    .select("*, events(*)")
    .eq("id", decoded.id)
    .single();

  if (bouncer.error || !bouncer.data) {
    return false;
  }

  if (!bouncer.data.events || bouncer.data.events.id !== eventId) {
    return false;
  }

  return true;
}
