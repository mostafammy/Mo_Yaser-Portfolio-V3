"use client"

import { Component, type ReactNode } from "react"

interface Props { children: ReactNode }
interface State { hasError: boolean }

export class GlobeErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  override render() {
    if (this.state.hasError) {
      return (
        <section
          id="global-presence"
          className="relative bg-[#0a0a0a] py-28 lg:py-44 flex items-center justify-center"
        >
          <div className="text-center space-y-3">
            <p className="text-[13px] text-white/25">
              Globe unavailable — WebGL not supported in this environment.
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-[12px] text-white/30">
              {["Cairo 🇪🇬","Copenhagen 🇩🇰","Espoo 🇫🇮","Dubai 🇦🇪","Amman 🇯🇴","Fort Mill 🇺🇸"].map((c) => (
                <span key={c} className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </section>
      )
    }
    return this.props.children
  }
}
