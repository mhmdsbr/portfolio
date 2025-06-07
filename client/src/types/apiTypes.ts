import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { API_CONFIG } from "@/lib/api-config";

export interface Hero {
  titles: string[];
  logo: string | StaticImport;
  location: string;
  subtitle_one: string;
  subtitle_two: string;
}

export interface About {
  about_title: string;
  about_description: string;
}

export interface Experience {
  summary_title: string;
}

export type EndpointMap = {
  [API_CONFIG.endpoints.hero]: Hero;
  [API_CONFIG.endpoints.about]: About;
  [API_CONFIG.endpoints.experience]: Experience;
};