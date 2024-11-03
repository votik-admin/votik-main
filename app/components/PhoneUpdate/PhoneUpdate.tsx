"use client";

import React, { useEffect, useRef, useState } from "react";
import supabase from "@app/lib/supabase";
import toast from "react-hot-toast";
import Label from "../Label/Label";
import Input from "@app/shared/Input/Input";
import ButtonPrimary from "@app/shared/Button/ButtonPrimary";

export default function PhoneUpdate({
  defaultPhone,
  className = "",
  onPhoneChange,
}: {
  defaultPhone: string;
  className?: string;
  onPhoneChange: (phone: string) => void;
}) {
  const otpTimer = useRef<NodeJS.Timeout | null>(null);
  const [otpTimerValue, setOtpTimerValue] = useState(60);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpExpired, setOtpExpired] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(defaultPhone !== "");
  const [phone, setPhone] = useState(defaultPhone);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const verifyOtp = async () => {
    const toastId = toast.loading("Verifying OTP...");
    setLoading(true);
    try {
      if (!/^\+\d{10,15}$/.test(phone)) {
        throw new Error("Invalid phone number");
      }

      const { error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: "phone_change",
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success("OTP verified successfully!", { id: toastId });
      setPhoneVerified(true);
      setOtp("");
      setOtpSent(false);
      clearInterval(otpTimer.current!);
      onPhoneChange(phone);
      setLoading(false);
    } catch (error: any) {
      toast.error(`OTP verification failed: ${error.message}`, { id: toastId });
    }
  };

  const resendOtp = async (resend: boolean = true) => {
    const toastId = toast.loading("Sending OTP...");
    setLoading(true);
    try {
      if (!/^\+91\d{10}$/.test(phone)) {
        throw new Error("Invalid phone number");
      }

      const { error } = resend
        ? await supabase.auth.resend({ phone, type: "phone_change" })
        : await supabase.auth.updateUser({ phone });

      if (error) {
        throw new Error(error.message);
      }

      otpTimer.current = setInterval(() => {
        setOtpTimerValue((prev) => {
          if (prev <= 0) {
            clearInterval(otpTimer.current!);
            setOtpExpired(true);
            setOtpSent(false);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);

      setOtpExpired(false);
      setOtpSent(true);
      setLoading(false);
      toast.success("OTP sent successfully!", { id: toastId });
    } catch (error: any) {
      toast.error(`OTP resend failed: ${error.message}`, { id: toastId });
    }
  };

  useEffect(() => {
    if (!otpSent) {
      setOtpTimerValue(60);
      clearInterval(otpTimer.current!);
    }
  }, [otpSent]);

  useEffect(() => {
    const isValidPhone = /^\+91\d{10}$/.test(phone);
    setErrors(isValidPhone ? [] : ["Invalid phone number"]);
    setPhoneVerified(phone === defaultPhone);
    setOtpSent(false);
    if (phone === defaultPhone) {
      setOtp("");
      setErrors([]);
    }
  }, [phone]);

  return (
    <div className={`${className}`}>
      <Label className="text-lg font-semibold text-gray-700 mb-1">
        Phone Number
      </Label>
      <Input
        className="mt-1.5 border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full p-2"
        value={phone}
        disabled
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+911234567890"
      />
      {errors.length > 0 && (
        <p className="text-red-500 text-sm mt-1">{errors[0]}</p>
      )}
      {phoneVerified ? (
        phone != "" ? (
          <p className="text-green-600 font-medium mt-2">Phone verified</p>
        ) : (
          ""
        )
      ) : (
        <div className="mt-4">
          <ButtonPrimary
            className={`${
              loading ||
              otpSent ||
              phoneVerified ||
              !/^\+\d{10,15}$/.test(phone)
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={() => resendOtp(false)}
            disabled={loading || otpSent || phoneVerified}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </ButtonPrimary>
          {otpSent && (
            <div className="mt-4">
              <Label className="text-sm text-gray-600">Enter OTP</Label>
              <Input
                className="mt-1.5 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md w-full p-2"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
              />
              <ButtonPrimary
                onClick={verifyOtp}
                disabled={otpExpired || loading || otp.length === 0}
              >
                Verify OTP
              </ButtonPrimary>
              <div className="text-sm text-gray-500 mt-1">
                {otpExpired
                  ? "OTP expired. Please resend OTP."
                  : `OTP expires in ${otpTimerValue}s`}
              </div>
            </div>
          )}
          {otpExpired && (
            <ButtonPrimary onClick={() => resendOtp(true)} disabled={loading}>
              Resend OTP
            </ButtonPrimary>
          )}
        </div>
      )}
    </div>
  );
}
