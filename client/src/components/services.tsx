"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAllData } from "@/hooks/useAllData";

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const { data: allData, isLoading } = useAllData();
  const [animationReady, setAnimationReady] = useState(false);

  const services = allData?.services
  const title = services?.title;
  const content = services?.items;


  useEffect(() => {
    if (!isLoading && services) {
      setAnimationReady(true);
    }
  }, [services, isLoading]);

  useEffect(() => {
    if (!animationReady) return;

    const cards = gsap.utils.toArray(".service-card");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".services-container",
        start: "20% bottom",
        end: "200px 70%",
        scrub: 1,
        toggleActions: "play none none none",
      },
    });

    // Initial state
    gsap.set(cards, { y: 50, opacity: 0 });

    // Add staggered animation to timeline
    tl.to(cards, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 1,
      ease: "power2.out",
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [animationReady]);

  return (
    <section
      id="services"
      className="block w-full overflow-hidden mx-auto my-10 text-center"
    >
      <div className="flex flex-col gap-6 h-full my-12 justify-center mx-auto">
        <h2 className="flex justify-center text-8xl font-bold text-center font-mono">
          {title}
        </h2>
        <div className="services-container container w-8/12 flex gap-10 mx-auto">
          {Array.isArray(content) &&
            content.map((item, i) => (
              <div
                key={i}
                className="service-card p-5 rounded-xl border-1 border-gray-700"
              >
                <span>Icon</span>
                <h3 className="text-left font-bold text-2xl mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-left">
                  {item.content}
                </p>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
