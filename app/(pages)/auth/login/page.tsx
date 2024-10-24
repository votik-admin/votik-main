import PageLogin from "@app/components/PageLogin/PageLogin";
import { createClient } from "@app/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Login() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (!error && data?.user) {
    redirect("/");
  }

  return <PageLogin />;
}
