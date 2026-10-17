"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { API_URL } from "../lib/api";
import { extractErrorMessage } from "../lib/api";

interface SeekerSignUpForm {
  fullName: string;
  email: string;
  password: string;
}
function JobSeekerSignupform() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SeekerSignUpForm>();

  const submitForm = async (data: SeekerSignUpForm) => {
    setSubmitError(null);
    setSuccess(false);
    try {
      const response = await fetch(`${API_URL}/users/`, {
        // const response = await fetch("http://127.0.0.1:8000/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.fullName,
          email: data.email,
          password: data.password,
          role: "job_seeker",
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(extractErrorMessage(errorData, "Signup failed"));
      }

      setSuccess(true);
      const newUser = await response.json();
      console.log("User created:", newUser);
      reset();
    } catch (error) {
      if (error instanceof Error) {
        setSubmitError(error.message);
      }
    }
  };
  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <h3 className="text-center font-bold text-lg">Create your account</h3>
      <div className="mt-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          className="w-full border border-gray-300 rounded-lg"
          {...register("fullName", { required: "full name is required" })}
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          className="w-full border border-gray-300 rounded-lg "
          {...register("email", {
            required: "email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter valid email",
            },
          })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          className="w-full border border-gray-300 rounded-lg"
          {...register("password", {
            required: "password is requred",
            minLength: {
              value: 8,
              message: "Characters must at least 6",
            },
          })}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      {submitError && (
        <p className="text-red-500 text-sm mt-2 text-center">{submitError}</p>
      )}

      {success && (
        <p className="text-green-600 text-sm mt-2 text-center">
          Account Created You can now log in.
        </p>
      )}

      <button
        className=" bg-[#2563EB] text-white font-medium rounded-lg py-2  mt-2 w-full"
        type="submit"
      >
        Sign Up
      </button>
    </form>
  );
}

interface Companyform {
  companyName: string;
  workEmail: string;
  password: string;
  companySize?: string;
  industry?: string;
}

function CompanySignupForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Companyform>();

  const submit = async (data: Companyform) => {
    setSubmitError(null);
    setSuccess(false);

    try {
      const response = await fetch(`${API_URL}/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.companyName,
          email: data.workEmail,
          password: data.password,
          role: "employer",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(extractErrorMessage(errorData, "Signup failed"));
      }

      setSuccess(true);
      reset();
    } catch (error) {
      if (error instanceof Error) {
        setSubmitError(error.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <h3 className="text-center font-bold text-lg">Create company account</h3>
      <div className="mt-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Company Name
        </label>
        <input
          className="w-full border border-gray-300 rounded-lg"
          {...register("companyName", { required: "Comapny name is required" })}
        />
        {errors.companyName && (
          <p className="text-red-500 text-sm mt-1">
            {errors.companyName.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Work Email
        </label>
        <input
          className="w-full border border-gray-300 rounded-lg"
          {...register("workEmail", {
            required: "There must be work email",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter valid email",
            },
          })}
        />
        {errors.workEmail && (
          <p className="text-red-500 text-sm mt-1">
            {errors.workEmail.message}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          className="w-full border border-gray-300 rounded-lg"
          {...register("password", {
            required: "password is required ",
            minLength: {
              value: 8,
              message: "password must be at least 6 characters",
            },
          })}
        />

        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <div className="mt-3 mb-3">
        <select
          className="w-full border border-gray-300 rounded-lg"
          {...register("companySize", { required: "Company size is required" })}
        >
          <option value="">Select company size</option>
          <option value="1-10">1-10 employees</option>
          <option value="11-50">11-50 employees</option>
          <option value="51-200">51-200 employees</option>
          <option value="200+">200+ employees</option>
        </select>
        {errors.companySize && (
          <p className="text-red-500 text-sm mt-1">
            {errors.companySize.message}
          </p>
        )}
      </div>

      <div className="mt-3 mb-3">
        <select
          className="w-full border border-gray-300 rounded-lg"
          {...register("industry", { required: "Industry is required" })}
        >
          <option value="">Select industry</option>
          <option value="technology">Technology</option>
          <option value="finance">Finance</option>
          <option value="healthcare">Healthcare</option>
          <option value="education">Education</option>
          <option value="retail">Retail</option>
          <option value="other">Other</option>
        </select>
        {errors.industry && (
          <p className="text-red-500 text-sm mt-1">{errors.industry.message}</p>
        )}
      </div>
      {submitError && (
        <p className="text-red-500 text-sm mt-2 text-center">{submitError}</p>
      )}

      {success && (
        <p className="text-green-600 text-sm mt-2 text-center">
          Account Created You can now log in.
        </p>
      )}
      <button
        className=" bg-[#2563EB] text-white font-medium rounded-lg py-2  mt-2 w-full"
        type="submit"
      >
        Sign Up
      </button>
    </form>
  );
}

export default function SignupRegister() {
  const [category, setCategory] = useState<"job" | "company">("job");

  const changeCategory = (type: "job" | "company"): void => {
    setCategory(type);
  };
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md sm:mt-6">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => changeCategory("job")}
          className={`flex-1 py-2 rounded-lg font-medium transition-colors px-2 ${category === "job" ? "bg-[#2563EB] text-white" : "bg-white text-gray-500 border border-gray-200"}`}
        >
          Job Seeker
        </button>
        <button
          className={`flex-1 py-2 rounded-lg font-medium transition-colors px-2 ${category === "company" ? "bg-[#2563EB] text-white" : "bg-white text-gray-500 border border-gray-200"}`}
          onClick={() => changeCategory("company")}
        >
          Company
        </button>
      </div>
      {category === "job" ? <JobSeekerSignupform /> : <CompanySignupForm />}
    </div>
  );
}
