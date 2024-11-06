import OrganizerProvider from "@app/contexts/OrganizerContext";
import { getSessionAndOrganizer } from "@app/lib/auth";
import AccountPage from "@app/organizers/components/AccountPage/AccountPage";
import { sanitizeRedirect } from "@app/utils/sanitizeRedirectUrl";
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
    <OrganizerProvider
      initialOrganizer={organizer}
      initialSession={session}
      onLogoutBlock={true}
    >
      <AccountPage />
    </OrganizerProvider>
  );
}
