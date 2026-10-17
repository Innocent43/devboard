"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { API_URL } from "../lib/api";
import { extractErrorMessage } from "../lib/api";
import { useAuth } from "../lib/auth-context";
import { dashboardPathFor } from "../lib/auth-context";
interface LoginData {
  email: string;
  password: string;
}
export default function LoginForm() {
  const [loginError, setLoginError] = useState<string | null>(null);
  const router = useRouter();
  const { refreshUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginData>();

  const submitForm = async (data: LoginData) => {
    setLoginError(null);

    try {
      const formBody = new URLSearchParams();
      formBody.append("username", data.email);
      formBody.append("password", data.password);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(extractErrorMessage(errorData, "Login failed"));
      }

      const tokenData = await response.json();
      console.log("Logged in:", tokenData);

      localStorage.setItem("access_token", tokenData.access_token);

      // const meResponse = await fetch(`${API_URL}/users/me`, {
      //   headers: {
      //     Authorization: `Bearer ${tokenData.access_token}`,
      //   },
      // });

      // if (!meResponse.ok) {
      //   throw new Error("Could not load your profile");
      // }

      // const me = await meResponse.json();

      const me = await refreshUser();
      if (!me) {
        throw new Error("Could not load your profile");
      }

      reset();

      router.push(dashboardPathFor(me.role));
    } catch (error) {
      if (error instanceof Error) {
        setLoginError(error.message);
      }
    }
  };
  return (
    <form
      className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md mt-6 sm:mt-6"
      onSubmit={handleSubmit(submitForm)}
    >
      <h3 className="text-center font-bold text-lg">Welcome back</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          className="w-full border border-gray-300 rounded-lg"
          {...register("email", {
            required: "email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email",
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
          type="password"
          className="w-full border border-gray-300 rounded-lg"
          {...register("password", { required: "password is required" })}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      {loginError && (
        <p className="text-red-500 text-sm mt-2 text-center">{loginError}</p>
      )}
      <button
        className=" bg-[#2563EB] text-white font-medium rounded-lg py-2  mt-2 w-full"
        type="submit"
      >
        Login
      </button>
    </form>
  );
}
