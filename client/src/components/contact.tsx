'use client';

import { useRef, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons';
import useTitleScrollAnimation from '@/hooks/animations/useTitleScrollAnimation';

export default function Contact() {
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  useTitleScrollAnimation(titleRef);

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
    console.log(formData);
  };

  return (
    <section id="contact" className="block w-full overflow-hidden mx-auto text-center">
      <div className="flex flex-col gap-6 h-full my-12 justify-center mx-auto max-w-5xl px-4">
        <h2 ref={titleRef} className="text-8xl font-bold text-center font-mono mb-12">
          <span className="word inline-block">Contact</span>{" "}
          <span className="word inline-block">Us</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-10 text-left">
          <div className="space-y-6 text-gray-700">
            <div className="flex items-start gap-3">
              <div>
                <p className="font-semibold">Email</p>
                <a href="mailto:info@example.com" className="text-sm text-blue-600 hover:underline">
                  info@example.com
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div>
                <p className="font-semibold">Phone</p>
                <a href="tel:+1234567890" className="text-sm text-blue-600 hover:underline">
                  +1 234 567 890
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div>
                <p className="font-semibold">Location</p>
                <p className="text-sm">123 Main Street, City, Country</p>
              </div>
            </div>
            <div className="pt-4">
              <p className="font-semibold mb-2">Follow Us</p>
              <div className="flex gap-4 text-primary">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <FontAwesomeIcon icon={faLinkedin} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Google">
                  <FontAwesomeIcon icon={faGoogle} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Github">
                  <FontAwesomeIcon icon={faGithub} />
                </a>
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
            <button
              type="submit"
              className="w-5/12 cursor-pointer py-2 px-4 bg-primary text-white text-left border rounded-md hover:bg-primary-dark transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
