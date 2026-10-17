"use client";
import React, { useEffect, useState } from "react";
import { MobileHeader } from "@/app/components/header";
import Header from "@/app/components/header";
import Link from "next/link";
import { formatPostedAgo } from "../lib/format";
import { useRouter } from "next/navigation";
import { API_URL, extractErrorMessage } from "../lib/api";
import { useRequireRole } from "../lib/use-require-role";

interface MyJob {
  id: number;
  title: string;
  created_at: string;
  applicant_count: number;
}

export default function CompanyDashboardFile() {
  const router = useRouter();
  const { ready } = useRequireRole("employer");

  const [jobs, setJobs] = useState<MyJob[]>([]);
  const [jobsLoading, setJobLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;

    const fetchMyJobs = async () => {
      const token = localStorage.getItem("access_token") ?? "";
      try {
        const response = await fetch(`${API_URL}/jobs/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            extractErrorMessage(errorData, "Failed to load your jobs"),
          );
        }

        const data: MyJob[] = await response.json();
        setJobs(data);
      } catch (error) {
        if (error instanceof Error) setPageError(error.message);
      } finally {
        setJobLoading(false);
      }
    };

    fetchMyJobs();
  }, [ready]);

  const handleDelete = async (job: MyJob) => {
    const confirmed = window.confirm(
      `Delete "${job.title}"? Its ${job.applicant_count} application(s) will be deleted too`,
    );

    if (!confirmed) return;

    setPageError(null);
    const token = localStorage.getItem("access_token") ?? "";

    try {
      const response = await fetch(`${API_URL}/jobs/${job.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(extractErrorMessage(errorData, "Failed to delete job"));
      }

      setJobs((prev) => prev?.filter((item) => item.id !== job.id));
    } catch (error) {
      if (error instanceof Error) setPageError(error.message);
    }
  };

  if (!ready || jobsLoading) {
    return <p className="p-4">Loading...</p>;
  }

  return (
    <main className="bg-[#EEF2FF] min-h-screen">
      <>
        <MobileHeader />
        <Header />
      </>
      <div className="flex justify-between flex-col sm:flex-row gap-4 items-center max-w-4xl mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold">My Job Posting</h1>
        <Link
          href="/company/postjobs"
          className="bg-[#2563EB] text-white rounded-lg px-6 py-2 font-bold"
        >
          {" "}
          + Post New Job
        </Link>
      </div>
      {pageError && (
        <p className="text-red-500 text-sm text-center mt-4">{pageError}</p>
      )}
      {jobs?.length === 0 ? (
        <div className="text-center text-blue-600 font-[24px] mt-6">
          No post yet
        </div>
      ) : (
        <section className="flex flex-col gap-4 max-w-4xl mx-auto mt-8 px-4">
          {jobs?.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col  sm:flex-row justify-between sm:items-center "
            >
              <div className="w-ful min-w-0">
                <h2 className="font-bold truncate block max-w-30">
                  {job.title}
                </h2>
                <p className="text-sm">
                  Posted {formatPostedAgo(job.created_at)}
                </p>
              </div>
              <p className="font-bold shrink-0">
                Applicants {job.applicant_count}
              </p>
              <div className="flex gap-2 mt-2 sm:mt-0 flex-col items-start sm:items-center sm:flex-row text-left align-left items-left sm:gap-8">
                <Link
                  href={`/dashboard/company/${job.id}/applicants`}
                  className="text-[#2563EB] font-bold text-sm text-left"
                >
                  View Application
                </Link>

                <Link
                  href={`/company/${job.id}/edit`}
                  className="text-gray-500 text-sm text-left"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(job)}
                  className="text-red-500 text-sm text-left"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
