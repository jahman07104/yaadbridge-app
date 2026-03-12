import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient, isSupabaseConfigured } from '@/lib/supabase'

const postSchema = z.object({
  postId: z.string().max(50),
  name: z.string().min(1).max(200),
  body: z.string().min(1).max(500),
  date: z.string().optional(),
})

export async function GET(req: NextRequest) {
  const postId = req.nextUrl.searchParams.get('postId')
  if (!postId || !isSupabaseConfigured()) return NextResponse.json({ comments: [] })
  try {
    const db = createAdminClient()
    const { data } = await db.from('comments').select('*')
      .eq('post_id', postId).eq('is_approved', true)
      .order('created_at', { ascending: true })
    return NextResponse.json({
      comments: (data || []).map((c) => ({
        name: c.author_name, body: c.body,
        date: new Date(c.created_at).toLocaleDateString('en-JM', { year: 'numeric', month: 'short', day: 'numeric' }),
      }))
    })
  } catch (err) {
    console.error('comments GET:', err)
    return NextResponse.json({ comments: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const result = postSchema.safeParse(await req.json())
    if (!result.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    const d = result.data
    if (isSupabaseConfigured()) {
      const db = createAdminClient()
      await db.from('comments').insert({ post_id: d.postId, author_name: d.name, body: d.body, is_approved: false })
    }
    return NextResponse.json({ ok: true, comment: { name: d.name, body: d.body, date: d.date || '' } })
  } catch (err) {
    console.error('comments POST:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
