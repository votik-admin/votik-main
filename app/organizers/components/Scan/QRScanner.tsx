"use client";

import ButtonPrimary from "@app/shared/Button/ButtonPrimary";
import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { Tables } from "@app/types/database.types";
import toast from "react-hot-toast";
import ButtonSecondary from "@app/shared/Button/ButtonSecondary";

const QrCodeScanner = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);
  const [bookingDetails, setBookingDetails] = useState<
    | (Tables<"ticket_bookings"> & {
        tickets: Tables<"tickets">;
        users: Tables<"users">;
        events: Tables<"events">;
      })
    | null
  >(null);

  const markUsed = async (id: string) => {
    setLoading(true);
    const toastId = toast.loading("Marking ticket as used...");
    try {
      const res = await fetch(`/api/qr/mark`, {
        method: "POST",
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        throw new Error((await res.json()).error);
      }

      await res.json();

      setScanResult(null);
      setBookingDetails(null);
      toast.success("Ticket marked as used", { id: toastId });
      videoRef.current?.play();
    } catch (err: any) {
      toast.error(`Failed to mark ticket as used: ${err.message}`, {
        id: toastId,
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = (result: string) => {
    setError(null);
    setBookingDetails(null);
    setBookingLoading(false);
    setScanResult(null);
    console.log("result", result);
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
        const toastId = toast.loading("Loading booking details...");
        setBookingLoading(true);
        const response = await fetch(`/api/qr/${id}`, {
          method: "POST",
          body: JSON.stringify({ bookingHash: id }),
        });

        if (!response.ok) {
          setError("Failed to fetch booking details");
          setBookingLoading(false);
          videoRef.current?.play();
          setScanResult(null);
          toast.error("Failed to fetch booking details", { id: toastId });
          return;
        }

        const data = await response.json();
        setBookingDetails(data.data);
        setBookingLoading(false);
        toast.success("Booking details loaded", { id: toastId });
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
    <div className="flex flex-col p-6 rounded-lg w-11/12 gap-5 m-auto">
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
                  {bookingDetails.booked_count}
                </div>
                <div>
                  <span className="font-semibold">Ticket Type:</span>{" "}
                  {bookingDetails.tickets.name}
                </div>
              </div>
              <div className="flex gap-4 mt-4">
                <ButtonPrimary
                  onClick={() => markUsed(scanResult)}
                  loading={loading}
                  disabled={loading}
                >
                  Mark as used
                </ButtonPrimary>
                <ButtonSecondary
                  onClick={() => {
                    setScanResult(null);
                    setBookingDetails(null);
                    videoRef.current?.play();
                  }}
                  disabled={loading}
                  loading={loading}
                >
                  Cancel
                </ButtonSecondary>
              </div>
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
  );
};

export default QrCodeScanner;
