"use client";

import { useState } from "react";

export default function AdminSignupForm() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [code, setCode] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        verificationSent ? "/api/admin/signup/verify" : "/api/admin/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            verificationSent
              ? { challengeId, code }
              : { displayName, email, password },
          ),
        },
      );
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Sign-up failed.");
        return;
      }

      if (verificationSent) {
        window.location.assign("/admin");
      } else {
        setChallengeId(result.challengeId);
        setVerificationSent(true);
        setPassword("");
      }
    } catch (error) {
      console.error("Admin sign-up failed:", error);
      setError("Unable to create the admin account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-xl">
        <h1 className="mb-2 text-center text-2xl font-bold text-white">
          Create Admin Account
        </h1>
        <p className="mb-6 text-center text-sm text-gray-400">
          {verificationSent
            ? `Enter the six-digit verification code sent to ${email}.`
            : "This one-time sign-up is available only before the first admin account is created."}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!verificationSent && (
            <>
              <div>
                <label
                  htmlFor="displayName"
                  className="mb-1 block text-sm font-medium text-gray-300"
                >
                  Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  autoComplete="name"
                  maxLength={100}
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-gray-300"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-medium text-gray-300"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  minLength={12}
                  maxLength={256}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
                <p className="mt-1 text-xs text-gray-400">
                  Use at least 12 characters. A verification code will be
                  emailed before the account is created.
                </p>
              </div>
            </>
          )}
          {verificationSent && (
            <div>
              <label
                htmlFor="verificationCode"
                className="mb-1 block text-sm font-medium text-gray-300"
              >
                Email verification code
              </label>
              <input
                id="verificationCode"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                value={code}
                onChange={(event) =>
                  setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-center text-xl tracking-[0.5em] text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
              <p className="mt-1 text-xs text-gray-400">
                The code expires in 10 minutes and allows five attempts.
              </p>
            </div>
          )}
          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-cyan-500 px-4 py-2 font-semibold text-white transition hover:bg-cyan-600 disabled:opacity-50"
          >
            {loading
              ? verificationSent
                ? "Verifying..."
                : "Sending code..."
              : verificationSent
                ? "Verify Email and Create Account"
                : "Send Verification Code"}
          </button>
          {verificationSent && (
            <button
              type="button"
              onClick={() => {
                setVerificationSent(false);
                setChallengeId("");
                setCode("");
                setPassword("");
                setError("");
              }}
              className="w-full text-sm text-gray-400 underline hover:text-white"
            >
              Start over to request another code
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
