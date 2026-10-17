"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function GetStartedButton(): React.JSX.Element {
  return (
    <Link href="/auth/signup">
      <button className="bg-[#2563EB] text-white rounded-lg px-10 py-2">
        Get Started
      </button>
    </Link>
  );
}

export const SignUpButton = () => {
  return (
    <Link href="/auth/signup">
      <button className="bg-[#2563EB] text-white rounded-lg px-10 py-2">
        Sign Up
      </button>
    </Link>
  );
};
