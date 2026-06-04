"use client"

import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/ui/scroll-based-velocity"

export function ScrollMarquee() {
  return (
    <div className="py-5 bg-[#0a0a0a] border-y border-white/[0.04] overflow-hidden select-none">
      <ScrollVelocityContainer>
        <ScrollVelocityRow baseVelocity={2.8} direction={1} className="mb-2.5">
          <span className="text-[13px] font-medium text-white/20 uppercase tracking-[0.2em] px-5">
            Full Stack SWE · IFMSA · Global Health · React · Next.js ·
            TypeScript · Node.js · Systems Design ·&nbsp;
          </span>
        </ScrollVelocityRow>
        <ScrollVelocityRow baseVelocity={2.8} direction={-1}>
          <span className="text-[13px] font-medium text-white/20 uppercase tracking-[0.2em] px-5">
            Hackathon Finalist · Cairo · Copenhagen · Helsinki · Dubai ·
            Open Source · Impact · McKinsey Forward ·&nbsp;
          </span>
        </ScrollVelocityRow>
      </ScrollVelocityContainer>
    </div>
  )
}
