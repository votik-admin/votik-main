"use client";

import supabase from "@app/lib/supabase";
import ButtonPrimary from "@app/shared/Button/ButtonPrimary";
import { Tables } from "@app/types/database.types";
import mergeStrings from "@app/utils/mergeStrings";
import { sanitizeRedirect } from "@app/utils/sanitizeRedirectUrl";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function UserSignupOrganizer({
  initialUser: user,
}: {
  initialUser: Tables<"users">;
}) {
  const router = useRouter();

  const searchParams = useSearchParams();
  const redirectUrl = sanitizeRedirect(
    searchParams.get("redirectUrl") ?? "/organizer/account"
  );

  const handleSignup = async () => {
    const toastId = toast.loading("Signing up as organizer...");
    try {
      const { data, error } = await supabase
        .from("organizers")
        .insert({
          id: user.id,
          email: user.email,
          name: mergeStrings([user.first_name, user.last_name]),
          phone_number: user.phone_number,
          addr: user.address_1,
          avatar_url: user.avatar_url,
          state: user.state,
        })
        .select("*");

      const { data: userData, error: userError } = await supabase
        .from("users")
        .update({ is_organizer: true })
        .eq("id", user.id)
        .single();

      if (error || userError) {
        throw new Error(
          error?.message ?? userError?.message ?? "Unknown error"
        );
      }

      toast.success("Signed up as organizer", { id: toastId });

      router.push(redirectUrl);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Failed to sign up as organizer: ${error.message}`, {
          id: toastId,
        });
      } else {
        toast.error(`Failed to sign up as organizer`, {
          id: toastId,
        });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-neutral-900">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">
            Sign up
          </h2>
          <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
            You are already signed up as a user. Would you like to sign up as an
            organizer?
          </p>
          <ButtonPrimary className="mt-6" onClick={handleSignup}>
            Sign up as organizer
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
}
