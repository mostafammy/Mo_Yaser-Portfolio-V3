"use client";

import React, { useState } from "react";
import {
  Calendar,
  Calculator,
  FileText,
  Folder,
  Globe,
  Image as ImageIcon,
  Mail,
  Music,
  Terminal,
} from "lucide-react";
import { MacOSDock } from "@/components/ui/mac-os-dock";

const sampleApps = [
  { id: "finder", name: "Finder", icon: <Folder className="size-full" /> },
  {
    id: "calculator",
    name: "Calculator",
    icon: <Calculator className="size-full" />,
  },
  {
    id: "terminal",
    name: "Terminal",
    icon: <Terminal className="size-full" />,
  },
  { id: "mail", name: "Mail", icon: <Mail className="size-full" /> },
  {
    id: "notes",
    name: "Notes",
    icon: <FileText className="size-full" />,
  },
  { id: "safari", name: "Safari", icon: <Globe className="size-full" /> },
  { id: "photos", name: "Photos", icon: <ImageIcon className="size-full" /> },
  { id: "music", name: "Music", icon: <Music className="size-full" /> },
  {
    id: "calendar",
    name: "Calendar",
    icon: <Calendar className="size-full" />,
  },
];

export default function MacOSDockDemo() {
  const [openApps, setOpenApps] = useState<string[]>(["finder", "safari"]);

  const handleAppClick = (appId: string) => {
    setOpenApps((prev) =>
      prev.includes(appId)
        ? prev.filter((id) => id !== appId)
        : [...prev, appId]
    );
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center overflow-hidden">
      <MacOSDock apps={sampleApps} onAppClick={handleAppClick} openApps={openApps} />
    </div>
  );
}
