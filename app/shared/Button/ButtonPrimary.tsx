"use client";

import Button, { ButtonProps } from "@app/shared/Button/Button";
import React from "react";

export interface ButtonPrimaryProps extends ButtonProps {}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  className = "",
  ...args
}) => {
  return (
    <Button
      className={`ttnc-ButtonPrimary disabled:bg-opacity-70 disabled:cursor-not-allowed bg-primary-6000 hover:bg-primary-700 text-neutral-50 ${className}`}
      {...args}
    />
  );
};

export default ButtonPrimary;
