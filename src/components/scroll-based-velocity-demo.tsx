import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/ui/scroll-based-velocity"

export default function ScrollBasedVelocityDemo() {
  return (
    <ScrollVelocityContainer className="text-4xl font-bold md:text-7xl">
      <ScrollVelocityRow baseVelocity={20} direction={1}>
        Velocity Scroll
      </ScrollVelocityRow>
      <ScrollVelocityRow baseVelocity={20} direction={-1}>
        Velocity Scroll
      </ScrollVelocityRow>
    </ScrollVelocityContainer>
  )
}
