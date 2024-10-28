"use client";

import React, { useRef } from "react";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

const ConfettiBoom = () => {
  const { width, height } = useWindowSize();
  const confettiRef1 = useRef<HTMLCanvasElement>(null);
  const confettiRef2 = useRef<HTMLCanvasElement>(null);

  const numberOfPieces = width > 768 ? 400 : 200;
  const speedX = width > 768 ? 20 : 4;
  const speedY = width > 768 ? 20 : 15;

  return (
    <div className="fixed inset-0">
      <Confetti
        ref={confettiRef1}
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={numberOfPieces}
        confettiSource={{
          x: 0,
          y: height,
          w: 0,
          h: 0,
        }}
        initialVelocityX={speedX}
        initialVelocityY={speedY}
      />
      <Confetti
        ref={confettiRef2}
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={numberOfPieces}
        confettiSource={{
          x: width,
          y: height,
          w: 0,
          h: 0,
        }}
        initialVelocityX={-speedX}
        initialVelocityY={speedY}
      />
    </div>
  );
};

export default ConfettiBoom;
