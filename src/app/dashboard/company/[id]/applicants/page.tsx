"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header, { MobileHeader } from "@/app/components/header";
import { useRequireRole } from "@/app/lib/use-require-role";
import { formatPostedAgo } from "@/app/lib/format";

import { API_URL, authHeader, extractErrorMessage } from "@/app/lib/api";

type ApplicationStatus = "pending" | "accepted" | "rejected";

interface Applicants {
  id: number;
  status: ApplicationStatus;
  created_at: string;
  applicant: { id: number; name: string; email: string };
}

interface JobSummary {
  id: number;
  title: string;
}

const statusStyles: Record<ApplicationStatus, string> = {
  pending: "bg-[#FEF3C7] text-[#92400E]",
  accepted: "bg-[#D1FAE5] text-[#065F46]",
  rejected: "bg-[#FEE2E2] text-[#991B1B]",
};

export default function ApplicantPage() {
  const params = useParams();
  const jobId = params.id as string;
  const { ready } = useRequireRole("employer");

  const [job, setJob] = useState<JobSummary | null>(null);
  const [applicants, setApplicants] = useState<Applicants[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;

    const loadPage = async () => {
      const token = localStorage.getItem("access_token") ?? "";

      try {
        const [jobResponse, applicantsResponse] = await Promise.all([
          fetch(`${API_URL}/jobs/${jobId}`),
          fetch(`${API_URL}/jobs/${jobId}/applications`, {
            headers: authHeader(token),
          }),
        ]);

        if (!applicantsResponse.ok) {
          const errorData = await applicantsResponse.json();
          throw new Error(
            extractErrorMessage(errorData, "Failed to load applicants"),
          );
        }

        if (jobResponse.ok) {
          setJob(await jobResponse.json());
        }

        setApplicants(await applicantsResponse.json());
      } catch (error) {
        if (error instanceof Error) setPageError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [ready, jobId]);

  const updateStatus = async (
    applicationId: number,
    status: ApplicationStatus,
  ) => {
    setPageError(null);
    const token = localStorage.getItem("access_token") ?? "";

    try {
      const response = await fetch(`${API_URL}/applications/${applicationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(token),
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          extractErrorMessage(errorData, "Failed to upload status"),
        );
      }

      setApplicants((prev) =>
        prev.map((item) =>
          item.id === applicationId ? { ...item, status } : item,
        ),
      );
    } catch (error) {
      if (error instanceof Error) setPageError(error.message);
    }
  };

  if (!ready || loading) {
    return <p className="p-4">Loading...</p>;
  }

  return (
    <main>
      <>
        <MobileHeader />
        <Header />
      </>

      <div className="max-w-4xl mx-auto mt-8 px-4">
        <Link
          href="/dashboard/company"
          className="text-[#2563EB] text-sm font-bold"
        >
          {" "}
          ⬅ Back to my postings
        </Link>

        <h1>Applicants for {job?.title ?? "this job"}</h1>
      </div>
      {pageError && (
        <p className="text-red-500 text-center mt-4">{pageError}</p>
      )}
      {applicants.length === 0 && !pageError ? (
        <p className="text-center text-gray-500 mt-8">No applicant yet</p>
      ) : (
        <section className="flex flex-col gap-4 max-w-4xl mx-auto mt-8 px-4">
          {applicants.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border-gray-200 p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3"
            >
              <div>
                <h2 className="font-bold">{item.applicant.name}</h2>
                <a
                  className="text-sm text-[#2563EB]"
                  href={`mailto:${item.applicant.email}`}
                >
                  {item.applicant.email}
                </a>

                <p className="text-sm text-gray-500">
                  Applied {formatPostedAgo(item.created_at)}
                </p>
              </div>

              <span
                className={`px-4 py-1 rounded-full text-sm font-bold w-fit ${statusStyles[item.status]}`}
              >
                {item.status}
              </span>

              <div className="flex gap-4">
                <button
                  onClick={() => updateStatus(item.id, "accepted")}
                  className="text-green-700 font-bold text-sm disabled:opacity-40"
                  disabled={item.status === "accepted"}
                >
                  Accept
                </button>
                <button
                  disabled={item.status === "rejected"}
                  className={`text-red-500 font-bold text-sm disabled:opacity-40`}
                  onClick={() => updateStatus(item.id, "rejected")}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
