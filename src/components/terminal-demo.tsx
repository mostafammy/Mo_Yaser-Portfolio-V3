import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/ui/terminal"

export default function TerminalDemo() {
  return (
    <div className="flex items-center justify-center p-8">
      <Terminal>
        <TypingAnimation>pnpm dlx shadcn@latest init</TypingAnimation>
        <AnimatedSpan>✔ Preflight checks.</AnimatedSpan>
        <AnimatedSpan>✔ Validating Tailwind CSS.</AnimatedSpan>
        <TypingAnimation>
          Success! Project initialization completed.
        </TypingAnimation>
      </Terminal>
    </div>
  )
}
