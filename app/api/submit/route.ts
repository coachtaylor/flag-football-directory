import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { type, payload, source } = body || {}
  if (!type || !payload) return NextResponse.json({ ok: false, error: 'Missing type/payload' }, { status: 400 })

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string)
  const { error } = await supabase.from('submissions').insert([{ type, payload, source: source || 'api', status: 'new' }])
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
