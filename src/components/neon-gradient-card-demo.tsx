import { NeonGradientCard } from "@/components/ui/neon-gradient-card"

export default function NeonGradientCardDemo() {
  return (
    <div className="flex items-center justify-center p-8">
      <NeonGradientCard className="max-w-sm">
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
            Neon Gradient Card
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            A beautiful neon gradient card with animated borders that cycle
            through vibrant colors.
          </p>
          <span className="text-xs text-neutral-500">Hover me</span>
        </div>
      </NeonGradientCard>
    </div>
  )
}
