import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Mostafa Yaser — Full Stack SWE & Global Health Technologist"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px 96px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Blue radial glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 70% at 85% 50%, rgba(59,130,246,0.14) 0%, transparent 70%)",
          }}
        />

        {/* Grid dots — subtle texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Blue accent dot */}
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#3b82f6",
            marginBottom: 44,
          }}
        />

        {/* Name */}
        <div
          style={{
            fontSize: 84,
            fontWeight: 700,
            color: "#f0f0f0",
            lineHeight: 1.0,
            letterSpacing: "-0.035em",
            marginBottom: 24,
          }}
        >
          Mostafa Yaser
        </div>

        {/* Role */}
        <div
          style={{
            fontSize: 30,
            color: "#737373",
            fontWeight: 400,
            letterSpacing: "-0.01em",
            marginBottom: 64,
            lineHeight: 1.3,
          }}
        >
          Full Stack SWE & Global Health Technologist
        </div>

        {/* Tags row */}
        <div style={{ display: "flex", gap: 12 }}>
          {["Cairo, Egypt", "IFMSA", "ScholarX", "McKinsey Forward"].map((tag) => (
            <div
              key={tag}
              style={{
                padding: "6px 16px",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 100,
                fontSize: 14,
                color: "#525252",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Domain — bottom right */}
        <div
          style={{
            position: "absolute",
            bottom: 80,
            right: 96,
            fontSize: 18,
            color: "#2a2a2a",
            letterSpacing: "0.06em",
          }}
        >
          mostafayaser.earth
        </div>
      </div>
    ),
    { ...size }
  )
}
