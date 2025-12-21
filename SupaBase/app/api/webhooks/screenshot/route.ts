import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

const ScreenshotSchema = z.object({
  trade_id: z.string().uuid(),
  storage_path: z.string(),
  image_url: z.string().url().optional(), // If n8n uploads directly, provide the URL
  image_data: z.string().optional(), // Base64 encoded image data
})

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const expectedSecret = process.env.WEBHOOK_SECRET

    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = ScreenshotSchema.parse(body)

    let storagePath = validatedData.storage_path

    // If image_data is provided, upload it to Supabase Storage
    if (validatedData.image_data) {
      const imageBuffer = Buffer.from(validatedData.image_data, 'base64')
      const fileName = `${validatedData.trade_id}/${Date.now()}.png`

      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('screenshots')
        .upload(fileName, imageBuffer, {
          contentType: 'image/png',
          upsert: false,
        })

      if (uploadError) {
        return NextResponse.json(
          { error: 'Failed to upload image', details: uploadError.message },
          { status: 500 }
        )
      }

      storagePath = uploadData.path
    } else if (validatedData.image_url) {
      // If image_url is provided, download and upload to Supabase Storage
      const response = await fetch(validatedData.image_url)
      const imageBuffer = await response.arrayBuffer()
      const fileName = `${validatedData.trade_id}/${Date.now()}.png`

      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('screenshots')
        .upload(fileName, imageBuffer, {
          contentType: 'image/png',
          upsert: false,
        })

      if (uploadError) {
        return NextResponse.json(
          { error: 'Failed to upload image', details: uploadError.message },
          { status: 500 }
        )
      }

      storagePath = uploadData.path
    }

    // Verify trade exists
    const { data: trade } = await supabaseAdmin
      .from('trades')
      .select('id, user_id')
      .eq('id', validatedData.trade_id)
      .single()

    if (!trade) {
      return NextResponse.json(
        { error: 'Trade not found' },
        { status: 404 }
      )
    }

    // Insert screenshot record
    const { data, error } = await supabaseAdmin
      .from('screenshots')
      .insert({
        trade_id: validatedData.trade_id,
        storage_path: storagePath,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create screenshot record', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, screenshot: data })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}



