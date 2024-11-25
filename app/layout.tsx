import { GoogleAnalytics } from "@next/third-parties/google";
import Head from "next/head";

import { Bebas_Neue } from "next/font/google";

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  weight: "400",
});

import "react-next-dates/dist/style.css";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <Head>
        <meta name="mobile-web-app-capable" content="yes" />
      </Head>
      <body className={bebasNeue.variable}>{children}</body>
      <GoogleAnalytics gaId="G-R1RJRTNCKF" />
    </html>
  );
}
