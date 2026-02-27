import type { Metadata } from "next";
import NeuralFieldBackground from "@/components/NeuralFieldBackground";
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
        <NeuralFieldBackground />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
