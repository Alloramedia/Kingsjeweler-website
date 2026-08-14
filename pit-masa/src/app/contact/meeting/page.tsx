import { Metadata } from "next";
import { MeetingClient } from "./MeetingClient";

export const metadata: Metadata = {
  title: "Schedule a Consultation — Kings Jeweler",
  description:
    "Schedule a consultation with Kings Jeweler. Give us a call or send a message and we'll help with your jewelry, repair, or custom design.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MeetingPage() {
  return <MeetingClient />;
}
