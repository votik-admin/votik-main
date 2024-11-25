import OrganizerProvider from "@app/contexts/OrganizerContext";
import { getSessionAndOrganizer } from "@app/lib/auth";
import AccountPass from "@app/organizers/components/AccountPage/AccountPass";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const { session, organizer, error } = await getSessionAndOrganizer();

  if (!session || !organizer || error) {
    const headersList = headers();
    const header_url = headersList.get("x-url") || "";
    const path = new URL(header_url).pathname;
    redirect(`/auth/login?redirect=${path}`);
  }

  return (
    <OrganizerProvider initialOrganizer={organizer} initialSession={session}>
      <AccountPass />
    </OrganizerProvider>
  );
}
