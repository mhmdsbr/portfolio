"use client";

import { useRef } from "react";
import useSkillsAnimations from "@/client/hooks/animations/useSkillsAnimations";
import { Badge, Heading, Typography } from "@/client/components/public/atoms";

export default function Skills({
  skills,
}: {
  skills: Array<{ skill: string; level: number | null }>;
}) {
  const sectionRef = useRef<HTMLElement>(null);

  useSkillsAnimations(sectionRef);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative z-20 px-6 py-16 text-white"
    >
      <div className="mx-auto max-w-5xl">
        <Heading
          as="h2"
          size="sectionCompact"
          color="inherit"
          font="mono"
          align="center"
          spacing="bottomLarge"
        >
          Skills
        </Heading>
        {skills.length > 0 ? (
          <ul className="flex flex-wrap justify-center gap-3">
            {skills.map(({ skill }, index) => (
              <li key={`${skill}-${index}`} className="skill-drop">
                <Badge size="xlarge" tone="outline" className="skill-badge">
                  {skill}
                </Badge>
              </li>
            ))}
          </ul>
        ) : (
          <Typography size="base" color="muted" align="center">
            No skills added yet.
          </Typography>
        )}
      </div>
    </section>
  );
}
