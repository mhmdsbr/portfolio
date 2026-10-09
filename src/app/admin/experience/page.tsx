import { getExperience } from "@/actions/experience";
import ExperienceSectionForm from "@/components/admin/ExperienceSectionForm";
import ExperiencesForm from "@/components/admin/ExperiencesForm";
import SkillsForm from "@/components/admin/SkillsForm";
import SectionSettingsForm from "@/components/admin/SectionSettingsForm";

export default async function ExperiencePage() {
  const { section, config, experiences, skills } = await getExperience();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Career & Skills</h1>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Section settings</h2>
        <SectionSettingsForm section={section} />
      </div>

      {/* Section-specific resume settings */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Resume download link</h2>
        <ExperienceSectionForm config={config} />
      </div>

      {/* Experiences */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Work Experience</h2>
        <p className="text-sm text-gray-400 mb-4">
          Drag to reorder. Click Edit to modify.
        </p>
        <ExperiencesForm experiences={experiences} />
      </div>

      {/* Skills */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Skills</h2>
        <p className="text-sm text-gray-400 mb-4">
          Drag to reorder. Click Edit to modify.
        </p>
        <SkillsForm skills={skills} />
      </div>
    </div>
  );
}
