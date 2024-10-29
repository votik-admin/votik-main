import OrganizerProvider from "@app/contexts/OrganizerContext";
import { getSessionAndOrganizer, getSessionAndUser } from "@app/lib/auth";
import PageLogin from "@app/organizers/components/PageLogin/PageLogin";
import { redirect } from "next/navigation";

export default async function Login() {
  const { session, organizer, error } = await getSessionAndOrganizer();

  if (!error && organizer && session) {
    redirect("/organizer/account");
  }

  return (
    <OrganizerProvider initialSession={session} initialOrganizer={organizer}>
      <PageLogin />
    </OrganizerProvider>
  );
}
