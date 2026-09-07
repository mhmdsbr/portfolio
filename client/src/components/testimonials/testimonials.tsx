"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useAllData } from "@/hooks/useAllData";

import styles from "./testimonials.module.css";

const Testimonials: React.FC = () => {
  const { data: allData } = useAllData();
  const testimonialsData = allData?.testimonials;

  const colors = ["#337BFF", "#FF5733", "#33FF57", "#FF33A1", "#8A33FF"];

  // Return early if no testimonials data
  if (!testimonialsData || !testimonialsData.items || testimonialsData.items.length === 0) {
    return null;
  }

  const { title, overlay_title, items } = testimonialsData;

  return (
    <section id="testimonial" className={styles["testimonial-slider"]}>
      {/* Optional: Add title section */}
      {(title || overlay_title) && (
        <div className={styles["testimonial-header"]}>
          {overlay_title && (
            <span className={styles["testimonial-overlay-title"]}>
              {overlay_title}
            </span>
          )}
          {title && (
            <h2 className={styles["testimonial-title"]}>
              {title}
            </h2>
          )}
        </div>
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
                {/* Render content if available */}
                {item.content && (
                  <p className={styles["testimonial-quote"]}>
                    {item.content}
                  </p>
                )}
                
                <div className={styles["testimonial-author"]}>
                  <div className={styles["author-info"]}>
                    {item.title && (
                      <h4 className={styles["author-name"]}>
                        {item.title}
                      </h4>
                    )}
                    {item.subtitle && (
                      <p className={styles["author-role"]}>{item.subtitle}</p>
                    )}
                    {item.rating && (
                      <div className={styles["author-rating"]}>
                        {"⭐".repeat(Number(item.rating) || 0)}
                      </div>
                    )}
                  </div>
                  {item.image && (
                    <div className={styles["author-avatar"]}>
                      <img src={item.image} alt={item.title || "Testimonial"} />
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