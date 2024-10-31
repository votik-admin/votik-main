import ButtonPrimary from "@app/shared/Button/ButtonPrimary";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-10">
      <h1 className="text-3xl font-semibold text-center">
        Please complete your profile first
      </h1>
      <ButtonPrimary href="/organizer/account">Complete Profile</ButtonPrimary>
    </div>
  );
}
