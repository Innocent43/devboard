"use client";
import React, { useEffect, useState } from "react";
import JobdataCard from "@/jobcomponentfolder/jobscomponents";
import Header from "./app/components/header";
import { SearchInput } from "@/jobcomponentfolder/jobscomponents";
// import { TypefilterComponent } from "@/jobcomponentfolder/jobscomponents";
import { LocationComponent } from "@/jobcomponentfolder/jobscomponents";
import { MobileHeader } from "./app/components/header";
import { API_URL } from "./app/lib/api";
import { JobInterface } from "@/jobcomponentfolder/jobscomponents";

export interface BackendJob {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  is_open: boolean;
  created_at: string;
}

export default function Joblisting() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [jobs, setJobs] = useState<JobInterface[]>([]);
  const [loading, setLoading] = useState(true);
  // const [filterType, setFilterType] = useState<string>("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${API_URL}/jobs/`);
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data: BackendJob[] = await response.json();

        const mapped: JobInterface[] = data.map((job) => ({
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          type: "Full time",
          postedAt: new Date(job.created_at).toLocaleDateString(),
        }));
        setJobs(mapped);
      } catch (error) {
        console.error("fetch jobs error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);
  const filterData = jobs.filter((data) => {
    const matchedSearch =
      data.title
        .toLocaleLowerCase()
        .includes(searchQuery.toLocaleLowerCase()) ||
      data.company
        .toLocaleLowerCase()
        .includes(searchQuery.toLocaleLowerCase());

    const matchesLocation =
      locationFilter === "" || data.location === locationFilter;
    // const matchesType = filterType === "" || data.type === filterType;
    // matchesType;
    return matchedSearch && matchesLocation;
  });

  if (loading) {
    return <p>Loading jobs...</p>;
  }
  return (
    <section className="bg-[#EEF2FF] overflow-hidden ">
      <>
        <Header />
        <MobileHeader />
      </>

      <div className="w-full items-center mx-auto w-full flex flex-col sm:flex-row gap-4 mb-6 py-3 sm:py-6">
        <SearchInput value={searchQuery} onChange={setSearchQuery} />
        <LocationComponent
          value={locationFilter}
          onChange={setLocationFilter}
        />
        {/* <TypefilterComponent value={filterType} onChange={setFilterType} /> */}
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-17 lg:grid-cols-3">
        {filterData.length > 0 ? (
          filterData.map((data) => <JobdataCard key={data.id} data={data} />)
        ) : (
          <p className="text-center text-gray-500 col-span-2 mt-4">
            No matching job found
          </p>
        )}
      </div>
    </section>
  );
}
