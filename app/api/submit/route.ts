import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const contentType = req.headers.get('content-type') || ''
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  )

  // Handle FormData (for free-agent with file uploads)
  if (contentType.includes('multipart/form-data')) {
    try {
      const formData = await req.formData()
      const type = formData.get('type') as string

      if (type === 'free-agent') {
        // Extract form fields
        const payload: any = {
          first_name: formData.get('first_name'),
          last_name: formData.get('last_name'),
          email: formData.get('email'),
          phone: formData.get('phone') || null,
          instagram: formData.get('instagram') || null,
          city: formData.get('city'),
          state: formData.get('state'),
          age_category: formData.get('age_category'),
          age: formData.get('age') ? Number(formData.get('age')) : null,
          gender: formData.get('gender'),
          position: formData.get('position') || null,
          skill_level: formData.get('skill_level'),
          experience: formData.get('experience') || null,
          availability: JSON.parse(formData.get('availability') as string || '[]'),
          looking_for: JSON.parse(formData.get('looking_for') as string || '[]'),
          travel_distance: formData.get('travel_distance') || null,
          bio: formData.get('bio') || null,
        }

        // Handle photo uploads
        const photoCount = Number(formData.get('photo_count') || 0)
        const photoUrls: string[] = []
        for (let i = 0; i < photoCount; i++) {
          const photo = formData.get(`photo_${i}`) as File
          if (photo && photo.size > 0) {
            const fileName = `${Date.now()}_${i}_${photo.name}`
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('free-agent-media')
              .upload(`photos/${fileName}`, photo)

            if (!uploadError && uploadData) {
              const { data: urlData } = supabase.storage
                .from('free-agent-media')
                .getPublicUrl(uploadData.path)
              photoUrls.push(urlData.publicUrl)
            }
          }
        }

        // Handle video uploads
        const videoCount = Number(formData.get('video_count') || 0)
        const videoUrls: string[] = []
        for (let i = 0; i < videoCount; i++) {
          const video = formData.get(`video_${i}`) as File
          if (video && video.size > 0) {
            const fileName = `${Date.now()}_${i}_${video.name}`
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('free-agent-media')
              .upload(`videos/${fileName}`, video)

            if (!uploadError && uploadData) {
              const { data: urlData } = supabase.storage
                .from('free-agent-media')
                .getPublicUrl(uploadData.path)
              videoUrls.push(urlData.publicUrl)
            }
          }
        }

        payload.photo_urls = photoUrls
        payload.video_urls = videoUrls

        // Insert into free_agents table (or submissions table)
        const { error } = await supabase.from('submissions').insert([
          {
            type: 'free-agent',
            payload,
            source: 'api',
            status: 'new',
          },
        ])

        if (error) {
          return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
        }

        return NextResponse.json({ ok: true })
      }

      return NextResponse.json({ ok: false, error: 'Unsupported type' }, { status: 400 })
    } catch (error: any) {
      return NextResponse.json(
        { ok: false, error: error.message || 'Failed to process FormData' },
        { status: 500 }
      )
    }
  }

  // Handle JSON (for existing forms)
  try {
    const body = await req.json()
    const { type, payload, source } = body || {}
    if (!type || !payload)
      return NextResponse.json({ ok: false, error: 'Missing type/payload' }, { status: 400 })

    const { error } = await supabase
      .from('submissions')
      .insert([{ type, payload, source: source || 'api', status: 'new' }])
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message || 'Failed to process request' },
      { status: 500 }
    )
  }
}
