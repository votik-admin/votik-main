"use client";

import supabase from "@app/lib/supabase";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import Label from "../Label/Label";
import Input from "@app/shared/Input/Input";
import ButtonPrimary from "@app/shared/Button/ButtonPrimary";

export default function EmailUpdate({
  defaultEmail,
  onEmailChange,
  className = "",
}: {
  defaultEmail: string;
  onEmailChange: (email: string) => void;
  className?: string;
}) {
  const [email, setEmail] = useState(defaultEmail);
  const [emailVerified, setEmailVerified] = useState(defaultEmail !== "");
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "USER_UPDATED" && session?.user?.email) {
          console.log(session.user.email);
          if (session.user.email === email && session.user.email_confirmed_at) {
            setEmailVerified(true);
            onEmailChange(session.user.email);
          }
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [email]);

  const handleEmailChange = async () => {
    if (errors.length > 0) return;

    setLoading(true);
    const toastId = toast.loading("Sending verification email...");

    try {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) throw error;

      toast.success("Verification email sent successfully!", { id: toastId });
      setVerificationSent(true);
    } catch (error: any) {
      toast.error(`Email verification failed: ${error.message}`, {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setLoading(true);
    const toastId = toast.loading("Resending verification email...");

    try {
      const { error } = await supabase.auth.resend({
        email,
        type: "email_change",
      });
      if (error) throw error;

      toast.success("Verification email sent successfully!", { id: toastId });
    } catch (error: any) {
      toast.error(`Email verification failed: ${error.message}`, {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isValidEmail =
      email === "" || /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
    setErrors(isValidEmail ? [] : ["Invalid email address"]);
    setEmailVerified(defaultEmail !== "" && email === defaultEmail);
    setVerificationSent(false);
  }, [email, defaultEmail]);

  return (
    <div className={className}>
      <Label>Email</Label>
      <Input
        className="mt-1.5"
        value={email}
        disabled
        onChange={(e) => setEmail(e.target.value)}
      />
      {errors.length > 0 && <p className="text-red-500 text-sm">{errors[0]}</p>}
      <div className="flex items-center mt-2">
        {verificationSent && !emailVerified ? (
          <ButtonPrimary
            className="btn-primary ml-2"
            onClick={handleResendEmail}
            disabled={loading || emailVerified}
          >
            Resend verification email
          </ButtonPrimary>
        ) : (
          <ButtonPrimary
            className="btn-primary"
            onClick={handleEmailChange}
            disabled={
              loading ||
              verificationSent ||
              emailVerified ||
              errors.length > 0 ||
              email === ""
            }
          >
            {loading ? "Processing..." : "Change email"}
          </ButtonPrimary>
        )}
        {emailVerified && (
          <span className="text-green-500 ml-2">Email verified</span>
        )}
        {verificationSent && (
          <span className="text-green-500 ml-2">Verification email sent</span>
        )}
      </div>
    </div>
  );
}
