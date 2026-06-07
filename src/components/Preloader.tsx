"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Vortex } from "@/components/ui/vortex";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { EncryptedText } from "@/components/ui/encrypted-text";
import { CursorEffects } from "@/components/CursorEffects";

const LOADING_MESSAGES = [
  "INITIALIZING WEBGL SUBSYSTEMS...",
  "ESTABLISHING SECURE CONNECTION...",
  "LOADING 3D ASSETS...",
  "BYPASSING PROTOCOLS...",
  "PREPARING ENVIRONMENT...",
  "READY."
];

export function Preloader() {
  const [loading, setLoading] = useState(true);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [messagesLog, setMessagesLog] = useState<string[]>([LOADING_MESSAGES[0]]);
  const [hoverType, setHoverType] = useState<"none" | "window-controls" | "title-name" | "loader-ring" | "terminal-text">("none");
  const [chargeLevel, setChargeLevel] = useState(0);
  const chargeLevelRef = useRef(0);

  const updateCharge = (value: number | ((prev: number) => number)) => {
    setChargeLevel((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      chargeLevelRef.current = next;
      return next;
    });
  };

  useEffect(() => {
    // Skip entirely for users who prefer reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = setTimeout(() => {
        setPrefersReduced(true);
        setLoading(false);
      }, 0);
      return () => clearTimeout(id);
    }

    // Lock scroll and ensure we start at the top
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    const duration = 3000; // 3 seconds of sensory overload
    const intervalTime = 30;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const rawProgress = currentStep / steps;
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - rawProgress, 3);
      const displayCount = Math.min(100, Math.floor(easedProgress * 100));
      
      setProgress(displayCount);

      // Determine current message based on progress percentage
      const nextMessageIndex = Math.min(
        LOADING_MESSAGES.length - 1,
        Math.floor((displayCount / 100) * LOADING_MESSAGES.length)
      );
      
      setMessageIndex((prev) => {
        if (prev !== nextMessageIndex) {
          setMessagesLog((log) => [...log, LOADING_MESSAGES[nextMessageIndex]]);
          return nextMessageIndex;
        }
        return prev;
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setTimeout(() => {
          setLoading(false);
          setTimeout(() => {
             document.body.style.overflow = "";
          }, 800);
        }, 400); // Pause briefly at 100%
      }
    }, intervalTime);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={prefersReduced ? {
            opacity: 0,
            transition: { duration: 0.25 },
          } : {
            opacity: [1, 1, 0],
            scale: [1, 0.98, 12],
            filter: ["blur(0px)", "blur(0px)", "blur(40px) brightness(4) contrast(2)"],
            rotate: [0, -1, 5],
            transition: {
              duration: 1.2,
              ease: [0.8, 0, 0.1, 1],
              times: [0, 0.3, 1]
            }
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#050505] overflow-hidden select-none cursor-none"
        >
          {/* The main screen background is now pure black */}
          
           {/* Full Screen Apple Terminal Window - Shakes under click intensity */}
          <motion.div 
            animate={chargeLevel > 5 ? {
              x: chargeLevel > 12 
                ? [0, -3.5, 3.5, -1.8, 1.8, -3.5, 3.5, 0] 
                : [0, -1.2, 1.2, -0.6, 0.6, -1.2, 1.2, 0],
              y: chargeLevel > 12 
                ? [0, 2.5, -2.5, 1.8, -1.8, 2.5, -2, 0] 
                : [0, 0.8, -1, 0.6, -0.6, 1, -0.8, 0],
            } : { x: 0, y: 0 }}
            transition={chargeLevel > 5 ? {
              repeat: Infinity,
              duration: 0.12,
              ease: "linear"
            } : {}}
            className="relative z-10 w-full h-full flex flex-col bg-[#020202] overflow-hidden cursor-none"
          >
            
            {/* Background Animations INSIDE the Terminal */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
              <FlickeringGrid 
                squareSize={4}
                gridGap={6}
                color="#3b82f6"
                maxOpacity={0.4 + (chargeLevel / 20) * 0.4}
                flickerChance={0.15 + (chargeLevel / 20) * 0.45}
              />
            </div>
            <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
              <Vortex
                backgroundColor="transparent"
                baseHue={260} // Adjusted hue to be more purple/blue to match "purple points"
                particleCount={400}
                baseSpeed={0.5 + (progress / 100) * 2 + (chargeLevel / 20) * 4}
              />
            </div>

            {/* macOS Title Bar */}
            <div className="relative z-20 flex items-center px-4 h-12 border-b border-white/10 bg-black/40 backdrop-blur-md">
              <div 
                className="flex gap-2 cursor-none pointer-events-auto"
                onMouseEnter={() => setHoverType("window-controls")}
                onMouseLeave={() => setHoverType("none")}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-[#1aab29]" />
              </div>
              <div className="flex-1 text-center text-white/40 text-xs font-mono font-medium tracking-wider">
                mostafa@macbook-pro:~ — bash — 80x24
              </div>
              <div className="w-14" /> {/* Spacer for centering */}
            </div>

            {/* Terminal Content Body */}
            <div className="flex-1 relative z-20 flex flex-col items-center justify-center p-4 overflow-hidden">
              
              {/* Terminal Logs (Positioned absolutely in top-left, hidden on small screens to prevent overlap) */}
              <div 
                className="absolute top-16 left-6 z-20 hidden md:flex flex-col gap-2.5 font-mono text-[11px] text-blue-400/80 tracking-widest pointer-events-auto cursor-none max-w-lg opacity-70"
                onMouseEnter={() => setHoverType("terminal-text")}
                onMouseLeave={() => setHoverType("none")}
              >
                 {messagesLog.map((msg, idx) => (
                   <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                     <span className="text-white/40 mr-2 tracking-normal">mostafa@macbook-pro ~ %</span>
                     <span className="text-cyan-400">./initialize.sh</span>
                     <div className="mt-1 ml-4">
                       <span className="text-white/30 mr-2">{">"}</span>
                       <EncryptedText text={msg} revealDelayMs={20} encryptedClassName="text-white/20" />
                     </div>
                   </motion.div>
                 ))}
              </div>

              {/* Centered Graphic (Perfect flex centering, responsive sizes) */}
              <div className="flex flex-col items-center justify-center pointer-events-none w-full max-w-xl">
                <motion.div
                  initial={{ opacity: 0, filter: "blur(12px)", scale: 0.9 }}
                  animate={{ 
                    opacity: 1, 
                    filter: "blur(0px)", 
                    scale: 1,
                    skewX: chargeLevel > 12 ? [0, -6, 6, -3, 0] : 0,
                    skewY: chargeLevel > 12 ? [0, 2, -2, 0] : 0
                  }}
                  transition={{ 
                    opacity: { duration: 1.2, ease: "easeOut" },
                    skewX: chargeLevel > 12 ? { repeat: Infinity, duration: 0.15, ease: "linear" } : {},
                    skewY: chargeLevel > 12 ? { repeat: Infinity, duration: 0.2, ease: "linear" } : {}
                  }}
                  onMouseEnter={() => setHoverType("title-name")}
                  onMouseLeave={() => setHoverType("none")}
                  className="text-[clamp(2rem,5.5vw,4.5rem)] font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 mb-6 sm:mb-8 text-center select-none cursor-none pointer-events-auto"
                  style={{
                    textShadow: chargeLevel > 10
                      ? `0 0 12px #ff007f, -3.5px -2px 0px #06b6d4, 3.5px 2px 0px #a855f7`
                      : chargeLevel > 4
                      ? `0 0 ${progress * 0.4 + 10}px rgba(59, 130, 246, 0.75)`
                      : `0 0 ${progress * 0.4}px rgba(59, 130, 246, ${progress / 100})`
                  }}
                >
                  Mostafa Yaser
                </motion.div>
            
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="flex flex-col items-center gap-6"
                >
                  {/* Sci-Fi HUD Progress Ring - Responsive scale */}
                  <div 
                    className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center rounded-full cursor-none pointer-events-auto"
                    onMouseEnter={() => setHoverType("loader-ring")}
                    onMouseLeave={() => setHoverType("none")}
                    style={{
                      boxShadow: `0 0 ${progress * 0.6}px rgba(59, 130, 246, ${(progress / 100) * 0.3})`
                    }}
                  >
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                      <motion.circle 
                        cx="50" cy="50" r="42" fill="none" stroke="rgba(59,130,246,0.2)" strokeWidth="0.5" strokeDasharray="4 4"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                        style={{ originX: "50px", originY: "50px" }}
                      />
                      <circle
                        cx="50" cy="50" r="48"
                        fill="none"
                        stroke="url(#hud-gradient)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray="301.59"
                        strokeDashoffset={301.59 - (301.59 * (progress / 100))}
                        style={{ transition: "stroke-dashoffset 0.1s ease-out" }}
                      />
                      <defs>
                        <linearGradient id="hud-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="50%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                      </defs>
                    </svg>
                    
                    {/* Center Percentage */}
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-white/90 text-xl sm:text-2xl font-mono tabular-nums tracking-tighter">
                        {progress}
                      </span>
                      <span className="text-blue-400/60 text-[8px] tracking-[0.2em] uppercase font-mono mt-1">
                        System
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Status Text */}
                  <div className="h-4 mt-2">
                    <EncryptedText 
                      key={messageIndex}
                      text={LOADING_MESSAGES[Math.min(messageIndex, LOADING_MESSAGES.length - 1)]}
                      revealDelayMs={25}
                      className="text-[10px] tracking-[0.2em] text-cyan-400/80 font-mono uppercase"
                      encryptedClassName="text-white/20"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <CursorEffects hoverType={hoverType} progress={progress} chargeLevelRef={chargeLevelRef} updateCharge={updateCharge} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
