"use client";

import { useEffect, useState } from "react";
import type { ServicesResponse } from "@/shared/types";
import useServicesScrollAnimation from "@/client/hooks/animations/useServicesScrollAnimation";
import {
  Heading,
  LoadingSpinner,
  Typography,
} from "@/client/components/public/atoms";
import SectionLayout from "@/client/components/public/molecules/SectionLayout";
import ServiceCard from "@/client/components/public/molecules/ServiceCard";

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
            <ServiceCard key={i} service={item} />
          ))}
        </div>
      </SectionLayout>
    </section>
  );
}
