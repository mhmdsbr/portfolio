"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import useHeaderAnimations from "@/client/hooks/animations/useHeaderAnimations";
import type { HeaderResponse } from "@/shared/types";

interface HeaderProps {
  singleTitle?: string;
  headerData: HeaderResponse;
}

export default function Header({ singleTitle, headerData }: HeaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const expandRef = useRef<HTMLDivElement>(null);
  const reloadTextRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);


  const sections = useMemo(
    () =>
      headerData?.sections?.filter((section) => section.isEnabled).map((s) => ({
        id: s.kind,
        title: s.navigationTitle,
      })) || [],
    [headerData],
  );

  const [isReady, setIsReady] = useState(false);

  const [currentTitle, setCurrentTitle] = useState("");

  useEffect(() => {
    if (singleTitle) {
      setIsReady(true);
      setCurrentTitle(singleTitle);
      return;
    }

    if (
      headerData &&
      headerData.sections &&
      headerData.sections.length > 0
    ) {
      setIsReady(true);
      setCurrentTitle(headerData.sections[0].navigationTitle);
    }
  }, [headerData, singleTitle]);

  useHeaderAnimations({
    containerRef,
    headerRef,
    expandRef,
    reloadTextRef,
    titleRef,
    setCurrentTitle,
    sections: isReady ? sections : [],
    isReady,
  });


  return (
    <header
      ref={containerRef}
      className="flex justify-center w-full opacity-0 z-50"
    >
      <div
        ref={headerRef}
        className="flex justify-center w-full py-4 text-xl fixed lg:text-2xl font-semibold px-10 cursor-pointer top-0 z-50"
      >
        <span className="flex items-baseline">
          &lt;
          <span ref={titleRef} className="px-2">
            {currentTitle}
          </span>
          <div
            ref={expandRef}
            className="whitespace-nowrap text-primary-orange overflow-hidden max-w-0 opacity-0 border-r-2 border-r-transparent"
          >
            <span ref={reloadTextRef}>onClick=&#123;reload&#125;</span>
          </div>
          <span className="text-purple-500">/&gt;</span>
        </span>
      </div>
    </header>
  );
}
