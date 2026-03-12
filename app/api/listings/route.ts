import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient, isSupabaseConfigured } from '@/lib/supabase'

const postSchema = z.object({
  listingType: z.enum(['offer', 'need']),
  category: z.string().max(100),
  categoryLabel: z.string().max(100).optional(),
  title: z.string().min(1).max(300),
  description: z.string().min(1).max(800),
  contact: z.string().min(1).max(200),
})

export async function GET(req: NextRequest) {
  if (!isSupabaseConfigured()) return NextResponse.json({ listings: [] })
  try {
    const category = req.nextUrl.searchParams.get('category')
    const db = createAdminClient()
    let query = db.from('listings').select('*').eq('is_active', true).order('created_at', { ascending: false })
    if (category && category !== 'all') query = query.eq('category', category)
    const { data } = await query
    return NextResponse.json({
      listings: (data || []).map((l) => ({
        id: l.id, listingType: l.listing_type, category: l.category,
        categoryLabel: l.category_label, title: l.title,
        description: l.description, contact: l.contact,
      }))
    })
  } catch (err) {
    console.error('listings GET:', err)
    return NextResponse.json({ listings: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const result = postSchema.safeParse(await req.json())
    if (!result.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    const d = result.data
    if (isSupabaseConfigured()) {
      const db = createAdminClient()
      await db.from('listings').insert({
        listing_type: d.listingType, category: d.category,
        category_label: d.categoryLabel || d.category,
        title: d.title, description: d.description, contact: d.contact, is_active: true,
      })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('listings POST:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
