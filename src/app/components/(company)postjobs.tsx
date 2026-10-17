"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { API_URL, extractErrorMessage, authHeader } from "../lib/api";
import { useRequireRole } from "../lib/use-require-role";

interface PostJobsInterface {
  jobTitle: string;
  CompanyName: string;
  Location: string;
  JobType: string;
  JobDescription: string;
}
export default function CompanyPostJobs() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PostJobsInterface>();

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { ready } = useRequireRole("employer");

  const submitForm = async (data: PostJobsInterface) => {
    setSubmitError(null);
    setSuccess(false);

    const token = localStorage.getItem("access_token");
    if (!token) {
      setSubmitError("You must be logged in as an employer to post a job.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/jobs/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(token),
        },
        body: JSON.stringify({
          title: data.jobTitle,
          company: data.CompanyName,
          location: data.Location,
          description: data.JobDescription,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(extractErrorMessage(errorData, "Failed to post job"));
      }

      setSuccess(true);
      reset();
    } catch (error) {
      if (error instanceof Error) {
        setSubmitError(error.message);
      }
    }
  };
  if (!ready) {
    return <p className="p-4">Loading...</p>;
  }

  return (
    <form
      className="w-full  sm:max-w-[80vw]  md:max-w-1/2 mx-auto bg-white p-6 rounded-xl shadow-md sm:mt-6"
      onSubmit={handleSubmit(submitForm)}
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Job Title
        </label>
        <input
          className="w-full border border-gray-300 rounded-lg"
          {...register("jobTitle", { required: "Job title is required" })}
        />
        {errors.jobTitle && (
          <p className="text-red-500 text-sm mt-1">{errors.jobTitle.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Company Name
        </label>
        <input
          className="w-full border border-gray-300 rounded-lg"
          {...register("CompanyName", { required: "company name is required" })}
        />
        {errors.CompanyName && (
          <p className="text-red-500 text-sm mt-1">
            {errors.CompanyName.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          className="w-full border border-gray-300 rounded-lg"
          {...register("Location", { required: "location is required" })}
        />
        {errors.Location && (
          <p className="text-red-500 text-sm mt-1">{errors.Location.message}</p>
        )}
      </div>

      <div>
        <select
          className="w-full border border-gray-300 rounded-lg py-2 mt-3"
          {...register("JobType", { required: "Job type is required" })}
        >
          <option value="">Select job type</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
        </select>
        {errors.JobType && (
          <p className="text-red-500 text-sm mt-1">{errors.JobType.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Job description
        </label>
        <textarea
          className="w-full border border-gray-300 rounded-lg"
          {...register("JobDescription", {
            required: "Job description is required",
          })}
        />
        {errors.JobDescription && (
          <p className="text-red-500 text-sm mt-1">
            {errors.JobDescription.message}
          </p>
        )}
      </div>

      {submitError && (
        <p className="text-red-600 text-sm mt-2 text-center">{submitError}</p>
      )}

      {success && (
        <p className="text-green-600 text-sm mt-2 text-center">
          Job posted successfully
        </p>
      )}
      <button
        className=" bg-[#2563EB] text-white font-medium rounded-lg py-2 px-2  mx-auto flex mt-2"
        type="submit"
      >
        Post Job
      </button>
    </form>
  );
}
