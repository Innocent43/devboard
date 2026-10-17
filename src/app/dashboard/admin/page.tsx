"use client";

import React, { useCallback, useEffect, useState } from "react";
import Header, { MobileHeader } from "@/app/components/header";

import { extractErrorMessage, authHeader, API_URL } from "@/app/lib/api";
import { formatPostedAgo } from "@/app/lib/format";
import { useRequireRole } from "@/app/lib/use-require-role";
import { AuthUser, useAuth } from "@/app/lib/auth-context";

interface AdminStats {
  total_users: number;
  employers: number;
  job_seekers: number;
  total_jobs: number;
  open_jobs: number;
  total_applications: number;
}

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: AuthUser["role"];
  created_at: string;
}

interface AdminJob {
  id: number;
  title: string;
  company: string;
  location: string;
  is_open: boolean;
  created_at: string;
}

async function adminRequest(path: string, method = "GET"): Promise<Response> {
  const token = localStorage.getItem("access_token") ?? "";
  return fetch(`${API_URL}/admin${path}`, {
    method,
    headers: authHeader(token),
  });
}

export default function AdminDashboard() {
  const { ready } = useRequireRole("admin");
  const { user: me } = useAuth();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [jobs, setJobs] = useState<AdminJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    try {
      const [statsRes, usersRes, JobsRes] = await Promise.all([
        adminRequest("/stats"),
        adminRequest("/users?limit=100"),
        adminRequest("/jobs?limit=100"),
      ]);
      if (!statsRes.ok || !usersRes.ok || !JobsRes.ok) {
        throw new Error("Failed to load admin data");
      }

      setStats(await statsRes.json());
      setUsers(await usersRes.json());
      setJobs(await JobsRes.json());
    } catch (error) {
      if (error instanceof Error) setPageError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    loadAll();
  }, [ready, loadAll]);

  const handleDelete = async (path: string, question: string) => {
    if (!window.confirm(question)) return;

    setPageError(null);

    try {
      const response = await adminRequest(path, "DELETE");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(extractErrorMessage(errorData, "Delete failed"));
      }
      await loadAll();
    } catch (error) {
      if (error instanceof Error) setPageError(error.message);
    }
  };

  if (!ready || loading) {
    return <p className="p-4">Loading...</p>;
  }

  const cards = stats
    ? [
        { label: "Users", value: stats.total_users },
        { label: "Employers", value: stats.employers },
        { label: "Job seekers", value: stats.job_seekers },
        { label: "Jobs", value: stats.total_jobs },
        { label: "open jobs", value: stats.open_jobs },
        { label: "Applications", value: stats.total_applications },
      ]
    : [];

  return (
    <main className="bg-[#EEF2FF] min-h-screen pb-12">
      <>
        <MobileHeader />
        <Header />
      </>

      <div className="sm:max-w-4xl w-full mx-auto mt-8 px-4 overflow-hidde">
        <h1 className="text-3xl font-bold">Admin dashboard</h1>
        {pageError && (
          <p className="text-red-500 text-sm text-center mt-4">{pageError}</p>
        )}

        <section className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
          {cards.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-xl border border-gray-200 p-4"
            >
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          ))}
        </section>

        <h2 className="text-xl font-bold mt-10">Users</h2>
        <section className="flex flex-col gap-3 mt-3">
          {users.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2"
            >
              <div>
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.email}</p>
                <p className="text-xs text-gray-400">
                  Joined {formatPostedAgo(item.created_at)}
                </p>
              </div>
              <span className="text-sm font-bold text-gray-600">
                {item.role}
              </span>
              {item.id === me?.id ? (
                <span className="text-sm text-gray-400">You {me.name}</span>
              ) : (
                <button
                  className="text-red-500 text-sm text-left"
                  onClick={() =>
                    handleDelete(
                      `/users/${item.id}`,
                      `Delete${item.name}? Their jobs and applications will be deleted too`,
                    )
                  }
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </section>

        <h2 className="text-xl font-bold mt-10">Jobs</h2>
        <section className="flex flex-col gap-3 mt-3">
          {jobs.length === 0 ? (
            <p className="text-gray-500 text-sm">No jobs yet</p>
          ) : (
            jobs.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2"
              >
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-sm text-gray-500">
                    {item.company} . {item.location}
                  </p>
                  <p className="text-xs text-gray-400">
                    Posted {formatPostedAgo(item.created_at)}
                  </p>
                </div>
                <span className="text-sm font-bold text-gray-600">
                  {item.is_open ? "Open" : "Closed"}
                </span>
                <button
                  className="text-red-500 text-sm text-left"
                  onClick={() =>
                    handleDelete(
                      `/jobs/${item.id}`,
                      `Delete "${item.title}? Its applications will be deleted too.`,
                    )
                  }
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
