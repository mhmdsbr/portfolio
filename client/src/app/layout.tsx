import Head from 'next/head';
import type { Metadata } from "next";
import { Poppins, Roboto_Mono } from "next/font/google";
import "./globals.css";

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "Mohammad Saber Portfolio",
  description: "Web developer portfolio designed by Mo saber",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <title>Mohammad Saber | Web developer | Portfolio</title>
        <meta name="description" content="Personal portfolio website" />
      </Head>
      <body className={`${poppins.variable} ${robotoMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}