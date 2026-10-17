import React from "react";
import LoginForm from "@/app/components/loginform";
import Header from "@/app/components/header";
import { MobileHeader } from "@/app/components/header";

export default function page() {
  return (
    <div className="bg-[#EEF2FF] min-h-screen">
      <>
        <Header />
        <MobileHeader />
      </>
      <LoginForm />
    </div>
  );
}
