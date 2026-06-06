export type StatusType = "open" | "sprint" | "unavailable"

export const STATUS: {
  type: StatusType
  label: string
} = {
  type: "open",
  label: "Open to collaborate",
}
