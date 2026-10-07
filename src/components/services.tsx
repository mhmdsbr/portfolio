"use client";

import { useEffect, useState } from "react";
import { useAllData } from "@/hooks/useAllData";
import useServicesScrollAnimation from "@/hooks/animations/useServicesScrollAnimation";
import { FiMonitor, FiPenTool, FiPieChart } from "react-icons/fi";

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

export default function Services() {
  const { data: allData, isLoading } = useAllData();
  const [animationReady, setAnimationReady] = useState(false);

  const services = allData?.services;
  const sectionId = "services";
  const title = services?.title;
  const content = services?.items || [];

  useEffect(() => {
    if (!isLoading && services) {
      setAnimationReady(true);
    }
  }, [services, isLoading]);

  useServicesScrollAnimation({
    isReady: animationReady,
    itemsLength: content.length,
  });

  if (isLoading || !animationReady) {
    return (
      <section id={sectionId} className="px-6 py-16 text-white">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      </section>
    );
  }

  if (!services || content.length === 0) {
    return (
      <section id={sectionId} className="px-6 py-16 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold font-mono mt-2">
            {title}
          </h2>
          <p className="text-gray-400 mt-8">No services available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id={sectionId}
      className="block w-full overflow-hidden mx-auto my-10 text-center"
    >
      <div className="flex flex-col gap-6 h-full my-12 justify-center mx-auto">
        <h2 className="flex justify-center text-4xl md:text-6xl font-bold text-center font-mono relative z-10">
          {title}
        </h2>
        <div className="services-container container mx-auto grid w-full grid-cols-1 gap-6 px-4 sm:grid-cols-2 md:w-10/12 md:gap-8 lg:w-10/12 xl:grid-cols-3">
          {content.map((item, i) => (
            <div
              key={i}
              className="service-card flex h-56 min-w-0 flex-col rounded-xl border border-gray-700 bg-gray-800/50 p-4 text-center backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 md:h-auto md:p-6"
            >
              <div className="mb-4 flex h-10 shrink-0 items-center justify-center md:h-12">
                {item.icon && getIcon(item.icon)}
              </div>
              <h3 className="mb-4 shrink-0 text-lg font-bold text-white md:text-2xl">
                {item.title}
              </h3>
              <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto md:items-start md:justify-start">
                <p className="text-gray-400">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
