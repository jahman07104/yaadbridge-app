import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient, isSupabaseConfigured } from '@/lib/supabase'
import { sendAdminNotification, sendClientConfirmation, isEmailConfigured } from '@/lib/email'

const schema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  sessionType: z.string().max(100).optional(),
  slot: z.string().max(100),
  slotLabel: z.string().max(200).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const result = schema.safeParse(await req.json())
    if (!result.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    const d = result.data

    if (isSupabaseConfigured()) {
      const db = createAdminClient()
      await db.from('bookings').insert({
        name: d.name, email: d.email,
        session_type: d.sessionType, slot: d.slot,
        slot_label: d.slotLabel, status: 'pending',
      })
    }

    if (isEmailConfigured()) {
      await sendAdminNotification(
        `New booking: ${d.name} — ${d.slotLabel || d.slot}`,
        `<p><b>${d.name}</b> (${d.email}) booked: ${d.slotLabel || d.slot}</p>
         <p>Session: ${d.sessionType || 'General'}</p>`
      )
      await sendClientConfirmation(d.email, 'Your consultation is confirmed — YardBridge',
        `<p>Hi ${d.name}, your booking for <b>${d.slotLabel || d.slot}</b> is confirmed.</p>
         <p>We will send a meeting link shortly. See you then!</p>
         <p>Warm regards,<br>YardBridge Consulting</p>`
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('booking:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
