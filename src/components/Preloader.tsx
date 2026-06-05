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
  const [isHovering, setIsHovering] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isIdle, setIsIdle] = useState(true);
  const [particles, setParticles] = useState<Particle[]>([]);

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

      // High velocity spawns dense trails
      const spawnThreshold = velocity > 1.5 ? 8 : 16;

      if (dist > spawnThreshold) {
        // Special color scheme for hovers
        const colors = isHovering 
          ? ["#06b6d4", "#a855f7", "#ffffff"] 
          : ["#3b82f6", "#8b5cf6", "#06b6d4", "#a855f7"];
        
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const randomSize = velocity > 1.5 
          ? Math.random() * 8 + 6 // bigger jet particles
          : Math.random() * 6 + 3;
        
        // Spawn vector shooting BACKWARD from movement direction
        const moveAngle = Math.atan2(dy, dx);
        const oppositeAngle = moveAngle + Math.PI;
        const spread = (Math.random() - 0.5) * 0.6; // cone spread
        const finalAngle = oppositeAngle + spread;
        
        const particleSpeed = (velocity * 12) + Math.random() * 5;
        const driftX = Math.cos(finalAngle) * particleSpeed;
        const driftY = Math.sin(finalAngle) * particleSpeed - 5; // upward float bias

        const newParticle: Particle = {
          id: Date.now() + Math.random(),
          x: e.clientX,
          y: e.clientY,
          color: randomColor,
          size: randomSize,
          driftX,
          driftY,
          shape: isHovering ? "diamond" : "circle"
        };

        setParticles((prev) => [...prev.slice(-40), newParticle]);
        lastSpawnRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicked(true);
      
      // Cinematic click burst (14 particles firing outward 360deg)
      const burstParticles: Particle[] = [];
      const numParticles = 14;
      for (let i = 0; i < numParticles; i++) {
        const angle = (i / numParticles) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
        const speed = Math.random() * 45 + 20; // explode outwards
        const driftX = Math.cos(angle) * speed;
        const driftY = Math.sin(angle) * speed;
        
        const colors = ["#ff007f", "#a855f7", "#06b6d4", "#ffffff"];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        burstParticles.push({
          id: Date.now() + Math.random() + i,
          x: e.clientX,
          y: e.clientY,
          color: randomColor,
          size: Math.random() * 6 + 3,
          driftX,
          driftY,
          shape: Math.random() > 0.5 ? "diamond" : "circle"
        });
      }
      
      setParticles((prev) => [...prev.slice(-30), ...burstParticles]);
    };

    const handleMouseUp = () => setIsClicked(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [cursorX, cursorY, isHovering]);

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
          
          {/* Full Screen Apple Terminal Window */}
          <div className="relative z-10 w-full h-full flex flex-col bg-[#020202] overflow-hidden cursor-none">
            
            {/* Background Animations INSIDE the Terminal */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
              <FlickeringGrid 
                squareSize={4}
                gridGap={6}
                color="#3b82f6"
                maxOpacity={0.4}
                flickerChance={0.15}
              />
            </div>
            <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
              <Vortex
                backgroundColor="transparent"
                baseHue={260} // Adjusted hue to be more purple/blue to match "purple points"
                particleCount={400}
                baseSpeed={0.5 + (progress / 100) * 2}
              />
            </div>

            {/* macOS Title Bar */}
            <div className="relative z-20 flex items-center px-4 h-12 border-b border-white/10 bg-black/40 backdrop-blur-md">
              <div 
                className="flex gap-2 cursor-none"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
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
                  animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  className="text-[clamp(2rem,5.5vw,4.5rem)] font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 mb-6 sm:mb-8 text-center select-none cursor-none pointer-events-auto"
                  style={{
                    textShadow: `0 0 ${progress * 0.4}px rgba(59, 130, 246, ${progress / 100})`
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
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
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
            {/* Outer Ring - Multi-layered glow, rotation, and idle breath */}
            <motion.div
              animate={{
                scale: isClicked ? 0.85 : isHovering ? 1.4 : isIdle ? [1, 1.12, 1] : 1,
                borderColor: isClicked 
                  ? "rgba(168, 85, 247, 0.9)" 
                  : isHovering 
                  ? "rgba(6, 182, 212, 0.8)" 
                  : "rgba(59, 130, 246, 0.35)",
                borderWidth: isClicked ? "3px" : "1.5px",
                rotate: isHovering ? 180 : 0
              }}
              transition={{ 
                scale: isIdle && !isClicked && !isHovering 
                  ? { repeat: Infinity, duration: 2, ease: "easeInOut" } 
                  : { type: "spring", stiffness: 300, damping: 20 },
                borderColor: { duration: 0.2 },
                rotate: { repeat: Infinity, duration: 6, ease: "linear" } 
              }}
              className="w-10 h-10 rounded-full border border-dashed flex items-center justify-center relative"
              style={{
                boxShadow: isHovering 
                  ? "0 0 15px rgba(6, 182, 212, 0.4), inset 0 0 10px rgba(6, 182, 212, 0.2)" 
                  : isIdle
                  ? "0 0 12px rgba(59, 130, 246, 0.25)"
                  : "0 0 8px rgba(59, 130, 246, 0.1)"
              }}
            >
              {/* Secondary Orbiting Ring */}
              {isHovering && (
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="absolute inset-0.5 rounded-full border border-dotted border-purple-400/40"
                />
              )}
              
              {/* Inner Core */}
              <motion.div
                animate={{
                  scale: isClicked ? 1.6 : isHovering ? 1.2 : 1,
                  backgroundColor: isClicked 
                    ? "#a855f7" 
                    : isHovering 
                    ? "#06b6d4" 
                    : "#3b82f6",
                }}
                className="w-2.5 h-2.5 rounded-full shadow-[0_0_10px_currentColor] text-blue-500"
                style={{
                  boxShadow: isHovering 
                    ? "0 0 12px #06b6d4" 
                    : isClicked 
                    ? "0 0 15px #a855f7" 
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
