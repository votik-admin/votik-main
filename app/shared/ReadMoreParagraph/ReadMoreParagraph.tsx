"use client";

import React, { useState } from "react";

const ReadMoreParagraph = ({ children }: { children?: React.ReactNode }) => {
  const MAX_WORDS = 25;
  const [readMoreToggled, setReadMoreToggled] = useState(false);

  if (!children) return null;
  const content = children.toString();

  return (
    <div className="text-neutral-6000 dark:text-neutral-300">
      {content.split(" ").length > MAX_WORDS ? (
        <p>
          {readMoreToggled
            ? content + " "
            : content.split(" ").slice(0, MAX_WORDS).join(" ") + "... "}
          <button
            className="text-[#430D7F] dark:text-white font-semibold"
            onClick={() => setReadMoreToggled(!readMoreToggled)}
          >
            {readMoreToggled ? "Read less" : "Read more"}
          </button>
        </p>
      ) : (
        content
      )}
    </div>
  );
};

export default ReadMoreParagraph;
