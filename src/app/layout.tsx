import type { Metadata } from "next";
import EMGBackground from "@/components/EMGBackground";
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
      <body className="relative isolate overflow-x-hidden">
        <EMGBackground />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
