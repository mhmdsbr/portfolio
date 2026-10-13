"use client";

import { useEffect, useState } from "react";
import type { ServicesResponse } from "@/shared/types";
import useServicesScrollAnimation from "@/client/hooks/animations/useServicesScrollAnimation";
import { FiMonitor, FiPenTool, FiPieChart } from "react-icons/fi";
import {
  Heading,
  LoadingSpinner,
  Typography,
} from "@/client/components/public/atoms";
import SectionLayout from "@/client/components/public/molecules/SectionLayout";

const iconMap: Record<string, React.ReactNode> = {
  palette: <FiMonitor className="w-12 h-12 mx-auto text-cyan-400" />,
  desktop: <FiMonitor className="w-12 h-12 mx-auto text-cyan-400" />,
  "pen-ruler": <FiPenTool className="w-12 h-12 mx-auto text-cyan-400" />,
  paintbrush: <FiPenTool className="w-12 h-12 mx-auto text-cyan-400" />,
  "chart-area": <FiPieChart className="w-12 h-12 mx-auto text-cyan-400" />,
  bullhorn: <FiPieChart className="w-12 h-12 mx-auto text-cyan-400" />,
};

const getIcon = (iconName: string) => {
  return iconMap[iconName];
};

export default function Services({ services }: { services: ServicesResponse }) {
  const [animationReady, setAnimationReady] = useState(false);

  const sectionId = "services";
  const title = services?.title;
  const content = services?.items || [];

  useEffect(() => {
    if (services) {
      setAnimationReady(true);
    }
  }, [services]);

  useServicesScrollAnimation({
    isReady: animationReady,
    itemsLength: content.length,
  });

  if (!animationReady) {
    return (
      <section id={sectionId} className="px-6 py-16 text-white">
        <SectionLayout
          width="wide"
          className="flex h-64 items-center justify-center"
        >
          <LoadingSpinner />
        </SectionLayout>
      </section>
    );
  }

  if (!services || content.length === 0) {
    return (
      <section id={sectionId} className="px-6 py-16 text-white">
        <SectionLayout width="wide" className="text-center">
          <Heading
            as="h2"
            size="sectionLarge"
            color="inherit"
            font="mono"
            spacing="topSmall"
          >
            {title}
          </Heading>
          <Typography size="base" color="muted" spacing="topLarge">
            No services available yet.
          </Typography>
        </SectionLayout>
      </section>
    );
  }

  return (
    <section
      id={sectionId}
      className="mx-auto my-10 block w-full overflow-hidden text-center"
    >
      <SectionLayout
        width="wide"
        className="my-12 flex h-full flex-col justify-center gap-6"
      >
        <Heading
          as="h2"
          size="sectionCompact"
          color="inherit"
          font="mono"
          align="center"
        >
          {title}
        </Heading>
        <div className="services-container mx-auto grid w-full grid-cols-1 gap-6 px-4 sm:grid-cols-2 md:w-10/12 md:gap-8 lg:w-10/12 xl:grid-cols-3">
          {content.map((item, i) => (
            <div
              key={i}
              className="service-card flex h-56 min-w-0 flex-col rounded-xl border border-gray-700 bg-gray-800/50 p-4 text-center backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 md:h-auto md:p-6"
            >
              <div className="mb-4 flex h-10 shrink-0 items-center justify-center md:h-12">
                {item.icon && getIcon(item.icon)}
              </div>
              <Heading
                as="h3"
                size="service"
                color="white"
                weight="bold"
                spacing="bottomMedium"
              >
                {item.title}
              </Heading>
              <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto md:items-start">
                <Typography size="inherit" color="muted" align="center">
                  {item.description}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      </SectionLayout>
    </section>
  );
}
