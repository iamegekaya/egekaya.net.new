"use client";

import { useRouter } from "next/navigation";

import ProfileCard from "@/components/profile/profile-card";

export default function HomeProfileCard() {
  const router = useRouter();

  return (
    <ProfileCard
      name="Ege Kaya"
      titleLines={[
        "Cybersecurity Enthusiast",
        "System & Security Automation",
        "AI Workflow Enthusiast",
        "Vibe Coder",
      ]}
      handle="iamegekaya"
      status="Online"
      contactText="Contact"
      onContactClick={() => {
        router.push("/contact");
      }}
      behindGlowColor="hsla(277, 100%, 70%, 0.6)"
      innerGradient="linear-gradient(145deg,hsla(277, 40%, 45%, 0.55) 0%,hsla(113, 60%, 70%, 0.27) 100%)"
    />
  );
}
