import { AvatarCircles } from "@/components/ui/avatar-circles"

export default function AvatarCirclesDemo() {
  return (
    <AvatarCircles
      numPeople={99}
      avatarUrls={[
        {
          imageUrl: "https://avatars.githubusercontent.com/u/16860528",
          profileUrl: "https://github.com/dillionverma",
        },
      ]}
    />
  )
}
