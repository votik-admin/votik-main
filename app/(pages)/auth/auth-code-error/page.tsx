import ButtonPrimary from "@app/shared/Button/ButtonPrimary";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-semibold mb-4">Auth code error</h1>
        <p className="text-lg text-neutral-500 dark:text-neutral-400">
          Please re-login to continue
        </p>
        <ButtonPrimary href={"/auth/login"} className="mt-6">
          Login
        </ButtonPrimary>
      </div>
    </div>
  );
}
