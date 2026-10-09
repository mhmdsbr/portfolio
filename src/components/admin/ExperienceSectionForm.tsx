"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateExperienceSection } from "@/actions/experience";
import type { ButtonConfig } from "@/lib/db/section-config";

interface ExperienceSectionFormProps {
  config: ButtonConfig;
}

export default function ExperienceSectionForm({ config }: ExperienceSectionFormProps) {
  const [buttonText, setButtonText] = useState(config.buttonText || "");
  const [buttonUrl, setButtonUrl] = useState(config.buttonUrl || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.set("buttonText", buttonText);
    formData.set("buttonUrl", buttonUrl);

    try {
      await updateExperienceSection(formData);
      setMessage("✅ Experience section updated successfully!");
      router.refresh();
    } catch (error) {
      setMessage("❌ Failed to update experience section");
      console.error("Error updating experience section:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div
          className={`p-3 rounded ${message.includes("Failed") ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Button Text
          </label>
          <input
            type="text"
            value={buttonText}
            onChange={(e) => setButtonText(e.target.value)}
            placeholder="Download Resume"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Button URL
          </label>
          <input
            type="text"
            value={buttonUrl}
            onChange={(e) => setButtonUrl(e.target.value)}
            placeholder="/resume.pdf"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-6 rounded-md transition disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Experience Section"}
      </button>
    </form>
  );
}
