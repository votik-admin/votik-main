"use client";

import React from "react";

interface ButtonCustomProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  loading?: boolean;
}

const ButtonCustom = ({ children, loading, ...args }: ButtonCustomProps) => {
  const _renderLoading = () => {
    return (
      <svg
        className="animate-spin -ml-1 mr-3 h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    );
  };

  const clsName = args.className || "";
  delete args.className;

  return (
    <button
      disabled={loading}
      className={`flex items-center justify-center bg-[#430D7F] text-[#C3FD07] font-semibold px-4 py-2 rounded-lg hover:shadow ${
        loading ? "opacity-75" : ""
      } ${clsName}`}
      {...args}
    >
      {loading && _renderLoading()}
      {children || "Button"}
    </button>
  );
};

export default ButtonCustom;
