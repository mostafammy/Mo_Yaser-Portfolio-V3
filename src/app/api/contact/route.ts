import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return Response.json({ error: "Message is required" }, { status: 400 })
    }

    if (message.length > 1000) {
      return Response.json({ error: "Message too long" }, { status: 400 })
    }

    if (!process.env.RESEND_API_KEY) {
      console.warn("[contact] RESEND_API_KEY not configured — message not delivered")
      return Response.json({ success: true })
    }

    const { error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: "mostafa.yaser.developer@gmail.com",
      subject: `New message from mostafayaser.earth`,
      text: `New message:\n\n${message.trim()}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;background:#0a0a0a;color:#e5e5e5;border-radius:12px;overflow:hidden;">
          <div style="padding:32px 32px 0;border-bottom:1px solid #1f1f1f;">
            <div style="width:8px;height:8px;border-radius:50%;background:#3b82f6;margin-bottom:20px;"></div>
            <h2 style="font-size:20px;font-weight:600;color:#f0f0f0;margin:0 0 4px;">New contact message</h2>
            <p style="font-size:13px;color:#525252;margin:0 0 24px;">via mostafayaser.earth</p>
          </div>
          <div style="padding:28px 32px;">
            <p style="font-size:16px;line-height:1.7;color:#d4d4d4;margin:0;white-space:pre-wrap;">${message.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
          </div>
          <div style="padding:0 32px 28px;">
            <a href="https://mostafayaser.earth" style="font-size:12px;color:#3b82f6;text-decoration:none;">mostafayaser.earth</a>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error("[contact] Resend error:", error)
      return Response.json({ error: "Failed to send message" }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (err) {
    console.error("[contact] Unexpected error:", err)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
