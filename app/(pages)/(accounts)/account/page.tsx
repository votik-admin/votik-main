import AccountPage from "@app/containers/AccountPage/AccountPage";
import { createClient } from "@app/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const supabase = createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData?.user) {
    redirect("/auth/login");
  }

  // Fetch the user details
  const { data, error } = await supabase
    .from("users") // Table name
    .select("*") // Select all columns (or specify specific columns)
    .eq("id", authData.user.id); // Use 'eq' to filter by primary key value

  if (error || !data?.[0]) {
    redirect("/auth/login");
  }

  return <AccountPage user={data[0]} />;
}
