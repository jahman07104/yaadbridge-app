import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient, isSupabaseConfigured } from '@/lib/supabase'

const postSchema = z.object({
  category: z.string().max(50),
  title: z.string().min(1).max(300),
  body: z.string().min(1).max(1000),
  authorName: z.string().max(200).optional(),
})

export async function GET(req: NextRequest) {
  if (!isSupabaseConfigured()) return NextResponse.json({ topics: [] })
  try {
    const category = req.nextUrl.searchParams.get('category')
    const db = createAdminClient()
    let query = db.from('topics').select('*').order('created_at', { ascending: false })
    if (category) query = query.eq('category', category)
    const { data } = await query
    return NextResponse.json({
      topics: (data || []).map((t) => ({
        id: t.id, title: t.title, body: t.body,
        replies: t.replies_count || 0,
        date: new Date(t.created_at).toLocaleDateString('en-JM', { year: 'numeric', month: 'short' }),
      }))
    })
  } catch (err) {
    console.error('topics GET:', err)
    return NextResponse.json({ topics: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const result = postSchema.safeParse(await req.json())
    if (!result.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    const d = result.data
    if (isSupabaseConfigured()) {
      const db = createAdminClient()
      await db.from('topics').insert({
        category: d.category, title: d.title, body: d.body,
        author_name: d.authorName || 'Anonymous', replies_count: 0,
      })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('topics POST:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
