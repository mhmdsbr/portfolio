"use client";

import React from "react";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Image from "next/image";
import { useAllData } from "@/hooks/useAllData";

import styles from "./testimonials.module.css";
import Link from "next/link";

const Testimonials: React.FC = () => {
  const { data: allData } = useAllData();
  const testimonialsData = allData?.testimonials;

  const colors = ["#337BFF", "#FF5733", "#33FF57", "#FF33A1", "#8A33FF"];

  // Return early if no testimonials data
  if (
    !testimonialsData ||
    !testimonialsData.items ||
    testimonialsData.items.length === 0
  ) {
    return null;
  }

  const { title, items } = testimonialsData;

  return (
    <section id="testimonial" className={styles["testimonial-slider"]}>
      {title && (
        <h2 className="text-5xl md:text-8xl font-bold text-center font-mono mb-12">
          {title}
        </h2>
      )}

      <Swiper
        modules={[Autoplay]}
        slidesPerView={3}
        spaceBetween={30}
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
            key={index}
            className={styles["testimonial-slider__slide"]}
          >
            <div
              className={styles["testimonial-item"]}
              style={{
                borderLeft: `4px solid ${colors[index % colors.length]}`,
              }}
            >
              <div className={styles["testimonial-content"]}>
                {item.content && (
                  <>
                    <p
                      className={`${styles["testimonial-quote"]} line-clamp-4`}
                    >
                      {item.content}
                    </p>
                    <Link
                      href="https://www.linkedin.com/in/mohammad-saber-20b9551a3/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mb-3 inline-block text-sm font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
                    >
                      Read more
                    </Link>
                  </>
                )}

                <div className={styles["testimonial-author"]}>
                  <div className={styles["author-info"]}>
                    {item.title && (
                      <h4 className={styles["author-name"]}>{item.title}</h4>
                    )}
                    {item.subtitle && (
                      <p className={styles["author-role"]}>{item.subtitle}</p>
                    )}
                    {item.rating && (
                      <div className={styles["author-rating"]}>
                        {"⭐".repeat(
                          Math.max(
                            0,
                            Math.min(5, Math.round(Number(item.rating) || 0)),
                          ),
                        )}
                      </div>
                    )}
                  </div>
                  {item.image && (
                    <div className={styles["author-avatar"]}>
                      <Image
                        src={item.image}
                        alt={item.title || "Testimonial"}
                        fill
                        sizes="50px"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Testimonials;
