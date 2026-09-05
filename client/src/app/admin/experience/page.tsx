import { getSummary } from '@/actions/summary'
import SummaryForm from '@/components/admin/SummaryForm'
import JobsForm from '@/components/admin/JobsForm'
import ExperiencesForm from '@/components/admin/ExperiencesForm'

export default async function ExperiencePage() {
  const summary = await getSummary()

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Experience / Summary</h1>

      {/* Summary Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Summary Section</h2>
        <SummaryForm initialData={summary} />
      </div>

      {/* Jobs */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Work Experience</h2>
        <p className="text-sm text-gray-400 mb-4">
          Drag to reorder. Click Edit to modify.
        </p>
        <JobsForm jobs={summary.jobs || []} />
      </div>

      {/* Skills */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Skills</h2>
        <p className="text-sm text-gray-400 mb-4">
          Drag to reorder. Click Edit to modify.
        </p>
        <ExperiencesForm experiences={summary.experiences || []} />
      </div>
    </div>
  )
}