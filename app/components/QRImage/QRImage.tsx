import React, { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import logo from "@app/images/logo.png";

export default function QRImage({
  text,
  className,
  width,
  height,
}: {
  text: string;
  className?: string;
  width?: number;
  height?: number;
}) {
  const ref = useRef(null);

  const qrCodeRef = useRef(
    new QRCodeStyling({
      width: width ?? 300,
      height: height ?? 300,
      image: logo.src,
      backgroundOptions: {
        // Transparent background
        color: "transparent",
      },
      dotsOptions: {
        color: "#c3fd07",
        type: "classy-rounded",
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 20,
      },
      shape: "circle",
      type: "svg",
    })
  );

  useEffect(() => {
    qrCodeRef.current.append(ref.current ?? undefined);
  }, []);

  useEffect(() => {
    qrCodeRef.current.update({
      data: text,
    });
  }, [text]);

  return <div className={className} ref={ref} />;
}
