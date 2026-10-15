"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setAdminUserActive } from "@/server/actions/admin/profile";
import type { ProfileSettingsFormProps } from "./types";

export default function AdminAccounts({
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
    <section className="space-y-4 rounded-lg bg-gray-800/50 p-6">
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
