"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "motion/react";

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
  rotateTo: number;
}

interface CursorEffectsProps {
  hoverType: "none" | "window-controls" | "title-name" | "loader-ring" | "terminal-text";
  progress: number;
  chargeLevelRef: React.MutableRefObject<number>;
  updateCharge: (value: number | ((prev: number) => number)) => void;
}

export function CursorEffects({ hoverType, progress, chargeLevelRef, updateCharge }: CursorEffectsProps) {
  const [isClicked, setIsClicked] = useState(false);
  const [isIdle, setIsIdle] = useState(true);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [shockwaves, setShockwaves] = useState<Shockwave[]>([]);
  const [debris, setDebris] = useState<DebrisItem[]>([]);

  const lastSpawnRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef(0);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 250, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Click decay handler (slowly reduces click mashing energy over time)
  useEffect(() => {
    const decayInterval = setInterval(() => {
      if (!isClicked) {
        updateCharge((prev) => Math.max(0, prev - 0.45));
      }
    }, 150);
    return () => clearInterval(decayInterval);
  }, [isClicked, updateCharge]);

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
      const velocity = dist / dt;
      lastTimeRef.current = now;

      const spawnThreshold = velocity > 1.5 ? 6 : 10;

      if (dist > spawnThreshold) {
        let colors = hoverType === "title-name"
          ? ["#a855f7", "#ff007f", "#ffffff"]
          : hoverType === "window-controls"
          ? ["#ff5f56", "#ffbd2e", "#27c93f"]
          : hoverType === "loader-ring"
          ? ["#06b6d4", "#3b82f6", "#ffffff"]
          : hoverType === "terminal-text"
          ? ["#22c55e", "#4ade80", "#10b981", "#ffffff"]
          : ["#3b82f6", "#8b5cf6", "#06b6d4", "#a855f7", "#ff007f", "#ffffff"];

        if (chargeLevelRef.current > 8) {
          colors = [...colors, "#f97316", "#ef4444", "#ffffff"];
        }

        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const randomSize = velocity > 1.5
          ? Math.random() * 12 + 6
          : Math.random() * 8 + 3;

        const moveAngle = Math.atan2(dy, dx);
        const oppositeAngle = moveAngle + Math.PI;
        const spread = (Math.random() - 0.5) * 0.8;
        const finalAngle = oppositeAngle + spread;

        const particleSpeed = (velocity * 16) + Math.random() * 8;
        const driftX = Math.cos(finalAngle) * particleSpeed;
        const driftY = Math.sin(finalAngle) * particleSpeed - 8;

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

        setParticles((prev) => [...prev.slice(-120), newParticle]);
        lastSpawnRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicked(true);

      updateCharge((prev) => {
        const next = Math.min(20, prev + 1.25);

        if (next > 4) {
          const debrisCount = Math.min(8, Math.floor(next / 1.5));
          const newDebris: DebrisItem[] = [];
          for (let i = 0; i < debrisCount; i++) {
            newDebris.push({
              id: Date.now() + Math.random() + i,
              x: e.clientX,
              y: e.clientY,
              size: Math.random() * 20 + 8,
              driftX: (Math.random() - 0.5) * 250,
              duration: Math.random() * 0.5 + 0.8,
              color: Math.random() > 0.6 ? "#2a2b36" : Math.random() > 0.3 ? "#1e1e24" : "#4c1d95",
              rotateTo: Math.random() > 0.5 ? 360 : -360
            });
          }
          setDebris((prev) => [...prev, ...newDebris]);
        }

        return next;
      });

      setShockwaves((prev) => [...prev, { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY }]);

      const burstParticles: Particle[] = [];
      const numParticles = 24;
      for (let i = 0; i < numParticles; i++) {
        const angle = (i / numParticles) * Math.PI * 2 + (Math.random() - 0.5) * 0.25;
        const speed = Math.random() * 60 + 30;
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
  }, [cursorX, cursorY, hoverType, updateCharge]);

  // Click & Hold Sparkler Emitter (Welding spark generator & Continuous charging)
  useEffect(() => {
    if (!isClicked) return;

    const interval = setInterval(() => {
      updateCharge((prev) => {
        const next = Math.min(20, prev + 0.4);

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
                color: Math.random() > 0.6 ? "#2a2b36" : Math.random() > 0.3 ? "#1e1e24" : "#4c1d95",
                rotateTo: Math.random() > 0.5 ? 360 : -360
              }
            ]);
          }
        }

        return next;
      });

      const x = cursorX.get();
      const y = cursorY.get();
      if (x < 0) return;

      const colors = hoverType === "window-controls"
        ? ["#ff5f56", "#ffbd2e", "#27c93f"]
        : hoverType === "title-name"
        ? ["#ff007f", "#a855f7", "#ffffff"]
        : hoverType === "loader-ring"
        ? ["#06b6d4", "#3b82f6", "#ffffff"]
        : hoverType === "terminal-text"
        ? ["#22c55e", "#4ade80", "#10b981", "#ffffff"]
        : ["#ff007f", "#a855f7", "#06b6d4", "#ffffff", "#ffaa00"];

      const numSparks = 3;
      const newSparks: Particle[] = [];

      for (let i = 0; i < numSparks; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 25 + 10;
        const driftX = Math.cos(angle) * speed;
        const driftY = Math.sin(angle) * speed - 15;

        newSparks.push({
          id: Date.now() + Math.random() + i,
          x,
          y,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 2,
          driftX,
          driftY,
          shape: hoverType !== "none" ? "diamond" : "circle"
        });
      }

      setParticles((prev) => [...prev.slice(-120), ...newSparks]);
    }, 30);

    return () => clearInterval(interval);
  }, [isClicked, cursorX, cursorY, hoverType, updateCharge]);

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
        idleInterval = setInterval(() => {
          const x = cursorX.get();
          const y = cursorY.get();
          if (x < 0) return;

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
      }, 700);
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

  return (
    <>
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
              y: "110vh",
              x: rock.x + rock.driftX,
              rotate: rock.rotateTo,
              opacity: [1, 1, 0.4, 0]
            }}
            transition={{
              duration: rock.duration,
              ease: "easeIn"
            }}
            onAnimationComplete={() => {
              setDebris((prev) => prev.filter((item) => item.id !== rock.id));
            }}
            className="absolute pointer-events-none border border-white/10 shadow-[0_0_12px_rgba(255,255,255,0.08)]"
            style={{
              width: rock.size,
              height: rock.size,
              backgroundColor: rock.color,
              clipPath: "polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)"
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
        <motion.div
          animate={{
            scale: isClicked ? 1.4 : hoverType === "title-name" ? 2.0 : hoverType === "loader-ring" ? 1.8 : hoverType === "window-controls" ? 1.2 : hoverType === "terminal-text" ? 1.3 : 1,
            opacity: isIdle ? 0.45 : 0.85,
            background: isClicked
              ? "radial-gradient(circle, rgba(168,85,247,0.25) 0%, rgba(255,0,127,0.05) 70%)"
              : hoverType === "window-controls"
              ? "radial-gradient(circle, rgba(255,95,86,0.25) 0%, rgba(255,95,86,0.02) 70%)"
              : hoverType === "title-name"
              ? "radial-gradient(circle, rgba(168,85,247,0.3) 0%, rgba(255,0,127,0.05) 70%)"
              : hoverType === "loader-ring"
              ? "radial-gradient(circle, rgba(6,182,212,0.25) 0%, rgba(59,130,246,0.05) 70%)"
              : hoverType === "terminal-text"
              ? "radial-gradient(circle, rgba(34,197,94,0.2) 0%, rgba(34,197,94,0.02) 70%)"
              : "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(6,182,212,0.02) 70%)"
          }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none mix-blend-screen"
        />

        <AnimatePresence mode="wait">
          {hoverType === "terminal-text" ? (
            <motion.div
              key="terminal-caret"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-1.5 font-mono text-[13px] text-green-400 font-bold"
            >
              <motion.div
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8, ease: (v) => (v < 0.5 ? 0 : 1) }}
                className="w-3 h-5 bg-green-500 shadow-[0_0_8px_#22c55e]"
              />
              <span className="text-[9px] tracking-wider text-green-400/80 bg-green-950/60 px-1 border border-green-500/30 rounded select-none">
                EDIT
              </span>
            </motion.div>
          ) : hoverType === "window-controls" ? (
            <motion.div
              key="window-controls-target"
              initial={{ opacity: 0, scale: 0.6, rotate: -45 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.6, rotate: 45 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
              className="w-9 h-9 border border-red-500/60 rounded flex items-center justify-center relative bg-red-950/20"
              style={{
                boxShadow: "0 0 15px rgba(255, 95, 86, 0.3), inset 0 0 8px rgba(255, 95, 86, 0.2)"
              }}
            >
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-red-500" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-red-500" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-red-500" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-red-500" />
              <motion.div
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#ff5f56]"
              />
            </motion.div>
          ) : hoverType === "title-name" ? (
            <motion.div
              key="title-astrolabe"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative w-16 h-16 flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-dashed border-purple-500/70"
                style={{
                  boxShadow: "0 0 15px rgba(168, 85, 247, 0.3)"
                }}
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                className="absolute inset-2.5 rounded-full border border-dotted border-pink-500/60"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="absolute inset-5 rounded-full border border-purple-400/40 flex items-center justify-center"
              >
                <div className="absolute top-0 bottom-0 w-[1px] bg-purple-400/30" />
                <div className="absolute left-0 right-0 h-[1px] bg-purple-400/30" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 shadow-[0_0_12px_#a855f7]"
              />
            </motion.div>
          ) : hoverType === "loader-ring" ? (
            <motion.div
              key="loader-ring-scanner"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-16 h-16 rounded-full border border-cyan-500/50 flex flex-col items-center justify-center relative bg-cyan-950/25"
              style={{
                boxShadow: "0 0 20px rgba(6, 182, 212, 0.3), inset 0 0 10px rgba(6, 182, 212, 0.15)"
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="absolute inset-[-2px] rounded-full border border-cyan-400 border-t-transparent border-b-transparent"
              />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:4px_4px] rounded-full pointer-events-none" />
              <span className="font-mono text-[10px] font-bold text-cyan-400 select-none tracking-tighter tabular-nums z-10 leading-none">
                {progress}%
              </span>
              <span className="font-mono text-[5px] text-cyan-400/60 uppercase tracking-[0.1em] scale-75 select-none z-10 leading-none mt-0.5">
                SCAN
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="standard-cursor"
              animate={{
                scale: isClicked ? 0.75 : isIdle ? [1, 1.12, 1] : 1,
                borderColor: isClicked ? "#a855f7" : "rgba(59, 130, 246, 0.35)",
                borderWidth: isClicked ? "2px" : "1.5px",
                rotate: isClicked ? 360 : 0
              }}
              transition={{
                scale: isIdle && !isClicked
                  ? { repeat: Infinity, duration: 2, ease: "easeInOut" }
                  : { type: "spring", stiffness: 300, damping: 20 },
                borderColor: { duration: 0.2 },
                rotate: isClicked
                  ? { repeat: Infinity, duration: 1, ease: "linear" }
                  : { duration: 0.3 }
              }}
              className="w-10 h-10 border border-dashed rounded-full flex items-center justify-center relative"
              style={{
                boxShadow: isClicked
                  ? "0 0 20px rgba(168, 85, 247, 0.5), inset 0 0 10px rgba(168, 85, 247, 0.3)"
                  : isIdle
                  ? "0 0 12px rgba(59, 130, 246, 0.25)"
                  : "0 0 8px rgba(59, 130, 246, 0.1)"
              }}
            >
              <motion.div
                animate={{
                  scale: isClicked ? 1.5 : 1,
                  backgroundColor: isClicked ? "#ff007f" : "#3b82f6",
                }}
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  boxShadow: isClicked
                    ? "0 0 18px #ff007f, 0 0 35px #ff007f"
                    : "0 0 8px #3b82f6"
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
