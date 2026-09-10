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
  const title = services?.title;
  const overlayTitle = services?.overlay_title;
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
      <section id="services" className="px-6 py-16 text-white">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      </section>
    );
  }

  if (!services || content.length === 0) {
    return (
      <section id="services" className="px-6 py-16 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <span className="text-sm uppercase tracking-wider text-gray-400">
            {overlayTitle || "Services"}
          </span>
          <h2 className="text-5xl md:text-7xl font-bold font-mono mt-2">
            {title || "Services"}
          </h2>
          <p className="text-gray-400 mt-8">No services available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="services"
      className="block w-full overflow-hidden mx-auto my-10 text-center"
    >
      <div className="flex flex-col gap-6 h-full my-12 justify-center mx-auto">
        <h2 className="flex justify-center text-5xl md:text-8xl font-bold text-center font-mono relative z-10">
          {title}
        </h2>
        <div className="services-container container w-full md:w-10/12 lg:w-8/12 flex flex-col md:flex-row gap-6 md:gap-10 mx-auto px-4">
          {content.map((item, i) => (
            <div
              key={i}
              className="service-card flex-1 p-6 rounded-xl border border-gray-700 bg-gray-800/50 backdrop-blur-sm flex flex-col text-center hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-500/10"
            >
              <div className="mb-4">{item.icon && getIcon(item.icon)}</div>
              <h3 className="font-bold text-2xl mb-4 text-white">
                {item.title}
              </h3>
              <p className="text-gray-400 flex-1">{item.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
