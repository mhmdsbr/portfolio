'use client';

import { useRef, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBehance,
  faDribbble,
  faFacebook,
  faGithub,
  faInstagram,
  faLinkedin,
  faMedium,
  faTelegram,
  faWhatsapp,
  faXTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import useTitleScrollAnimation from '@/client/hooks/animations/useTitleScrollAnimation';
import type { ContactResponse } from '@/shared/types';
import { Button, Heading, Typography } from "@/client/components/public/atoms";
import SectionLayout from "@/client/components/public/molecules/SectionLayout";

type ContactSocialPlatform = ContactResponse["socialLinks"][number]["platform"];

const socialIcons: Record<ContactSocialPlatform, IconDefinition> = {
  behance: faBehance,
  dribbble: faDribbble,
  facebook: faFacebook,
  github: faGithub,
  instagram: faInstagram,
  linkedin: faLinkedin,
  mail: faEnvelope,
  medium: faMedium,
  telegram: faTelegram,
  twitter: faXTwitter,
  whatsapp: faWhatsapp,
  youtube: faYoutube,
};

export default function Contact({ contact }: { contact: ContactResponse }) {
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  useTitleScrollAnimation(titleRef);

  const sectionId = "contact";

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const titleWords = contact?.title?.split(' ') || [];

  return (
    <section id={sectionId} className="block w-full overflow-hidden mx-auto text-center">
      <SectionLayout
        width="standard"
        className="my-12 flex h-full flex-col justify-center gap-6 px-4"
      >
        <Heading
          as="h2"
          size="sectionCompact"
          color="inherit"
          font="mono"
          align="center"
          spacing="bottomLarge"
          ref={titleRef}
        >
          {titleWords.map((word, i) => (
            <span key={i} className="word inline-block mx-2">
              {word}
            </span>
          ))}
        </Heading>

        <div className="grid md:grid-cols-2 gap-10 text-left">
          <div className="space-y-6 text-gray-700">
            {contact?.methods.map((method) => (
              <div key={method.id} className="flex items-start gap-3">
                <div>
                  <Typography size="inherit" color="inherit" weight="semibold">
                    {method.title}
                  </Typography>
                  {method.kind === 'email' ? (
                    <a href={`mailto:${method.value.replace(/^mailto:/i, '')}`} className="text-sm text-white hover:underline">
                      {method.value.replace(/^mailto:/i, '')}
                    </a>
                  ) : method.kind === 'phone' ? (
                    <a href={`tel:${method.value.replace(/^tel:/i, '')}`} className="text-sm text-white hover:underline">
                      {method.value}
                    </a>
                  ) : (
                    <Typography size="sm" color="white">
                      {method.value}
                    </Typography>
                  )}
                </div>
              </div>
            ))}
            <div className="pt-4">
              <Typography
                size="inherit"
                color="inherit"
                weight="semibold"
                spacing="bottomSmall"
              >
                Follow me
              </Typography>
              <div className="flex gap-4 text-primary">
                {contact.socialLinks.map(({ platform, url }) => (
                  <a
                    key={platform}
                    href={url}
                    className="text-white"
                    target={url.startsWith("http") ? "_blank" : undefined}
                    rel={url.startsWith("http") ? "noopener noreferrer" : undefined}
                    aria-label={platform}
                  >
                    <FontAwesomeIcon icon={socialIcons[platform]} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
              <input
                type="text"
                name="subject"
                id="subject"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
              <textarea
                name="message"
                id="message"
                rows={4}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.message}
                onChange={handleChange}
              />
            </div>
            <Button
              variant="primary"
              type="submit"
            >
              {contact?.button.text}
            </Button>
          </form>
        </div>
      </SectionLayout>
    </section>
  );
}