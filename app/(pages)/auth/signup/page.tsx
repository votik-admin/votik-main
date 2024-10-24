import PageSignUp from "@app/components/PageSignUp/PageSignUp";
import { getUser } from "@app/lib/auth";
import { createClient } from "@app/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Login() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (!error && data?.user) {
    redirect("/");
  }

  return <PageSignUp />;
}
