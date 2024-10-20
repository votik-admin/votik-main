"use client";

import React from "react";

const ButtonCustom = ({ children }: { children?: React.ReactNode }) => {
  return (
    <button className="bg-[#430D7F] text-[#C3FD07] font-semibold px-4 py-2 rounded-lg hover:shadow">
      {children || "Button"}
    </button>
  );
};

export default ButtonCustom;
