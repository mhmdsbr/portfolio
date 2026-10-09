"use client";

import {
  createSkill,
  updateSkill,
  deleteSkill,
  reorderSkills,
} from "@/actions/experience";
import { useCrudList } from "./crud/useCrudList";
import SortableCrudList, { CrudField, inputClass } from "./crud/SortableCrudList";

interface Skill {
  id: number;
  skill: string;
  level: number | null;
  sortOrder: number | null;
}

interface SkillsFormProps {
  skills: Skill[];
}

const compactEditClass =
  "px-2 py-1 bg-gray-700 border border-cyan-500 rounded text-white focus:outline-none";

export default function SkillsForm({ skills }: SkillsFormProps) {
  const crud = useCrudList({
    items: skills,
    actions: {
      create: createSkill,
      update: updateSkill,
      remove: deleteSkill,
      reorder: reorderSkills,
    },
    noun: "skill",
  });

  return (
    <SortableCrudList
      crud={crud}
      droppableId="skills"
      createLabel="Add Skill"
      createClassName="flex gap-3 items-end"
      rowClassName="p-3"
      editClassName="flex-1 flex items-center gap-3"
      createFields={
        <>
          <CrudField label="Skill" className="flex-1">
            <input type="text" name="skill" placeholder="JavaScript" className={inputClass} required />
          </CrudField>
          <CrudField label="Level (1-100)" className="w-32">
            <input type="number" name="level" placeholder="90" min="1" max="100" className={inputClass} required />
          </CrudField>
        </>
      }
      renderEditFields={(item) => (
        <>
          <input
            type="text"
            name="skill"
            defaultValue={item.skill}
            placeholder="Skill"
            className={`flex-1 ${compactEditClass}`}
            required
          />
          <input
            type="number"
            name="level"
            defaultValue={item.level || ""}
            placeholder="Level"
            min="1"
            max="100"
            className={`w-24 ${compactEditClass}`}
            required
          />
        </>
      )}
      renderItem={(item) => (
        <div className="flex items-center gap-3">
          <span className="flex-1 text-white">{item.skill}</span>
          <div className="flex items-center gap-3 w-48">
            <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all"
                style={{ width: `${item.level || 0}%` }}
              />
            </div>
            <span className="text-sm text-gray-400 w-8">{item.level || 0}%</span>
          </div>
        </div>
      )}
    />
  );
}
