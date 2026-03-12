import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient, isSupabaseConfigured } from '@/lib/supabase'
import { sendAdminNotification, sendClientConfirmation, isEmailConfigured } from '@/lib/email'

const schema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().max(50).optional(),
  origin: z.string().min(1).max(200),
  rooms: z.union([z.string(), z.number()]).optional(),
  volume: z.string().max(100).optional(),
  goodsNotes: z.string().max(600).optional(),
  notes: z.string().max(1000).optional(),
  vehicles: z.array(z.record(z.string(), z.unknown())).optional(),
  tools: z.array(z.record(z.string(), z.unknown())).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const result = schema.safeParse(await req.json())
    if (!result.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    const d = result.data

    if (isSupabaseConfigured()) {
      const db = createAdminClient()
      await db.from('quotes').insert({
        name: d.name, email: d.email, phone: d.phone, origin: d.origin,
        rooms: d.rooms ? Number(d.rooms) : null, volume: d.volume,
        goods_notes: d.goodsNotes, notes: d.notes,
        vehicles: d.vehicles || [], tools: d.tools || [], status: 'new',
      })
    }

    if (isEmailConfigured()) {
      const vSummary = (d.vehicles || []).map((v) => `${v.make} (${v.year})`).join(', ')
      await sendAdminNotification(
        `New quote from ${d.name}`,
        `<h3>Quote Request</h3>
         <p><b>Name:</b> ${d.name} | <b>Email:</b> ${d.email} | <b>Phone:</b> ${d.phone || '—'}</p>
         <p><b>From:</b> ${d.origin} | <b>Rooms:</b> ${d.rooms || '—'} | <b>Volume:</b> ${d.volume || '—'}</p>
         <p><b>Goods:</b> ${d.goodsNotes || '—'}</p>
         ${vSummary ? `<p><b>Vehicles:</b> ${vSummary}</p>` : ''}
         <p><b>Notes:</b> ${d.notes || '—'}</p>`
      )
      await sendClientConfirmation(d.email, 'Your YardBridge quote request',
        `<p>Hi ${d.name}, we received your quote and will reply within 1–2 business days.</p>
         <p>WhatsApp us anytime: +1 (876) 555-1234</p>
         <p>Warm regards,<br>YardBridge Consulting</p>`
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('quote:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
