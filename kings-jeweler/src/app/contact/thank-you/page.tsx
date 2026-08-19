import { Metadata } from "next";
import { Suspense } from "react";
import { ThankYouClient } from "./ThankYouClient";

export const metadata: Metadata = {
  title: "Thank You for Contacting Us | King's Jeweler",
  description:
    "Thank you for your inquiry! Our team will respond within 72 hours. In the meantime, you can schedule a call to talk through your event.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouPage() {
  return (
    <Suspense fallback={null}>
      <ThankYouClient />
    </Suspense>
  );
}
