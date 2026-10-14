'use client';

import { useRef, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
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
import { submitContactMessage } from "@/server/actions/public/contact";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');
    setFormSuccess(false);

    try {
      const result = await submitContactMessage(formData);
      if (!result.success) {
        setFormError(result.error);
        return;
      }

      setFormData({ name: '', email: '', subject: '', message: '' });
      setFormSuccess(true);
    } catch (error) {
      console.error('Public contact form submission failed:', error);
      setFormError('Unable to send your message right now. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
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
                    <Link href={`mailto:${method.value.replace(/^mailto:/i, '')}`} className="text-sm text-white hover:underline">
                      {method.value.replace(/^mailto:/i, '')}
                    </Link>
                  ) : method.kind === 'phone' ? (
                    <Link href={`tel:${method.value.replace(/^tel:/i, '')}`} className="text-sm text-white hover:underline">
                      {method.value}
                    </Link>
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
                  <Link
                    key={platform}
                    href={url}
                    className="text-white"
                    target={url.startsWith("http") ? "_blank" : undefined}
                    rel={url.startsWith("http") ? "noopener noreferrer" : undefined}
                    aria-label={platform}
                  >
                    <FontAwesomeIcon icon={socialIcons[platform]} aria-hidden="true" />
                  </Link>
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
                maxLength={100}
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
                maxLength={254}
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
                maxLength={200}
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
                maxLength={10000}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.message}
                onChange={handleChange}
              />
            </div>
            {formError && (
              <p role="alert" className="text-sm text-red-400">
                {formError}
              </p>
            )}
            {formSuccess && (
              <p role="status" className="text-sm text-green-400">
                Your message has been sent. Thank you for reaching out.
              </p>
            )}
            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : contact?.button.text || 'Send message'}
            </Button>
          </form>
        </div>
      </SectionLayout>
    </section>
  );
}