"use client";

import { cn } from "@/lib/utils";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

import { useRef, useState } from "react";

export const FloatingDock = ({
  items,
  activeSection,
  sectionProgress = 0,
  desktopClassName,
  mobileClassName,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  activeSection?: string;
  sectionProgress?: number;
  desktopClassName?: string;
  mobileClassName?: string;
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} activeSection={activeSection} sectionProgress={sectionProgress} className={desktopClassName} />
      <FloatingDockMobile items={items} activeSection={activeSection} sectionProgress={sectionProgress} className={mobileClassName} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  activeSection,
  sectionProgress = 0,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  activeSection?: string;
  sectionProgress?: number;
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("relative block md:hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2"
          >
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  transition: {
                    delay: idx * 0.05,
                  },
                }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
              >
                <a
                  href={item.href}
                  key={item.title}
                  className={cn(
                    "relative flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300",
                    activeSection === item.href
                      ? "bg-transparent border border-blue-500/50 shadow-[0_0_16px_rgba(59,130,246,0.4)]"
                      : "bg-gray-50 dark:bg-neutral-900"
                  )}
                >
                  {activeSection === item.href && (
                    <motion.div
                      layoutId="mobile-active-nav-item"
                      className="absolute inset-0 rounded-full bg-blue-500/10"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(59,130,246,0.2)" strokeWidth="4" />
                        <circle
                          cx="50" cy="50" r="48"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray="301.59"
                          strokeDashoffset={301.59 - (301.59 * sectionProgress)}
                          style={{ transition: "stroke-dashoffset 0.1s ease-out" }}
                        />
                      </svg>
                    </motion.div>
                  )}
                  <div className={cn("relative z-10 h-4 w-4 transition-colors duration-300", activeSection === item.href ? "text-blue-400" : "text-neutral-500 dark:text-neutral-400")}>
                    {item.icon}
                  </div>
                </a>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 dark:bg-neutral-800"
      >
        <IconLayoutNavbarCollapse className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
      </button>
    </div>
  );
};

const FloatingDockDesktop = ({
  items,
  activeSection,
  sectionProgress = 0,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  activeSection?: string;
  sectionProgress?: number;
  className?: string;
}) => {
  let mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto hidden h-16 items-end gap-4 rounded-2xl bg-gray-50 px-4 pb-3 md:flex dark:bg-neutral-900",
        className,
      )}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} isActive={activeSection === item.href} sectionProgress={sectionProgress} />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  isActive,
  sectionProgress = 0,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href: string;
  isActive?: boolean;
  sectionProgress?: number;
}) {
  let ref = useRef<HTMLDivElement>(null);

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

    return val - bounds.x - bounds.width / 2;
  });

  let widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);

  let widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);
  let heightTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [20, 40, 20],
  );

  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  let widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  return (
    <a href={href}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "relative flex aspect-square items-center justify-center rounded-full transition-colors duration-300",
          isActive ? "bg-transparent" : "bg-gray-200 dark:bg-neutral-800"
        )}
      >
        {isActive && (
          <motion.div
            layoutId="active-nav-item"
            className="absolute inset-0 rounded-full bg-blue-500/10 shadow-[0_0_16px_rgba(59,130,246,0.3)]"
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          >
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(59,130,246,0.2)" strokeWidth="4" />
              <circle
                cx="50" cy="50" r="48"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="301.59"
                strokeDashoffset={301.59 - (301.59 * sectionProgress)}
                style={{ transition: "stroke-dashoffset 0.1s ease-out" }}
              />
            </svg>
          </motion.div>
        )}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="absolute -top-8 left-1/2 w-fit rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs whitespace-pre text-neutral-700 dark:border-neutral-900 dark:bg-neutral-800 dark:text-white"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className={cn(
            "relative z-10 flex items-center justify-center transition-colors duration-300",
            isActive ? "text-blue-400" : "text-neutral-500 dark:text-neutral-400"
          )}
        >
          {icon}
        </motion.div>
      </motion.div>
    </a>
  );
}
