import { getExperienceSectionData } from "@/actions/experience";
import SummaryForm from "@/components/admin/SummaryForm";
import JobsForm from "@/components/admin/JobsForm";
import ExperiencesForm from "@/components/admin/ExperiencesForm";

export default async function ExperiencePage() {
  const experienceData = await getExperienceSectionData();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Career & Skills</h1>
      <p className="-mt-6 text-sm text-gray-400">
        Edit the shared section titles and visibility in Page layout.
      </p>

      {/* Section-specific resume settings */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Resume download link</h2>
        <SummaryForm initialData={experienceData} />
      </div>

      {/* Jobs */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Work Experience</h2>
        <p className="text-sm text-gray-400 mb-4">
          Drag to reorder. Click Edit to modify.
        </p>
        <JobsForm jobs={experienceData.jobs || []} />
      </div>

      {/* Skills */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Skills</h2>
        <p className="text-sm text-gray-400 mb-4">
          Drag to reorder. Click Edit to modify.
        </p>
        <ExperiencesForm experiences={experienceData.experiences || []} />
      </div>
    </div>
  );
}
