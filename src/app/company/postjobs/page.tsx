import React from "react";
import CompanyPostJobs from "@/app/components/(company)postjobs";
import Header from "@/app/components/header";
import { MobileHeader } from "@/app/components/header";

export default function page() {
  return (
    <div className="bg-[#EEF2FF] min-h-screen  ">
      <>
        <Header />
        <MobileHeader />
      </>
      <h2 className="text-center font-bold text-xl py-2">Post a New Job</h2>
      <CompanyPostJobs />
    </div>
  );
}
