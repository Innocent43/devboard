import React from "react";
import SignupRegister from "@/app/components/signupform";
import { MobileHeader } from "@/app/components/header";
import Header from "@/app/components/header";
export default function page() {
  return (
    <div className="bg-[#EEF2FF] min-h-screen">
      <>
        <MobileHeader />
        <Header />
      </>
      <SignupRegister />
    </div>
  );
}
