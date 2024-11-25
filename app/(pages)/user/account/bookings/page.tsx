import AccountBookings from "@app/containers/AccountPage/AccountBookings";
import { getSessionAndUser } from "@app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { session, user, error } = await getSessionAndUser();

  if (error || !user) {
    const headersList = headers();
    const header_url = headersList.get("x-url") || "";
    const path = new URL(header_url).pathname;
    redirect(`/auth/login?redirect=${path}`);
  }

  return <AccountBookings />;
}
