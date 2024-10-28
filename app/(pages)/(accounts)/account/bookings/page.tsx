import Ticket from "@app/components/Ticket/MobileTicket";
import AccountBookings from "@app/containers/AccountPage/AccountBookings";
import { getSessionAndUser } from "@app/lib/auth";
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
    redirect("/auth/login");
  }

  return <AccountBookings />;
}
