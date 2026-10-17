"use client";
import React, { useEffect, useState } from "react";
// import { JobDataList } from "@/app/components/data";
import { BackendJob } from "@/joblisting";
import Header from "@/app/components/header";
import { MobileHeader } from "@/app/components/header";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { API_URL } from "@/app/lib/api";
interface PageProps {
  params: Promise<{ id: string }>;
}
export default function Page({ params }: PageProps) {
  const param = useParams();
  const id = param.id as string;
  const [job, setJob] = useState<BackendJob | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [applying, setApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${API_URL}/jobs/${id}`);
        if (response.status === 404) {
          setJob(null);
          return;
        }
        if (!response.ok) {
          throw new Error("Failed to fetch job");
        }
        const data: BackendJob = await response.json();
        setJob(data);
      } catch (error) {
        console.error("Fetch job error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [id]);

  const handleApply = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setApplyMessage("please log in as a job seeker to apply");
      return;
    }
    setApplying(true);
    setApplyMessage(null);

    try {
      const response = await fetch(`${API_URL}/applications/`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ job_id: Number(id) }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to apply");
      }

      setApplyMessage("Application submitted successfully");
    } catch (error) {
      if (error instanceof Error) {
        setApplyMessage(error.message);
      }
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <p>Loading job...</p>;
  }
  if (!job) {
    return notFound();
  }
  return (
    <section className="bg-[#EEF2FF] min-h-screen overflow-hidden">
      <>
        <Header />
        <MobileHeader />
      </>
      <div className="bg-inherit  mx-auto w-full max-w-md h-[160px]  p-4 text-center">
        <h2 className="text-xl font-bold">{job.title}</h2>
        <div className="flex items-center justify-center gap-2 sm:gap-4 mt-2 text-sm text-gray-500">
          <span>{job.company}</span>
          <span>{job.location}</span>
          {/* <span>{data.type}</span> */}
          <span className="truncate">
            {new Date(job.created_at).toLocaleDateString()}
          </span>
        </div>

        {/* <h3 className="text-gray-600 font-medium">{data.company}</h3> */}
        <button
          onClick={handleApply}
          disabled={applying || !job.is_open}
          className="bg-[#2563EB] text-white rounded-lg px-10 py-2 mt-3"
        >
          {applying ? "Applying..." : job.is_open ? "Apply Now" : "Closed"}
        </button>

        {applyMessage && (
          <p className="mt-2 text-sm text-gray-700">{applyMessage}</p>
        )}
        <h3 className="font-bold text-lg my-4">{job.description}</h3>
      </div>
    </section>
  );
}
