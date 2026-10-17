import React from "react";
import GetStartedButton from "./components/buttons";
// import { dummyJobs } from "./components/data";
import Header from "./components/header";
import { Job } from "./components/data";
import { MobileHeader } from "./components/header";
import { API_URL } from "./lib/api";

export default async function HomePage() {
  const result = await fetch(`${API_URL}/jobs/`);
  if (!result.ok) {
    throw new Error("failed to fetch");
  }
  const dummyJobs = await result.json();

  return (
    <main className="bg-[#EEF2FF] min-h-screen">
      <Header />
      <MobileHeader />
      <div className="w-full text-center mt-2">
        <h1 className="text-4xl md:text-[64px]">
          Find your next job, or your next hire.
        </h1>
        <p className="text-lg sm:text-xl md:text-[40px] mt-5">
          Browse listings or post a job in minutes.
        </p>
      </div>
      <div className="text-center mt-5 ">
        <GetStartedButton />
        <h2 className="mt-5">Featured Jobs</h2>
      </div>
      <section className="flex text-center gap-4 flex-col sm:flex-wrap  p-4  sm:grid sm:grid-cols-3">
        {dummyJobs.map((data: Job) => (
          <div
            key={data.id}
            className="bg-white w-full shadow-lg p-4 rounded-lg h-[160px]"
          >
            <h2>{data.title}</h2>
            <h3>{data.company}</h3>
            <p>{data.location}</p>
            <p>{data.type}</p>
            {/* <p>{data.postedAt}</p> */}
          </div>
        ))}
      </section>
      <footer className="w-full p-4">
        <p>© 2026 JobBoard. All rights reserved.</p>
      </footer>
    </main>
  );
}
