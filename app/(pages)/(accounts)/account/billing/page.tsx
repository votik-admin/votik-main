import AccountBilling from "@app/containers/AccountPage/AccountBilling";
import AccountPage from "@app/containers/AccountPage/AccountPage";
import { createClient } from "@app/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return <AccountBilling />;
}
