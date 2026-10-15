"use client";

import { useState } from "react";
import {
  beginAdminUserPasswordReset,
  completeAdminUserPasswordReset,
} from "@/server/actions/admin/profile";
import { fieldClassName } from "./styles";
import type { ProfileSettingsFormProps } from "./types";

export default function AdminPasswordResetForm({
  admin,
  admins,
}: Pick<ProfileSettingsFormProps, "admin" | "admins">) {
  const [resetPassword, setResetPassword] = useState<Record<number, string>>(
    {},
  );
  const [resetChallenges, setResetChallenges] = useState<
    Record<number, string>
  >({});
  const [resetCodes, setResetCodes] = useState<Record<number, string>>({});
  const [resetMessage, setResetMessage] = useState("");
  const [resetLoadingId, setResetLoadingId] = useState<number | null>(null);
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
      const challengeId = resetChallenges[userId];
      if (challengeId) {
        const result = await completeAdminUserPasswordReset(
          challengeId,
          resetCodes[userId] ?? "",
        );
        if (!result.success) {
          setResetMessage(result.error);
          return;
        }

        setResetChallenges((challenges) => {
          const nextChallenges = { ...challenges };
          delete nextChallenges[userId];
          return nextChallenges;
        });
        setResetCodes((codes) => {
          const nextCodes = { ...codes };
          delete nextCodes[userId];
          return nextCodes;
        });
        setResetMessage("Admin password reset; their existing sessions ended.");
      } else {
        const result = await beginAdminUserPasswordReset(formData);
        if (!result.success) {
          setResetMessage(result.error);
          return;
        }
        setResetChallenges((challenges) => ({
          ...challenges,
          [userId]: result.challengeId,
        }));
        setResetPassword((passwords) => ({ ...passwords, [userId]: "" }));
        setResetMessage(`Verification code sent to ${result.email}.`);
      }
    } catch (error) {
      console.error("Failed to reset admin password:", error);
      setResetMessage("Failed to reset admin password.");
    } finally {
      setResetLoadingId(null);
    }
  };

  return (
    <section className="space-y-4 rounded-lg bg-gray-800/50 p-6">
      <div>
        <h2 className="text-lg font-semibold">
          Reset Another Admin’s Password
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          A verification code will be sent to that admin’s email before their
          password is changed.
        </p>
      </div>
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
                {resetChallenges[account.id] ? (
                  <>
                    <label
                      htmlFor={`reset-code-${account.id}`}
                      className="mb-1 block text-sm font-medium text-gray-300"
                    >
                      Verification code sent to {account.email}
                    </label>
                    <input
                      id={`reset-code-${account.id}`}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      value={resetCodes[account.id] ?? ""}
                      onChange={(event) =>
                        setResetCodes((codes) => ({
                          ...codes,
                          [account.id]: event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 6),
                        }))
                      }
                      className={fieldClassName}
                      required
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      The code expires in 10 minutes and allows five attempts.
                    </p>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
              <button
                type="submit"
                disabled={resetLoadingId === account.id}
                className="rounded-md border border-gray-600 px-4 py-2 text-sm text-gray-200 transition hover:bg-gray-700 disabled:opacity-50"
              >
                {resetLoadingId === account.id
                  ? resetChallenges[account.id]
                    ? "Verifying..."
                    : "Sending code..."
                  : resetChallenges[account.id]
                    ? "Verify and reset"
                    : "Send verification code"}
              </button>
            </form>
          ))}
      </div>
    </section>
  );
}
