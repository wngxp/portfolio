import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Biomedical Engineering Portfolio",
  description:
    "Biomedical Engineering student focused on biosignals and machine learning for wearable and rehab robotics."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
