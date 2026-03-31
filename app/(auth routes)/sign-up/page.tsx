"use client";

import css from "./SignUpPage.module.css";

import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";

import { getMe, register, RegisterRequest } from "@/lib/api/clientApi";

type ErrorResponse = {
  error?: string;
  message?: string;
};

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { setUser } = useAuthStore();

  const handleSubmit = async (formData: FormData) => {
    setError("");

    try {
      const formValues = Object.fromEntries(
        formData.entries(),
      ) as RegisterRequest;

      await register(formValues);

      const user = await getMe();
      setUser(user);

      router.replace("/profile");
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      setError(
        axiosError.response?.data?.error ??
          axiosError.response?.data?.message ??
          axiosError.message ??
          "Oops... some error",
      );
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form className={css.form} action={handleSubmit}>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Register
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}