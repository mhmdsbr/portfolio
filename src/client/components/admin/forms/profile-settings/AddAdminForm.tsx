"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  beginAdminUserEmailVerification,
  completeAdminUserEmailVerification,
} from "@/server/actions/admin/profile";
import { fieldClassName } from "./styles";

export default function AddAdminForm() {
  const router = useRouter();
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newAdminChallengeId, setNewAdminChallengeId] = useState("");
  const [newAdminVerificationCode, setNewAdminVerificationCode] = useState("");
  const [newAdminMessage, setNewAdminMessage] = useState("");
  const [newAdminLoading, setNewAdminLoading] = useState(false);
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

  return (
    <section className="space-y-4 rounded-lg bg-gray-800/50 p-6">
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
  );
}
