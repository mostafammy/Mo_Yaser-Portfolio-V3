import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/ui/terminal"

export default function TerminalDemo2() {
  return (
    <div className="flex items-center justify-center p-8">
      <Terminal>
        <TypingAnimation duration={100}>
          git commit -m "initial setup"
        </TypingAnimation>
        <AnimatedSpan>[main (root-commit) abc1234] initial setup</AnimatedSpan>
        <AnimatedSpan> 42 files changed, 1024 insertions(+)</AnimatedSpan>
        <TypingAnimation duration={80}>
          git push origin main
        </TypingAnimation>
        <AnimatedSpan>✔ Everything up-to-date</AnimatedSpan>
      </Terminal>
    </div>
  )
}
