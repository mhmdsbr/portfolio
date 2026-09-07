"use client";

import Image from "next/image";
import { RefObject } from "react";

interface HeroBadgeProps {
  logo: string | null;
  location: string | null;
  subtitleOne: string | null;
  subtitleTwo: string | null;
  descriptionRef: RefObject<HTMLParagraphElement | null>;
}

export default function HeroBadge({
  logo,
  location,
  subtitleOne,
  subtitleTwo,
  descriptionRef
}: HeroBadgeProps) {
  return (
    <div className="flex justify-center items-center h-16 text-white uppercase font-medium absolute left-auto lg:left-4 bottom-20 z-10">
      <div className="flex items-center bg-primary-cyan h-full border-r-1 rounded-l-xs border-white p-3 z-20">
        <Image
          src={logo}
          width={40}
          height={40}
          alt="Author's logo"
          style={{ width: "40px", height: "40px" }}
        />
      </div>
      <div className="flex items-center bg-primary-orange h-full border-r-1 border-white p-2 z-20">
        <p>{location}</p>
      </div>
      <div className="flex items-center bg-primary-purple h-full border-white p-2 z-20">
        <p>{subtitleOne}</p>
      </div>
      <div
        ref={descriptionRef}
        className="items-center bg-white text-black h-full border-r-6 rounded-r-md border-primary-cyan p-2 z-0 opacity-0 flex"
      >
        <p>{subtitleTwo}</p>
      </div>
    </div>
  );
}