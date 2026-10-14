import type { ExperienceResponse } from "@/shared/types";
import { Heading, Typography } from "@/client/components/public/atoms";

type ExperienceItem = ExperienceResponse["experiences"][number];

interface ExperienceCardProps {
  experience: ExperienceItem;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <div className="experience-item rounded-2xl border border-gray-700 bg-linear-to-br from-gray-900 to-gray-800 p-6 shadow-lg">
      <Heading as="h3" size="xl" color="inherit" weight="semibold">
        {experience.title} @ {experience.company}
      </Heading>
      <Typography size="sm" color="muted" spacing="bottomSmall">
        {experience.from} - {experience.to ?? "Present"}
      </Typography>
      <Typography size="base" color="inherit">
        {experience.description}
      </Typography>
    </div>
  );
}
