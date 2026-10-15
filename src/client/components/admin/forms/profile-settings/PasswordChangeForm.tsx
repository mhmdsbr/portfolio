"use client";

import { useState } from "react";
import {
  changeMyPassword,
  completeMyPasswordChange,
} from "@/server/actions/admin/profile";
import { fieldClassName } from "./styles";
export default function PasswordChangeForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordChallengeId, setPasswordChallengeId] = useState("");
  const [passwordVerificationCode, setPasswordVerificationCode] = useState("");
  const [passwordVerificationEmail, setPasswordVerificationEmail] =
    useState("");
  const handlePasswordSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage("");
    try {
      if (passwordChallengeId) {
        const result = await completeMyPasswordChange(
          passwordChallengeId,
          passwordVerificationCode,
        );
        if (!result.success) {
          setPasswordMessage(result.error);
          return;
        }
        setPasswordChallengeId("");
        setPasswordVerificationCode("");
        setPasswordVerificationEmail("");
        setPasswordMessage("Password changed. Other sessions have ended.");
      } else {
        const formData = new FormData();
        formData.set("currentPassword", currentPassword);
        formData.set("newPassword", newPassword);
        const result = await changeMyPassword(formData);
        if (!result.success) {
          setPasswordMessage(result.error);
          return;
        }
        setPasswordChallengeId(result.challengeId);
        setPasswordVerificationEmail(result.email);
        setCurrentPassword("");
        setNewPassword("");
        setPasswordMessage(`Verification code sent to ${result.email}.`);
      }
    } catch (error) {
      console.error("Failed to change password:", error);
      setPasswordMessage("Failed to change password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <section className="space-y-4 rounded-lg bg-gray-800/50 p-6">
      <div>
        <h2 className="text-lg font-semibold">Change Password</h2>
        <p className="mt-1 text-sm text-gray-400">
          Confirm your current password and verify a code sent to your account
          email. Passwords are stored as scrypt hashes.
        </p>
      </div>
      {passwordMessage && (
        <p role="status" className="text-sm text-cyan-300">
          {passwordMessage}
        </p>
      )}
      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        {passwordChallengeId ? (
          <div>
            <label
              htmlFor="passwordVerificationCode"
              className="mb-1 block text-sm font-medium text-gray-300"
            >
              Verification code sent to {passwordVerificationEmail}
            </label>
            <input
              id="passwordVerificationCode"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              value={passwordVerificationCode}
              onChange={(event) =>
                setPasswordVerificationCode(
                  event.target.value.replace(/\D/g, "").slice(0, 6),
                )
              }
              className={fieldClassName}
              required
            />
            <p className="mt-1 text-xs text-gray-400">
              The code expires in 10 minutes and allows five attempts.
            </p>
          </div>
        ) : (
          <>
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
          </>
        )}
        <button
          type="submit"
          disabled={passwordLoading}
          className="rounded-md bg-cyan-500 px-5 py-2 font-semibold text-white transition hover:bg-cyan-600 disabled:opacity-50"
        >
          {passwordLoading
            ? passwordChallengeId
              ? "Verifying..."
              : "Sending code..."
            : passwordChallengeId
              ? "Verify and change password"
              : "Send verification code"}
        </button>
        {passwordChallengeId && (
          <button
            type="button"
            onClick={() => {
              setPasswordChallengeId("");
              setPasswordVerificationCode("");
              setPasswordVerificationEmail("");
              setPasswordMessage("");
            }}
            className="w-full text-sm text-gray-400 underline hover:text-white"
          >
            Cancel verification
          </button>
        )}
      </form>
    </section>
  );
}
