import Image from "next/image";
import Link from "next/link";
import type { TestimonialsResponse } from "@/shared/types";
import { Heading, Typography } from "@/client/components/public/atoms";
import styles from "./TestimonialCard.module.css";

type Testimonial = TestimonialsResponse["items"][number];

interface TestimonialCardProps {
  testimonial: Testimonial;
  accentColor: string;
}

export default function TestimonialCard({
  testimonial,
  accentColor,
}: TestimonialCardProps) {
  return (
    <div
      className={styles["testimonial-item"]}
      style={{ borderLeft: `4px solid ${accentColor}` }}
    >
      <div className={styles["testimonial-content"]}>
        {testimonial.body && (
          <>
            <p className={`${styles["testimonial-quote"]} line-clamp-4`}>
              {testimonial.body}
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
            {testimonial.title && (
              <Heading
                as="h4"
                size="inherit"
                color="inherit"
                weight="inherit"
              >
                {testimonial.title}
              </Heading>
            )}
            {testimonial.subtitle && (
              <Typography size="inherit" color="inherit">
                {testimonial.subtitle}
              </Typography>
            )}
            {testimonial.rating && (
              <div className={styles["author-rating"]}>
                {"⭐".repeat(
                  Math.max(0, Math.min(5, Math.round(testimonial.rating))),
                )}
              </div>
            )}
          </div>
          {testimonial.image && (
            <div className={styles["author-avatar"]}>
              <Image
                src={testimonial.image}
                alt={testimonial.title || "Testimonial"}
                fill
                sizes="50px"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
