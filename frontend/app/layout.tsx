import type { Metadata } from "next";
import {
  Space_Grotesk,
  Geist_Mono,
} from "next/font/google";

import "./globals.css";
import { AuthProvider } from "./providers/AuthProvider";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Eventix | Futuristic University Event Ecosystem",
  description:
    "An immersive landing experience for Eventix, a futuristic university event and club ecosystem.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className={`${spaceGrotesk.className} min-h-full flex flex-col bg-black text-white`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}