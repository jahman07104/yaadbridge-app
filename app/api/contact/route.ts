import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient, isSupabaseConfigured } from '@/lib/supabase'
import { sendAdminNotification, sendClientConfirmation, isEmailConfigured } from '@/lib/email'

const schema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  message: z.string().min(1).max(1000),
})

export async function POST(req: NextRequest) {
  try {
    const result = schema.safeParse(await req.json())
    if (!result.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    const d = result.data

    if (isSupabaseConfigured()) {
      const db = createAdminClient()
      await db.from('contacts').insert({ name: d.name, email: d.email, message: d.message })
    }

    if (isEmailConfigured()) {
      await sendAdminNotification(
        `New message from ${d.name}`,
        `<p><b>From:</b> ${d.name} (${d.email})</p><p>${d.message}</p>`
      )
      await sendClientConfirmation(d.email, 'We received your message — YardBridge',
        `<p>Hi ${d.name}, thanks for reaching out. We will get back to you within one business day.</p>
         <p>Warm regards,<br>YardBridge Consulting</p>`
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('contact:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
