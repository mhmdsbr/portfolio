import type { ReactNode } from "react";
import { FiMonitor, FiPenTool, FiPieChart } from "react-icons/fi";
import type { ServiceIcon, ServicesResponse } from "@/shared/types";
import { Heading, Typography } from "@/client/components/public/atoms";

type Service = ServicesResponse["items"][number];

const iconMap: Record<ServiceIcon, ReactNode> = {
  palette: <FiMonitor className="mx-auto h-12 w-12 text-cyan-400" />,
  desktop: <FiMonitor className="mx-auto h-12 w-12 text-cyan-400" />,
  "pen-ruler": <FiPenTool className="mx-auto h-12 w-12 text-cyan-400" />,
  paintbrush: <FiPenTool className="mx-auto h-12 w-12 text-cyan-400" />,
  "chart-area": <FiPieChart className="mx-auto h-12 w-12 text-cyan-400" />,
  bullhorn: <FiPieChart className="mx-auto h-12 w-12 text-cyan-400" />,
};

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="service-card flex h-56 min-w-0 flex-col rounded-xl border border-gray-700 bg-gray-800/50 p-4 text-center backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 md:h-auto md:p-6">
      <div className="mb-4 flex h-10 shrink-0 items-center justify-center md:h-12">
        {service.icon && iconMap[service.icon]}
      </div>
      <Heading
        as="h3"
        size="service"
        color="white"
        weight="bold"
        spacing="bottomMedium"
      >
        {service.title}
      </Heading>
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto md:items-start">
        <Typography size="inherit" color="muted" align="center">
          {service.description}
        </Typography>
      </div>
    </div>
  );
}
