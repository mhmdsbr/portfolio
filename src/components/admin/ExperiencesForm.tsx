"use client";

import {
  createExperience,
  updateExperience,
  deleteExperience,
  reorderExperiences,
} from "@/actions/experience";
import { useCrudList } from "./crud/useCrudList";
import SortableCrudList, {
  CrudField,
  inputClass,
  editInputClass,
} from "./crud/SortableCrudList";

interface Experience {
  id: number;
  fromYear: number | null;
  toYear: number | null;
  jobTitle: string;
  company: string;
  description: string | null;
  sortOrder: number | null;
}

interface ExperiencesFormProps {
  experiences: Experience[];
}

export default function ExperiencesForm({ experiences }: ExperiencesFormProps) {
  const crud = useCrudList({
    items: experiences,
    actions: {
      create: createExperience,
      update: updateExperience,
      remove: deleteExperience,
      reorder: reorderExperiences,
    },
    noun: "experience",
  });

  return (
    <SortableCrudList
      crud={crud}
      droppableId="experiences"
      align="start"
      createLabel="Add Experience"
      createClassName="grid grid-cols-1 md:grid-cols-5 gap-3 items-end"
      editClassName="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3"
      createFields={
        <>
          <CrudField label="From">
            <input type="number" name="fromYear" placeholder="2020" required className={inputClass} />
          </CrudField>
          <CrudField label="To">
            <input type="number" name="toYear" placeholder="Present (leave blank)" className={inputClass} />
          </CrudField>
          <CrudField label="Job Title">
            <input type="text" name="jobTitle" placeholder="Senior Developer" className={inputClass} required />
          </CrudField>
          <CrudField label="Company">
            <input type="text" name="company" placeholder="Tech Corp" className={inputClass} required />
          </CrudField>
        </>
      }
      renderEditFields={(item) => (
        <>
          <input
            type="number"
            name="fromYear"
            defaultValue={item.fromYear || ""}
            placeholder="2020"
            required
            className={editInputClass}
          />
          <input
            type="number"
            name="toYear"
            defaultValue={item.toYear ?? ""}
            placeholder="Present (leave blank)"
            className={editInputClass}
          />
          <input type="text" name="jobTitle" defaultValue={item.jobTitle} placeholder="Job Title" className={editInputClass} required />
          <input type="text" name="company" defaultValue={item.company} placeholder="Company" className={editInputClass} required />
          <textarea
            name="description"
            defaultValue={item.description || ""}
            placeholder="Description..."
            rows={2}
            className={`md:col-span-4 w-full ${editInputClass}`}
          />
        </>
      )}
      renderItem={(item) => (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <span className="text-gray-300">
            {item.fromYear} - {item.toYear ?? "Present"}
          </span>
          <span className="font-semibold text-white">{item.jobTitle}</span>
          <span className="text-cyan-400">{item.company}</span>
          <span className="text-gray-400 text-sm truncate">
            {item.description || "No description"}
          </span>
        </div>
      )}
    />
  );
}
