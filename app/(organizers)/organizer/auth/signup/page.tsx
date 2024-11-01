import OrganizerProvider from "@app/contexts/OrganizerContext";
import { getSessionAndOrganizer, getSessionAndUser } from "@app/lib/auth";
import PageSignUp from "@app/organizers/components/PageSignUp/PageSignUp";
import UserSignupOrganizer from "@app/organizers/components/UserSignupOrganizer/UserSignupOrganizer";
import { redirect } from "next/navigation";

export default async function Login() {
  const { session, organizer, error } = await getSessionAndOrganizer();
  const {
    session: userSession,
    user,
    error: userError,
  } = await getSessionAndUser();

  if (!error && organizer && session) {
    redirect("/organizer/account");
  }

  if (!userError && user && userSession) {
    // This is a user but not an organizer
    // Signup the user as an organizer

    return <UserSignupOrganizer initialUser={user} />;
  }

  return (
    <OrganizerProvider initialSession={session} initialOrganizer={organizer}>
      <PageSignUp />
    </OrganizerProvider>
  );
}
