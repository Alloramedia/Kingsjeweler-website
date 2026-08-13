import { Metadata } from "next";
import { MeetingClient } from "./MeetingClient";

export const metadata: Metadata = {
  title: "Schedule a Consultation — Pit & Masa",
  description:
    "Schedule a consultation with Pit & Masa. Pick a time that works for you and we'll connect to discuss your event and menu.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MeetingPage() {
  return <MeetingClient />;
}
