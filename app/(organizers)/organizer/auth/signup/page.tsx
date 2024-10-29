import OrganizerProvider from "@app/contexts/OrganizerContext";
import { getSessionAndOrganizer, getSessionAndUser } from "@app/lib/auth";
import PageSignUp from "@app/organizers/components/PageSignUp/PageSignUp";
import { redirect } from "next/navigation";

export default async function Login() {
  const { session, organizer, error } = await getSessionAndOrganizer();

  if (!error && organizer && session) {
    redirect("/account");
  }

  return (
    <OrganizerProvider initialSession={session} initialOrganizer={organizer}>
      <PageSignUp />
    </OrganizerProvider>
  );
}
