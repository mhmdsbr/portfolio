"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateMyProfile } from "@/server/actions/admin/profile";
import { fieldClassName } from "./styles";
import type { ProfileSettingsFormProps } from "./types";

export default function ProfileDetailsForm({
  admin,
}: Pick<ProfileSettingsFormProps, "admin">) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(admin.displayName);
  const [email, setEmail] = useState(admin.email);
  const [bio, setBio] = useState(admin.bio ?? "");
  const [preferences, setPreferences] = useState(
    JSON.stringify(admin.preferences, null, 2),
  );
  const [profileMessage, setProfileMessage] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const handleProfileSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setProfileLoading(true);
    setProfileMessage("");
    const formData = new FormData();
    formData.set("displayName", displayName);
    formData.set("email", email);
    formData.set("bio", bio);
    formData.set("preferences", preferences);

    try {
      const result = await updateMyProfile(formData);
      setProfileMessage(
        result.success ? "Profile settings saved." : result.error,
      );
      if (result.success) router.refresh();
    } catch (error) {
      console.error("Failed to save profile settings:", error);
      setProfileMessage("Failed to save profile settings.");
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <section className="space-y-4 rounded-lg bg-gray-800/50 p-6">
      <div>
        <h2 className="text-lg font-semibold">Your Profile</h2>
        <p className="mt-1 text-sm text-gray-400">
          Your sign-in identity is stored separately from your profile and
          preferences.
        </p>
      </div>
      {profileMessage && (
        <p role="status" className="text-sm text-cyan-300">
          {profileMessage}
        </p>
      )}
      <form onSubmit={handleProfileSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="profileName"
              className="mb-1 block text-sm font-medium text-gray-300"
            >
              Name
            </label>
            <input
              id="profileName"
              value={displayName}
              maxLength={100}
              onChange={(event) => setDisplayName(event.target.value)}
              className={fieldClassName}
              required
            />
          </div>
          <div>
            <label
              htmlFor="profileEmail"
              className="mb-1 block text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <input
              id="profileEmail"
              type="email"
              autoComplete="email"
              value={email}
              maxLength={254}
              onChange={(event) => setEmail(event.target.value)}
              className={fieldClassName}
              required
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="profileBio"
            className="mb-1 block text-sm font-medium text-gray-300"
          >
            Bio
          </label>
          <textarea
            id="profileBio"
            value={bio}
            maxLength={2000}
            rows={4}
            onChange={(event) => setBio(event.target.value)}
            className={fieldClassName}
          />
        </div>
        <div>
          <label
            htmlFor="preferences"
            className="mb-1 block text-sm font-medium text-gray-300"
          >
            Preferences (JSON object)
          </label>
          <textarea
            id="preferences"
            value={preferences}
            rows={8}
            spellCheck={false}
            onChange={(event) => setPreferences(event.target.value)}
            className={`${fieldClassName} font-mono text-sm`}
          />
        </div>
        <button
          type="submit"
          disabled={profileLoading}
          className="rounded-md bg-cyan-500 px-5 py-2 font-semibold text-white transition hover:bg-cyan-600 disabled:opacity-50"
        >
          {profileLoading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </section>
  );
}
