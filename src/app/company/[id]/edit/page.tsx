"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRequireRole } from "@/app/lib/use-require-role";
import { useAuth } from "@/app/lib/auth-context";
import Header, { MobileHeader } from "@/app/components/header";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { API_URL, authHeader, extractErrorMessage } from "@/app/lib/api";

interface EditJobForm {
  title: string;
  company: string;
  location: string;
  description: string;
  is_open: boolean;
}

interface LoadedJob extends EditJobForm {
  id: number;
  owner_id: number;
}

export default function EditJobPage() {
  const params = useParams();

  const router = useRouter();
  const jobId = params.id as string;

  const { ready } = useRequireRole("employer");
  const { user } = useAuth();
  const userId = user?.id;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditJobForm>();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready || userId === undefined) return;

    const loadJob = async () => {
      try {
        const response = await fetch(`${API_URL}/jobs/${jobId}`);

        if (response.status === 404) throw new Error("Job not found");

        if (!response.ok) throw new Error("Failed to load");

        const job: LoadedJob = await response.json();

        if (job.owner_id !== userId) {
          throw new Error("This is not your job posting");
        }

        reset({
          title: job.title,
          company: job.company,
          location: job.location,
          description: job.description,
          is_open: job.is_open,
        });
      } catch (error) {
        if (error instanceof Error) setLoadError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [ready, userId, jobId, reset]);

  const submitForm = async (data: EditJobForm) => {
    setSubmitError(null);

    const token = localStorage.getItem("access_token") ?? "";
    try {
      const response = await fetch(`${API_URL}/jobs/${jobId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(token),
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          extractErrorMessage(errorData, "Failed to save changes"),
        );
      }

      router.push("/dashboard/company");
    } catch (error) {
      if (error instanceof Error) setSubmitError(error.message);
    }
  };
  if (!ready || loading) {
    return <p className="p4">Loading</p>;
  }

  return (
    <main className="bg-[#EEF2FF] min-h-screen">
      <>
        <MobileHeader />
        <Header />
      </>

      <div className="max-w-xl mx-auto mt-8 px-4">
        <Link
          href="/dashboard/company"
          className="text-[#2563EB] text-sm font-bold"
        >
          ⬅ Back to my posting
        </Link>
        <h1 className="text-3xl font-bold mt-2 mb-4">Edit job</h1>
        {loadError ? (
          <p className="text-sm text-red-500">{loadError}</p>
        ) : (
          <form
            onSubmit={handleSubmit(submitForm)}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg"
                {...register("title", { required: "Job title is required" })}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg"
                {...register("company", {
                  required: "Company name is required",
                })}
              />
              {errors.company && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.company.message}
                </p>
              )}
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg"
                {...register("location", { required: "Location is required" })}
              />

              {errors.location && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job description
              </label>
              <textarea
                rows={6}
                className="w-full border border-gray-300 rounded-lg"
                {...register("description", {
                  required: "Description is required",
                })}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <label className="flex items-center gap-2 mt-3 text-sm font-medium text-gray-700">
              <input type="checkbox" {...register("is_open")} />
              Accepting applications
            </label>

            {submitError && (
              <p className="text-red-600 text-sm mt-2 text-center">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#2563EB] text-white font-medium rounded-lg py-2 px-6 mx-auto flex mt-4 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
