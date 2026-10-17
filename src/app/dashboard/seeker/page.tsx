"use client";
import { dummyApplication } from "@/app/components/data";
import Header from "@/app/components/header";
import { MobileHeader } from "@/app/components/header";
import { Application } from "@/app/components/data";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { API_URL } from "@/app/lib/api";

interface JobData {
  id: number;
  title: string;
  company: string;
}

interface ApplicationData {
  id: number;
  status: "pending" | "accepted" | "rejected";
  job: JobData;
}
const statusStyles: Record<string, string> = {
  pending: "bg-[#FEF3C7] text-[#92400E]",
  accepted: "bg-[#D1FAE5] text-[#065F46]",
  rejected: "bg-[#FEE2E2] text-[#991B1B]",
};
// const statusStyles: Record<Application["status"], string> = {
//   pending: "bg-[#FEF3C7] text-[#92400E]",
//   accepted: "bg-[#D1FAE5] text-[#065F46]",
//   rejected: "bg-[#FEE2E2] text-[#991B1B]",
// };

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [applications, setApplication] = useState<ApplicationData[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/");
      // return;
    }

    const fetchApplications = async () => {
      try {
        const response = await fetch(
          `${API_URL}/applications/mine`,
          // "http://127.0.0.1:8000/applications/mine",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }

        const data: ApplicationData[] = await response.json();
        setApplication(data);
      } catch (error) {
        console.error("Fetch applications error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [router]);

  if (loading) {
    return <p>Checking authintication...</p>;
  }
  if (applications.length === 0) {
    return <div>No Application yet</div>;
  }
  return (
    <main className="bg-[#EEF2FF] min-h-screen overflow-hidde">
      <>
        <MobileHeader />
        <Header />
      </>
      <div className=" text-center mt-8">
        <h2 className="text-3xl font-bold">My Applications</h2>
      </div>
      <section className="flex flex-col gap-4 mt-8 p-4 x-4 items-center justify-between w-full max-w-4xl mx-auto">
        {applications.map((data) => (
          <div
            key={data.id}
            className="bg-white rounded-xl gap-4 border border-gray-200 p-4 flex justify-between items-center w-full flex-col sm:flex-row sm:flex-row"
          >
            <div className="flex items-center gap-4 flex-col sm:flex-row">
              <h2 className="font-bold">{data.job.title}</h2>

              <p className="text-gray-500 text-sm">{data.job.company}</p>
            </div>

            <span
              className={`px-4 py-1 rounded-full text-sm font-bold ${statusStyles[data.status]}`}
            >
              {data.status}
            </span>
            {/* <p>{data.created_at}</p> */}
          </div>
        ))}
      </section>
    </main>
  );
}
