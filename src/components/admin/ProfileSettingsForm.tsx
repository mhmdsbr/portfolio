"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  beginAdminUserEmailVerification,
  changeMyPassword,
  completeAdminUserEmailVerification,
  resetAdminUserPassword,
  setAdminUserActive,
  updateMyProfile,
} from "@/actions/profile";
import type { CurrentAdminProfile } from "@/lib/auth";

interface AdminAccount {
  id: number;
  email: string;
  displayName: string;
  isActive: boolean;
  createdAt: Date | null;
}

interface ProfileSettingsFormProps {
  admin: CurrentAdminProfile;
  admins: AdminAccount[];
}

const fieldClassName =
  "w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500";

function AdminAccounts({
  admins,
  admin,
}: Pick<ProfileSettingsFormProps, "admin" | "admins">) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleActiveChange = async (userId: number, active: boolean) => {
    setLoadingId(userId);
    setMessage("");
    const formData = new FormData();
    formData.set("userId", String(userId));
    formData.set("active", String(active));

    try {
      const result = await setAdminUserActive(formData);
      if (!result.success) {
        setMessage(result.error);
        return;
      }
      setMessage("Admin account updated.");
      router.refresh();
    } catch (error) {
      console.error("Failed to update admin account:", error);
      setMessage("Failed to update admin account.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <section className="space-y-4 rounded-lg bg-gray-800 p-6">
      <div>
        <h2 className="text-lg font-semibold">Admin Accounts</h2>
        <p className="mt-1 text-sm text-gray-400">
          Admins have equal access. Deactivated accounts and their profile data
          are retained, but cannot sign in.
        </p>
      </div>
      {message && (
        <p role="status" className="text-sm text-cyan-300">
          {message}
        </p>
      )}
      <div className="space-y-3">
        {admins.map((account) => (
          <div
            key={account.id}
            className="flex flex-col gap-3 rounded-md border border-gray-700 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="truncate font-medium">
                {account.displayName}
                {account.id === admin.id && (
                  <span className="ml-2 text-xs text-cyan-300">You</span>
                )}
              </p>
              <p className="break-all text-sm text-gray-400">{account.email}</p>
              <p className="mt-1 text-xs text-gray-500">
                {account.isActive ? "Active" : "Deactivated"}
                {account.createdAt &&
                  ` · Added ${new Date(account.createdAt).toISOString().slice(0, 10)}`}
              </p>
            </div>
            {account.id !== admin.id && (
              <button
                type="button"
                onClick={() =>
                  handleActiveChange(account.id, !account.isActive)
                }
                disabled={loadingId === account.id}
                className="shrink-0 rounded-md border border-gray-600 px-3 py-2 text-sm text-gray-200 transition hover:bg-gray-700 disabled:opacity-50"
              >
                {loadingId === account.id
                  ? "Saving..."
                  : account.isActive
                    ? "Deactivate"
                    : "Reactivate"}
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ProfileSettingsForm({
  admin,
  admins,
}: ProfileSettingsFormProps) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(admin.displayName);
  const [email, setEmail] = useState(admin.email);
  const [bio, setBio] = useState(admin.bio ?? "");
  const [preferences, setPreferences] = useState(
    JSON.stringify(admin.preferences, null, 2),
  );
  const [profileMessage, setProfileMessage] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newAdminChallengeId, setNewAdminChallengeId] = useState("");
  const [newAdminVerificationCode, setNewAdminVerificationCode] = useState("");
  const [newAdminMessage, setNewAdminMessage] = useState("");
  const [newAdminLoading, setNewAdminLoading] = useState(false);
  const [resetPassword, setResetPassword] = useState<Record<number, string>>(
    {},
  );
  const [resetMessage, setResetMessage] = useState("");
  const [resetLoadingId, setResetLoadingId] = useState<number | null>(null);

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

  const handlePasswordSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage("");
    const formData = new FormData();
    formData.set("currentPassword", currentPassword);
    formData.set("newPassword", newPassword);

    try {
      const result = await changeMyPassword(formData);
      setPasswordMessage(result.success ? "Password changed." : result.error);
      if (result.success) {
        setCurrentPassword("");
        setNewPassword("");
      }
    } catch (error) {
      console.error("Failed to change password:", error);
      setPasswordMessage("Failed to change password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleAddAdmin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNewAdminLoading(true);
    setNewAdminMessage("");

    try {
      let result;
      if (newAdminChallengeId) {
        result = await completeAdminUserEmailVerification(
          newAdminChallengeId,
          newAdminVerificationCode,
        );
      } else {
        const formData = new FormData();
        formData.set("email", newAdminEmail);
        formData.set("displayName", newAdminName);
        formData.set("password", newAdminPassword);
        result = await beginAdminUserEmailVerification(formData);
      }

      if (!result.success) {
        setNewAdminMessage(result.error);
        return;
      }

      if ("challengeId" in result && typeof result.challengeId === "string") {
        setNewAdminChallengeId(result.challengeId);
        setNewAdminPassword("");
        setNewAdminMessage(`Verification code sent to ${newAdminEmail}.`);
      } else {
        setNewAdminName("");
        setNewAdminEmail("");
        setNewAdminPassword("");
        setNewAdminChallengeId("");
        setNewAdminVerificationCode("");
        setNewAdminMessage("Admin account created and email verified.");
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to create admin account:", error);
      setNewAdminMessage("Failed to create admin account.");
    } finally {
      setNewAdminLoading(false);
    }
  };

  const handlePasswordReset = async (
    event: React.FormEvent<HTMLFormElement>,
    userId: number,
  ) => {
    event.preventDefault();
    setResetLoadingId(userId);
    setResetMessage("");
    const formData = new FormData();
    formData.set("userId", String(userId));
    formData.set("password", resetPassword[userId] ?? "");

    try {
      const result = await resetAdminUserPassword(formData);
      if (!result.success) {
        setResetMessage(result.error);
        return;
      }
      setResetPassword((passwords) => ({ ...passwords, [userId]: "" }));
      setResetMessage("Admin password reset; their existing sessions ended.");
    } catch (error) {
      console.error("Failed to reset admin password:", error);
      setResetMessage("Failed to reset admin password.");
    } finally {
      setResetLoadingId(null);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <section className="space-y-4 rounded-lg bg-gray-800 p-6">
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

      <section className="space-y-4 rounded-lg bg-gray-800 p-6">
        <div>
          <h2 className="text-lg font-semibold">Change Password</h2>
          <p className="mt-1 text-sm text-gray-400">
            Passwords are stored as scrypt hashes, never as plaintext.
          </p>
        </div>
        {passwordMessage && (
          <p role="status" className="text-sm text-cyan-300">
            {passwordMessage}
          </p>
        )}
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="currentPassword"
              className="mb-1 block text-sm font-medium text-gray-300"
            >
              Current password
            </label>
            <input
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className={fieldClassName}
              required
            />
          </div>
          <div>
            <label
              htmlFor="newPassword"
              className="mb-1 block text-sm font-medium text-gray-300"
            >
              New password
            </label>
            <input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              minLength={12}
              maxLength={256}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className={fieldClassName}
              required
            />
          </div>
          <button
            type="submit"
            disabled={passwordLoading}
            className="rounded-md bg-cyan-500 px-5 py-2 font-semibold text-white transition hover:bg-cyan-600 disabled:opacity-50"
          >
            {passwordLoading ? "Updating..." : "Change Password"}
          </button>
        </form>
      </section>

      <AdminAccounts admins={admins} admin={admin} />

      <section className="space-y-4 rounded-lg bg-gray-800 p-6">
        <div>
          <h2 className="text-lg font-semibold">Add Admin Account</h2>
          <p className="mt-1 text-sm text-gray-400">
            New accounts receive the same admin access as yours.
          </p>
        </div>
        {newAdminMessage && (
          <p role="status" className="text-sm text-cyan-300">
            {newAdminMessage}
          </p>
        )}
        <form onSubmit={handleAddAdmin} className="space-y-4">
          {!newAdminChallengeId && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="newAdminName"
                    className="mb-1 block text-sm font-medium text-gray-300"
                  >
                    Name
                  </label>
                  <input
                    id="newAdminName"
                    value={newAdminName}
                    maxLength={100}
                    onChange={(event) => setNewAdminName(event.target.value)}
                    className={fieldClassName}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="newAdminEmail"
                    className="mb-1 block text-sm font-medium text-gray-300"
                  >
                    Email
                  </label>
                  <input
                    id="newAdminEmail"
                    type="email"
                    autoComplete="email"
                    value={newAdminEmail}
                    maxLength={254}
                    onChange={(event) => setNewAdminEmail(event.target.value)}
                    className={fieldClassName}
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="newAdminPassword"
                  className="mb-1 block text-sm font-medium text-gray-300"
                >
                  Password
                </label>
                <input
                  id="newAdminPassword"
                  type="password"
                  autoComplete="new-password"
                  minLength={12}
                  maxLength={256}
                  value={newAdminPassword}
                  onChange={(event) => setNewAdminPassword(event.target.value)}
                  className={fieldClassName}
                  required
                />
                <p className="mt-1 text-xs text-gray-400">
                  The account will only be created after email verification.
                </p>
              </div>
            </>
          )}
          {newAdminChallengeId && (
            <div>
              <label
                htmlFor="newAdminVerificationCode"
                className="mb-1 block text-sm font-medium text-gray-300"
              >
                Email verification code for {newAdminEmail}
              </label>
              <input
                id="newAdminVerificationCode"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                value={newAdminVerificationCode}
                onChange={(event) =>
                  setNewAdminVerificationCode(
                    event.target.value.replace(/\D/g, "").slice(0, 6),
                  )
                }
                className={`${fieldClassName} text-center text-xl tracking-[0.5em]`}
                required
              />
              <p className="mt-1 text-xs text-gray-400">
                The code expires in 10 minutes and allows five attempts.
              </p>
            </div>
          )}
          <button
            type="submit"
            disabled={newAdminLoading}
            className="rounded-md bg-cyan-500 px-5 py-2 font-semibold text-white transition hover:bg-cyan-600 disabled:opacity-50"
          >
            {newAdminLoading
              ? newAdminChallengeId
                ? "Verifying..."
                : "Sending code..."
              : newAdminChallengeId
                ? "Verify Email and Create Admin"
                : "Send Verification Code"}
          </button>
          {newAdminChallengeId && (
            <button
              type="button"
              onClick={() => {
                setNewAdminChallengeId("");
                setNewAdminVerificationCode("");
                setNewAdminPassword("");
                setNewAdminMessage("");
              }}
              className="w-full text-sm text-gray-400 underline hover:text-white"
            >
              Start over to request another code
            </button>
          )}
        </form>
      </section>

      <section className="space-y-4 rounded-lg bg-gray-800 p-6">
        <h2 className="text-lg font-semibold">
          Reset Another Admin’s Password
        </h2>
        {resetMessage && (
          <p role="status" className="text-sm text-cyan-300">
            {resetMessage}
          </p>
        )}
        <div className="space-y-4">
          {admins
            .filter((account) => account.id !== admin.id && account.isActive)
            .map((account) => (
              <form
                key={account.id}
                onSubmit={(event) => handlePasswordReset(event, account.id)}
                className="flex flex-col gap-3 rounded-md border border-gray-700 p-4 sm:flex-row sm:items-end"
              >
                <div className="min-w-0 flex-1">
                  <label
                    htmlFor={`reset-${account.id}`}
                    className="mb-1 block text-sm font-medium text-gray-300"
                  >
                    New password for {account.email}
                  </label>
                  <input
                    id={`reset-${account.id}`}
                    type="password"
                    autoComplete="new-password"
                    minLength={12}
                    maxLength={256}
                    value={resetPassword[account.id] ?? ""}
                    onChange={(event) =>
                      setResetPassword((passwords) => ({
                        ...passwords,
                        [account.id]: event.target.value,
                      }))
                    }
                    className={fieldClassName}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={resetLoadingId === account.id}
                  className="rounded-md border border-gray-600 px-4 py-2 text-sm text-gray-200 transition hover:bg-gray-700 disabled:opacity-50"
                >
                  {resetLoadingId === account.id ? "Resetting..." : "Reset"}
                </button>
              </form>
            ))}
        </div>
      </section>
    </div>
  );
}
