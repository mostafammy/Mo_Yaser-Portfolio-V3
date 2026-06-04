import { DotPattern } from "@/components/ui/dot-pattern"

export default function DotPatternDemo() {
  return (
    <div className="relative flex h-[500px] w-full items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
      <p className="z-10 whitespace-pre-wrap text-center text-5xl font-medium tracking-tighter text-black dark:text-white">
        Dot Pattern
      </p>
      <DotPattern />
    </div>
  )
}
