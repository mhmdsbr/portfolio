import { z } from "zod";
import {
  optionalInteger,
  optionalText,
  optionalUrl,
  requiredText,
} from "./common";
export const testimonialSchema = z.object({
  imageUrl: optionalUrl("Image URL", "asset"),
  title: requiredText("Testimonial title"),
  subtitle: optionalText,
  rating: optionalInteger("Rating", { min: 1, max: 5 }),
  body: optionalText,
});
