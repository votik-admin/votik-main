import React from "react";

interface RibbonProps {
  text?: string;
  className?: string;
}

const Ribbon: React.FC<RibbonProps> = ({ text = "Preview", className }) => {
  return (
    // <div className="relative inline-block">
    <div
      className={`absolute top-0 right-0 w-36 text-center bg-red-500 text-white font-bold py-1 rotate-45 origin-top-right shadow-md border-2 border-white ${className}`}
    >
      {text}
      {/* </div> */}
    </div>
  );
};

export default Ribbon;
