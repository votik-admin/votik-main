import Script from "next/script";
import React from "react";

const Layout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      {children}
    </div>
  );
};

export default Layout;
