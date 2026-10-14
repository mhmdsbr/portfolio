"use client";

import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { TestimonialsResponse } from "@/shared/types";

import styles from "./testimonials.module.css";
import { Heading } from "@/client/components/public/atoms";
import SectionLayout from "@/client/components/public/molecules/SectionLayout";
import TestimonialCard from "@/client/components/public/molecules/TestimonialCard";

const colors = ["#337BFF", "#FF5733", "#33FF57", "#FF33A1", "#8A33FF"];

export default function Testimonials({
  testimonialsData,
}: {
  testimonialsData: TestimonialsResponse;
}) {
  const sectionId = "testimonials";

  if (
    !testimonialsData ||
    !testimonialsData.items ||
    testimonialsData.items.length === 0
  ) {
    return null;
  }

  const { title, items } = testimonialsData;

  return (
    <section id={sectionId} className={styles["testimonial-slider"]}>
      <SectionLayout width="full">
      {title && (
        <Heading
          as="h2"
          size="sectionCompact"
          color="inherit"
          font="mono"
          align="center"
          spacing="bottomLarge"
        >
          {title}
        </Heading>
      )}

      <Swiper
        modules={[Autoplay]}
        slidesPerView={1}
        spaceBetween={16}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 24,
          },
          1200: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
        loop={true}
        freeMode={true}
        speed={15000}
        autoplay={{
          disableOnInteraction: false,
        }}
        className={styles["testimonial-slider__swiper"]}
      >
        {items.map((item, index) => (
          <SwiperSlide
            key={`${item.title}-${index}`}
            className={styles["testimonial-slider__slide"]}
          >
            <TestimonialCard
              testimonial={item}
              accentColor={colors[index % colors.length]}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      </SectionLayout>
    </section>
  );
}
