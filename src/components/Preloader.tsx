"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "motion/react";
import { Vortex } from "@/components/ui/vortex";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { EncryptedText } from "@/components/ui/encrypted-text";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  driftX: number;
  driftY: number;
  shape?: "circle" | "diamond";
}

interface Shockwave {
  id: number;
  x: number;
  y: number;
}

interface DebrisItem {
  id: number;
  x: number;
  y: number;
  size: number;
  driftX: number;
  duration: number;
  color: string;
}

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
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [messagesLog, setMessagesLog] = useState<string[]>([]);
  const [hoverType, setHoverType] = useState<"none" | "window-controls" | "title-name" | "loader-ring">("none");
  const [isClicked, setIsClicked] = useState(false);
  const [isIdle, setIsIdle] = useState(true);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [shockwaves, setShockwaves] = useState<Shockwave[]>([]);
  const [debris, setDebris] = useState<DebrisItem[]>([]);
  const [chargeLevel, setChargeLevel] = useState(0);

  const chargeLevelRef = useRef(0);

  // Synchronized state & ref update helper
  const updateCharge = (value: number | ((prev: number) => number)) => {
    setChargeLevel((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      chargeLevelRef.current = next;
      return next;
    });
  };

  // Click decay handler (slowly reduces click mashing energy over time)
  useEffect(() => {
    const decayInterval = setInterval(() => {
      if (!isClicked) {
        updateCharge((prev) => Math.max(0, prev - 0.45));
      }
    }, 150);
    return () => clearInterval(decayInterval);
  }, [isClicked]);

  // Refs for tracking movement details
  const lastSpawnRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef(Date.now());

  // Mouse tracking motion values (start off-screen)
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth spring configuration
  const springConfig = { damping: 28, stiffness: 250, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Particle tracking and click explosion
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      const now = Date.now();
      const dt = Math.max(1, now - lastTimeRef.current);
      const dx = e.clientX - lastSpawnRef.current.x;
      const dy = e.clientY - lastSpawnRef.current.y;
      const dist = Math.hypot(dx, dy);
      const velocity = dist / dt; // pixels/ms
      lastTimeRef.current = now;

      // Denser trails on fast movement (spawn every 6px instead of 10px)
      const spawnThreshold = velocity > 1.5 ? 6 : 10;

      if (dist > spawnThreshold) {
        // High contrast colors responsive to hoverType and chargeLevel
        let colors = hoverType === "title-name"
          ? ["#a855f7", "#ff007f", "#ffffff"]
          : hoverType === "window-controls"
          ? ["#ff5f56", "#ffbd2e", "#27c93f"] // Red, Yellow, Green sparks!
          : hoverType === "loader-ring"
          ? ["#06b6d4", "#3b82f6", "#ffffff"]
          : ["#3b82f6", "#8b5cf6", "#06b6d4", "#a855f7", "#ff007f", "#ffffff"];
        
        // Add wild fire colors if chargeLevel is high
        if (chargeLevelRef.current > 8) {
          colors = [...colors, "#f97316", "#ef4444", "#ffffff"];
        }

        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const randomSize = velocity > 1.5 
          ? Math.random() * 12 + 6 // larger high-velocity particles
          : Math.random() * 8 + 3;
        
        // Negative movement vector for backward jet trails
        const moveAngle = Math.atan2(dy, dx);
        const oppositeAngle = moveAngle + Math.PI;
        const spread = (Math.random() - 0.5) * 0.8; // wider cone spread
        const finalAngle = oppositeAngle + spread;
        
        const particleSpeed = (velocity * 16) + Math.random() * 8;
        const driftX = Math.cos(finalAngle) * particleSpeed;
        const driftY = Math.sin(finalAngle) * particleSpeed - 8; // upward bias

        const newParticle: Particle = {
          id: Date.now() + Math.random(),
          x: e.clientX,
          y: e.clientY,
          color: randomColor,
          size: randomSize,
          driftX,
          driftY,
          shape: hoverType !== "none" ? "diamond" : "circle"
        };

        // Expanded buffer size to 120 particles for thick trails
        setParticles((prev) => [...prev.slice(-120), newParticle]);
        lastSpawnRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicked(true);

      // Increment chargeLevel (capped at 20) and spawn debris
      updateCharge((prev) => {
        const next = Math.min(20, prev + 1.25);

        // Spawn falling debris / shattered stones if click charge is high (Level 2+)
        if (next > 4) {
          const debrisCount = Math.min(8, Math.floor(next / 1.5));
          const newDebris: DebrisItem[] = [];
          for (let i = 0; i < debrisCount; i++) {
            newDebris.push({
              id: Date.now() + Math.random() + i,
              x: e.clientX,
              y: e.clientY,
              size: Math.random() * 20 + 8, // 8px to 28px rocks
              driftX: (Math.random() - 0.5) * 250, // wide drift
              duration: Math.random() * 0.5 + 0.8, // fall speed
              color: Math.random() > 0.6 ? "#2a2b36" : Math.random() > 0.3 ? "#1e1e24" : "#4c1d95" // dark stone & purple crystal chunks!
            });
          }
          setDebris((prev) => [...prev, ...newDebris]);
        }

        return next;
      });
      
      // Spawn expanding shockwave
      setShockwaves((prev) => [...prev, { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY }]);

      // Massive click burst (24 particles)
      const burstParticles: Particle[] = [];
      const numParticles = 24;
      for (let i = 0; i < numParticles; i++) {
        const angle = (i / numParticles) * Math.PI * 2 + (Math.random() - 0.5) * 0.25;
        const speed = Math.random() * 60 + 30; // explode outwards faster
        const driftX = Math.cos(angle) * speed;
        const driftY = Math.sin(angle) * speed;
        
        const colors = ["#ff007f", "#a855f7", "#06b6d4", "#ffffff", "#3b82f6"];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        burstParticles.push({
          id: Date.now() + Math.random() + i,
          x: e.clientX,
          y: e.clientY,
          color: randomColor,
          size: Math.random() * 10 + 4,
          driftX,
          driftY,
          shape: Math.random() > 0.5 ? "diamond" : "circle"
        });
      }
      
      setParticles((prev) => [...prev.slice(-80), ...burstParticles]);
    };

    const handleMouseDownUpWrapper = () => setIsClicked(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseDownUpWrapper);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseDownUpWrapper);
    };
  }, [cursorX, cursorY, hoverType]);

  // Click & Hold Sparkler Emitter (Welding spark generator & Continuous charging)
  useEffect(() => {
    if (!isClicked) return;

    const interval = setInterval(() => {
      // 1. Continuously charge energy level during holds (+0.4 every 30ms)
      updateCharge((prev) => {
        const next = Math.min(20, prev + 0.4);
        
        // Spawn falling debris / shattered stones periodically during hold charging (Level 2+, next > 4)
        if (next > 4 && Math.random() > 0.45) {
          const x = cursorX.get();
          const y = cursorY.get();
          if (x >= 0) {
            setDebris((prevDebris) => [
              ...prevDebris,
              {
                id: Date.now() + Math.random(),
                x,
                y,
                size: Math.random() * 18 + 8,
                driftX: (Math.random() - 0.5) * 200,
                duration: Math.random() * 0.5 + 0.8,
                color: Math.random() > 0.6 ? "#2a2b36" : Math.random() > 0.3 ? "#1e1e24" : "#4c1d95"
              }
            ]);
          }
        }

        return next;
      });

      const x = cursorX.get();
      const y = cursorY.get();
      if (x < 0) return; // skip if off-screen

      const colors = hoverType === "window-controls"
        ? ["#ff5f56", "#ffbd2e", "#27c93f"]
        : hoverType === "title-name"
        ? ["#ff007f", "#a855f7", "#ffffff"]
        : hoverType === "loader-ring"
        ? ["#06b6d4", "#3b82f6", "#ffffff"]
        : ["#ff007f", "#a855f7", "#06b6d4", "#ffffff", "#ffaa00"];
      
      const numSparks = 3; // spawn 3 sparks every 30ms
      const newSparks: Particle[] = [];

      for (let i = 0; i < numSparks; i++) {
        // Explode outward and upward
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 25 + 10;
        const driftX = Math.cos(angle) * speed;
        const driftY = Math.sin(angle) * speed - 15; // float upward faster

        newSparks.push({
          id: Date.now() + Math.random() + i,
          x,
          y,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 2, // glowing ember sizes
          driftX,
          driftY,
          shape: hoverType !== "none" ? "diamond" : "circle"
        });
      }

      setParticles((prev) => [...prev.slice(-120), ...newSparks]);
    }, 30); // 30ms high frequency emitter

    return () => clearInterval(interval);
  }, [isClicked, cursorX, cursorY, hoverType]);

  // Idle tracking stardust generator
  useEffect(() => {
    let idleTimeout: NodeJS.Timeout;
    let idleInterval: NodeJS.Timeout;

    const resetIdle = () => {
      setIsIdle(false);
      clearTimeout(idleTimeout);
      clearInterval(idleInterval);

      idleTimeout = setTimeout(() => {
        setIsIdle(true);
        // Slowly float bubbles upward when mouse is stationary
        idleInterval = setInterval(() => {
          const x = cursorX.get();
          const y = cursorY.get();
          if (x < 0) return; // skip if cursor hasn't moved yet

          const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.8;
          const driftDist = Math.random() * 30 + 10;
          const driftX = Math.cos(angle) * driftDist;
          const driftY = Math.sin(angle) * driftDist;

          const newParticle: Particle = {
            id: Date.now() + Math.random(),
            x,
            y,
            color: "#3b82f6",
            size: Math.random() * 4 + 2,
            driftX,
            driftY,
            shape: "circle"
          };

          setParticles((prev) => [...prev.slice(-40), newParticle]);
        }, 250);
      }, 700); // 700ms stationary threshold
    };

    window.addEventListener("mousemove", resetIdle);
    window.addEventListener("mousedown", resetIdle);

    return () => {
      window.removeEventListener("mousemove", resetIdle);
      window.removeEventListener("mousedown", resetIdle);
      clearTimeout(idleTimeout);
      clearInterval(idleInterval);
    };
  }, [cursorX, cursorY]);

  useEffect(() => {
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

    // Initial log message
    setMessagesLog([LOADING_MESSAGES[0]]);

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
          exit={{ 
            opacity: 0,
            scale: 1.15,
            filter: "blur(20px)",
            transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } 
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
              <div className="absolute top-6 left-6 z-10 hidden md:flex flex-col gap-2.5 font-mono text-[11px] text-blue-400/80 tracking-widest pointer-events-none max-w-lg opacity-70">
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

          {/* Falling Debris / Shattered Chunks (Hidden on mobile) */}
          <div className="pointer-events-none fixed inset-0 z-[99998] hidden md:block overflow-hidden">
            {debris.map((rock) => (
              <motion.div
                key={rock.id}
                initial={{
                  x: rock.x,
                  y: rock.y,
                  rotate: 0,
                  opacity: 1,
                  scale: 1
                }}
                animate={{
                  y: "110vh", // Gravity fall safely off-screen
                  x: rock.x + rock.driftX,
                  rotate: Math.random() > 0.5 ? 360 : -360,
                  opacity: [1, 1, 0.4, 0]
                }}
                transition={{
                  duration: rock.duration,
                  ease: "easeIn" // Gravity acceleration curve
                }}
                onAnimationComplete={() => {
                  setDebris((prev) => prev.filter((item) => item.id !== rock.id));
                }}
                className="absolute pointer-events-none border border-white/10 shadow-[0_0_12px_rgba(255,255,255,0.08)]"
                style={{
                  width: rock.size,
                  height: rock.size,
                  backgroundColor: rock.color,
                  clipPath: "polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)" // Decagon stone block!
                }}
              />
            ))}
          </div>

          {/* Click Shockwave Ripples (Hidden on mobile) */}
          <div className="pointer-events-none fixed inset-0 z-[99999] hidden md:block">
            {shockwaves.map((sw) => (
              <motion.div
                key={sw.id}
                initial={{
                  x: sw.x,
                  y: sw.y,
                  translateX: "-50%",
                  translateY: "-50%",
                  width: 0,
                  height: 0,
                  opacity: 1,
                  borderWidth: "3px"
                }}
                animate={{
                  width: 250,
                  height: 250,
                  opacity: 0,
                  borderWidth: "0.5px"
                }}
                transition={{ duration: 0.8, ease: [0.1, 0.8, 0.3, 1] }}
                onAnimationComplete={() => {
                  setShockwaves((prev) => prev.filter((item) => item.id !== sw.id));
                }}
                className="absolute rounded-full border border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.6),inset_0_0_20px_rgba(6,182,212,0.3)]"
              />
            ))}
          </div>

          {/* Stardust Particle Trail (Hidden on mobile for performance) */}
          <div className="pointer-events-none fixed inset-0 z-[99999] hidden md:block">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ 
                  opacity: 0.8, 
                  scale: 1, 
                  x: p.x - p.size / 2, 
                  y: p.y - p.size / 2 
                }}
                animate={{ 
                  opacity: 0, 
                  scale: 0.2, 
                  x: p.x - p.size / 2 + p.driftX, 
                  y: p.y - p.size / 2 + p.driftY 
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                onAnimationComplete={() => {
                  setParticles((prev) => prev.filter((item) => item.id !== p.id));
                }}
                className={`absolute pointer-events-none blur-[0.5px] ${
                  p.shape === "circle" ? "rounded-full" : ""
                }`}
                style={{
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.color,
                  boxShadow: `0 0 ${p.size * 2}px ${p.color}, 0 0 ${p.size * 4}px ${p.color}`,
                  transform: p.shape === "diamond" ? "rotate(45deg)" : undefined
                }}
              />
            ))}
          </div>

          {/* Custom Interactive Cursor */}
          <motion.div
            style={{
              x: cursorXSpring,
              y: cursorYSpring,
              translateX: "-50%",
              translateY: "-50%",
            }}
            className="pointer-events-none fixed top-0 left-0 z-[100000] hidden md:block"
          >
            {/* Ambient Light Halo - dynamic scale and glowing background flare */}
            <motion.div 
              animate={{
                scale: isClicked ? 1.4 : hoverType === "title-name" ? 1.8 : hoverType === "loader-ring" ? 1.6 : hoverType === "window-controls" ? 1.1 : 1,
                opacity: isIdle ? 0.45 : 0.85,
                background: isClicked
                  ? "radial-gradient(circle, rgba(168,85,247,0.2) 0%, rgba(255,0,127,0.05) 70%)"
                  : hoverType === "window-controls"
                  ? "radial-gradient(circle, rgba(255,95,86,0.2) 0%, rgba(255,95,86,0.02) 70%)"
                  : hoverType === "title-name"
                  ? "radial-gradient(circle, rgba(168,85,247,0.25) 0%, rgba(255,0,127,0.05) 70%)"
                  : hoverType === "loader-ring"
                  ? "radial-gradient(circle, rgba(6,182,212,0.2) 0%, rgba(59,130,246,0.05) 70%)"
                  : "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(6,182,212,0.02) 70%)"
              }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none mix-blend-screen"
            />
            {/* Outer Ring - Multi-layered scale, target border-radius, rotation, and idle breath */}
            <motion.div
              animate={{
                scale: isClicked ? 0.75 : hoverType === "title-name" ? 1.6 : hoverType === "window-controls" ? 0.75 : hoverType === "loader-ring" ? 1.3 : isIdle ? [1, 1.12, 1] : 1,
                borderColor: isClicked 
                  ? "#a855f7" 
                  : hoverType === "window-controls" 
                  ? "#ff5f56" 
                  : hoverType === "title-name" 
                  ? "#a855f7" 
                  : hoverType === "loader-ring" 
                  ? "#06b6d4" 
                  : "rgba(59, 130, 246, 0.35)",
                borderWidth: isClicked ? "2px" : "1.5px",
                borderRadius: hoverType === "window-controls" ? "8px" : "9999px", // Rounded square target for windows button!
                rotate: isClicked ? 360 : hoverType === "title-name" ? -180 : hoverType === "loader-ring" ? 180 : 0
              }}
              transition={{ 
                scale: isIdle && !isClicked && hoverType === "none"
                  ? { repeat: Infinity, duration: 2, ease: "easeInOut" } 
                  : { type: "spring", stiffness: 300, damping: 20 },
                borderColor: { duration: 0.2 },
                rotate: isClicked
                  ? { repeat: Infinity, duration: 1, ease: "linear" } // Rapid spin on hold
                  : { repeat: Infinity, duration: 6, ease: "linear" } 
              }}
              className="w-10 h-10 border border-dashed flex items-center justify-center relative"
              style={{
                boxShadow: isClicked
                  ? "0 0 20px rgba(168, 85, 247, 0.5), inset 0 0 10px rgba(168, 85, 247, 0.3)"
                  : hoverType === "window-controls"
                  ? "0 0 15px rgba(255, 95, 86, 0.4)"
                  : hoverType === "title-name"
                  ? "0 0 20px rgba(168, 85, 247, 0.4)"
                  : hoverType === "loader-ring"
                  ? "0 0 15px rgba(6, 182, 212, 0.4)"
                  : isIdle
                  ? "0 0 12px rgba(59, 130, 246, 0.25)"
                  : "0 0 8px rgba(59, 130, 246, 0.1)"
              }}
            >
              {/* Secondary Orbiting Ring */}
              {hoverType !== "none" && (
                <motion.div
                  animate={{ rotate: hoverType === "title-name" ? -360 : 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="absolute inset-0.5 rounded-full border border-dotted border-purple-400/40"
                />
              )}
              
              {/* Inner Core */}
              <motion.div
                animate={{
                  scale: isClicked ? 1.5 : hoverType === "title-name" ? 1.25 : hoverType === "window-controls" ? 0.75 : 1,
                  backgroundColor: isClicked 
                    ? "#ff007f" 
                    : hoverType === "window-controls" 
                    ? "#ff5f56" 
                    : hoverType === "title-name" 
                    ? "#a855f7" 
                    : hoverType === "loader-ring" 
                    ? "#06b6d4" 
                    : "#3b82f6",
                }}
                className="w-2.5 h-2.5 rounded-full shadow-[0_0_10px_currentColor] text-blue-500 transition-colors duration-150"
                style={{
                  boxShadow: isClicked 
                    ? "0 0 18px #ff007f, 0 0 35px #ff007f"
                    : hoverType === "window-controls"
                    ? "0 0 12px #ff5f56"
                    : hoverType === "title-name"
                    ? "0 0 15px #a855f7"
                    : hoverType === "loader-ring"
                    ? "0 0 12px #06b6d4"
                    : "0 0 8px #3b82f6"
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
