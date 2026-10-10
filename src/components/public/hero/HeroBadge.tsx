"use client";

import Image from "next/image";
import Link from "next/link";
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
  descriptionRef,
}: HeroBadgeProps) {
  return (
    <div className="absolute bottom-8 left-0 z-10 flex h-14 w-full max-w-full items-center justify-start overflow-hidden text-[10px] font-medium uppercase text-white sm:bottom-20 sm:h-16 sm:w-fit sm:text-xs md:text-sm lg:left-4">
      <div className="z-20 flex h-full shrink-0 items-center rounded-l-xs border-r-1 border-white bg-primary-cyan p-2 sm:p-3">
        {logo ? (
          <Image
            src={logo}
            width={40}
            height={40}
            alt="Author's logo"
            className="h-8 w-8 object-contain sm:h-10 sm:w-10"
          />
        ) : null}
      </div>
      <div className="z-20 flex h-full min-w-0 max-w-[22vw] items-center border-r-1 border-white bg-primary-orange px-2 sm:max-w-none sm:px-3">
        <p className="truncate">{location}</p>
      </div>
      <div className="z-20 flex h-full min-w-0 max-w-[24vw] items-center border-white bg-primary-purple px-2 sm:max-w-none sm:px-3">
        <p className="truncate">{subtitleOne}</p>
      </div>
      <div
        ref={descriptionRef}
        className="z-0 flex h-full min-w-0 max-w-[30vw] items-center rounded-r-md border-r-6 border-primary-cyan bg-white px-2 text-black opacity-100 sm:max-w-none sm:px-3 lg:opacity-0"
      >
        <Link href="/cv.pdf" className="truncate">{subtitleTwo}</Link>
      </div>
    </div>
  );
}
