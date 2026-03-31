
"use client";

import { useEffect, useState } from "react";
import { getMe, updateMe } from "@/lib/api/clientApi";
import css from "./EditProfilePage.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { User } from "@/types/user";
import { useAuthStore } from "@/lib/store/authStore";

export default function EditProfilePage() {
  const router = useRouter();
  const setAuthUser = useAuthStore((state) => state.setUser);

  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getMe();
      setUser(data);
      setUsername(data.username ?? "");
    };

    fetchUser();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleSaveUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const updatedUser = await updateMe({ username });
    setAuthUser(updatedUser);
    router.push("/profile");
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user.avatar || "/default-avatar.png"}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={handleSaveUser}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={handleChange}
            />
          </div>

          <p>Email: {user.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
