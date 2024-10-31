import ButtonPrimary from "@app/shared/Button/ButtonPrimary";

// Error page to show when an error occurs in any of the organizer pages
export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-10">
      <h1 className="text-3xl font-semibold text-center">An error occurred</h1>
      <p className="text-center">Please try again later</p>
      <ButtonPrimary href="/organizer">Go back to dashboard</ButtonPrimary>
    </div>
  );
}
