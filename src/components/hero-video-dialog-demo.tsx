import { HeroVideoDialog } from "@/components/ui/hero-video-dialog"

export default function HeroVideoDialogDemo() {
  return (
    <HeroVideoDialog
      className="block dark:hidden"
      animationStyle="from-center"
      videoSrc="https://www.example.com/dummy-video"
      thumbnailSrc="https://www.example.com/dummy-thumbnail.png"
      thumbnailAlt="Dummy Video Thumbnail"
    />
  )
}
