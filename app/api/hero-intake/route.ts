import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient, isSupabaseConfigured } from '@/lib/supabase'
import { sendAdminNotification, isEmailConfigured } from '@/lib/email'

const schema = z.object({
  name: z.string().min(1).max(200),
  origin: z.string().max(200).optional(),
  month: z.string().max(20).optional(),
  items: z.array(z.string()).max(10),
})

export async function POST(req: NextRequest) {
  try {
    const result = schema.safeParse(await req.json())
    if (!result.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    const { name, origin, month, items } = result.data

    if (isSupabaseConfigured()) {
      const db = createAdminClient()
      await db.from('hero_intakes').insert({ name, origin, month, items })
    }

    if (isEmailConfigured()) {
      await sendAdminNotification(
        `New snapshot from ${name}`,
        `<p><strong>${name}</strong> from ${origin || '?'} is bringing: ${items.join(', ')}. Target: ${month || 'TBD'}</p>`
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('hero-intake:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
