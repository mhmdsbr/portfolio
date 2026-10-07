"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateExperienceSection } from "@/actions/experience";

interface SummaryFormProps {
  initialData: {
    id: number;
    buttonText: string | null;
    buttonUrl: string | null;
  };
}

export default function SummaryForm({ initialData }: SummaryFormProps) {
  const [buttonText, setButtonText] = useState(initialData.buttonText || "");
  const [buttonUrl, setButtonUrl] = useState(initialData.buttonUrl || "");
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
      setMessage("✅ Summary section updated successfully!");
      router.refresh();
    } catch (error) {
      setMessage("❌ Failed to update summary section");
      console.error("Error updating summary:", error);
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
        {loading ? "Saving..." : "Save Summary Section"}
      </button>
    </form>
  );
}
