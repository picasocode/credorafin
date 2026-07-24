"use client";

import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface LottieSectionProps {
  src: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
}

export function LottieAnimation({
  src,
  className = "",
  loop = true,
  autoplay = true,
  speed = 1,
}: LottieSectionProps) {
  return (
    <DotLottieReact
      src={src}
      loop={loop}
      autoplay={autoplay}
      speed={speed}
      className={className}
    />
  );
}

// Pre-defined Lottie animations mapped to common themes
export const LOTTIE_URLS = {
  // Business & Finance
  businessGrowth: "https://lottie.host/8f286f4e-49d6-4d86-8818-7e1a7c607d5c/zGhOOshhnD.lottie",
  moneyFlow: "https://lottie.host/b6e2e7ab-3a57-4ffb-8c44-631c08faf2df/xt2pJXMN2H.lottie",
  handshake: "https://lottie.host/a23e3078-d1f7-4a09-8334-bdc3089ff804/VgwSnYWtlK.lottie",
  chartUp: "https://lottie.host/4e4e8a5c-4cf8-4f69-8b75-479a4ef412ec/AoqvbYtWSE.lottie",
  shield: "https://lottie.host/5dd44a1e-d11a-47cd-8060-e3e6892d0cd6/2bDjJtGEMj.lottie",
  
  // Process & Workflow
  documentProcessing: "https://lottie.host/2e661b5d-8f3c-4e26-8237-6ef4a7f8083a/JEpJQJXkON.lottie",
  analytics: "https://lottie.host/e7a8c2b3-3c5e-4a57-972a-7e3cc4ae59e7/3pGZdSbCGa.lottie",
  success: "https://lottie.host/1c05d67e-b926-4705-8b38-ad3e6b7ec9f0/TSSjOUCBQb.lottie",
  loading: "https://lottie.host/78d5dd8b-f4f2-4684-9d76-63724f485728/uOFJy0Vp2B.lottie",
  
  // Objects & Concepts
  factory: "https://lottie.host/d5c49868-09e8-4c9d-b8a1-4e2f2c5c025d/i9yVgDkJHp.lottie",
  globe: "https://lottie.host/6a9e22a7-4a73-4c8c-a34a-6e57ff4fc8d2/3pEeuVvLEy.lottie",
  building: "https://lottie.host/7b8e0c5d-6f07-4879-9ed2-2c827c0b3c94/0UwYaQMTaI.lottie",
  
  // People & Communication
  teamWork: "https://lottie.host/e5f3e2e5-62a6-4ea6-8e8a-a9d2c7e58f7b/TLTuDmHCIM.lottie",
  support: "https://lottie.host/0e3c0b1b-6c8a-4c10-9db6-0a5b8b1db33e/pZPKjXSnOl.lottie",
  
  // Abstract
  pulse: "https://lottie.host/d7e4d51a-4db0-4d8e-9b5d-47c5f9c1a4d3/CjNqmTLm2U.lottie",
  wave: "https://lottie.host/a1b2c3d4-e5f6-7890-abcd-ef1234567890/placeholder.lottie",
};
