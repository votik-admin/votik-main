"use client";

import ButtonPrimary from "@app/shared/Button/ButtonPrimary";
import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import supabase from "@app/lib/supabase";
import { Tables } from "@app/types/database.types";

const QrCodeScanner = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);
  const [bookingDetails, setBookingDetails] = useState<
    | (Tables<"ticket_bookings"> & {
        tickets: Tables<"tickets">[];
        users: Tables<"users">;
      })
    | null
  >(null);

  const markUsed = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/qr/mark`, {
        method: "POST",
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      setScanResult(null);
      console.log(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = (result: string) => {
    console.log({ result });
    if (result && !scanResult) {
      if (!result.startsWith("VOTIK")) {
        setError("Invalid QR code");
        return;
      }
      setScanResult(result);
      videoRef.current?.pause();
      setError(null);
    }
  };

  useEffect(() => {
    if (scanResult) {
      // get the username and all
      const getBookingDetails = async (id: string) => {
        setBookingLoading(true);
        const response = await fetch(`/api/qr/${id}`, {
          method: "POST",
          body: JSON.stringify({ bookingHash: id }),
        });

        if (!response.ok) {
          setError("Failed to fetch booking details");
          return;
        }

        const data = await response.json();
        setBookingDetails(data);
        setBookingLoading(false);
      };

      getBookingDetails(scanResult);
    }
  }, [scanResult]);

  useEffect(() => {
    if (videoRef.current) {
      const qrScanner = new QrScanner(
        videoRef.current,
        (result) => handleScan(result.data),
        { preferredCamera: "environment" }
      );
      qrScanner.start().catch((err) => setError("Failed to access camera"));
      qrScannerRef.current = qrScanner;

      return () => {
        qrScanner.stop();
      };
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col p-6 rounded-lg w-11/12 max-w-md shadow-md gap-5">
        <h2 className="text-xl font-semibold text-white text-center mb-4">
          Scan Tickets
        </h2>
        <div className="rounded overflow-hidden">
          <video
            ref={videoRef}
            className="w-full rounded qr-video"
            style={{ borderRadius: "0.5rem" }}
          />
        </div>
        {scanResult ? (
          bookingLoading ? (
            <div className="text-center text-white">
              Loading booking details...
            </div>
          ) : (
            bookingDetails && (
              <div className="text-white">
                <h3 className="text-lg font-semibold">Booking Details</h3>
                <div className="flex flex-col gap-2">
                  <div>
                    <span className="font-semibold">Name:</span>{" "}
                    {bookingDetails.users.first_name}{" "}
                    {bookingDetails.users.last_name}
                  </div>
                  <div>
                    <span className="font-semibold">Email:</span>{" "}
                    {bookingDetails.users.email}
                  </div>
                  <div>
                    <span className="font-semibold">Phone:</span>{" "}
                    {bookingDetails.users.phone_number}
                  </div>
                  <div>
                    <span className="font-semibold">Tickets:</span>{" "}
                    {bookingDetails.tickets.length}
                  </div>
                  <div>
                    <span className="font-semibold">Ticket Type:</span>{" "}
                    {bookingDetails.tickets[0].name}
                  </div>
                </div>
                <ButtonPrimary
                  onClick={() => markUsed(scanResult)}
                  disabled={loading}
                >
                  Mark as used
                </ButtonPrimary>
              </div>
            )
          )
        ) : (
          <div className="text-center text-white">
            Scan a QR code to get started
          </div>
        )}
        {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      </div>
    </div>
  );
};

export default QrCodeScanner;
