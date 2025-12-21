import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const TelegramControlSchema = z.object({
  action: z.literal('send_message'),
  message: z.string().min(1),
  chat_id: z.string().optional(),
  parse_mode: z.string().optional(),
  meta: z.record(z.unknown()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const authHeader = request.headers.get('authorization')
    let user = null
    let userError: any = null

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '').trim()
      const {
        data,
        error,
      } = await supabase.auth.getUser(token)
      user = data.user
      userError = error
    } else {
      const {
        data,
        error,
      } = await supabase.auth.getUser()
      user = data.user
      userError = error
    }

    if (!user || userError) {
      console.error('Telegram control auth error:', userError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rawBody = await request.json()
    const body = TelegramControlSchema.parse(rawBody)

    const n8nUrl = process.env.N8N_TELEGRAM_CONTROL_WEBHOOK_URL
    const controlSecret = process.env.CONTROL_SECRET

    if (!n8nUrl || !controlSecret) {
      return NextResponse.json(
        {
          error:
            'Server misconfiguration: missing N8N_TELEGRAM_CONTROL_WEBHOOK_URL or CONTROL_SECRET',
        },
        { status: 500 }
      )
    }

    const payload = {
      ...body,
      user_id: user.id,
      source: 'web_app',
    }

    const n8nResponse = await fetch(n8nUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-header': controlSecret,
      },
      body: JSON.stringify(payload),
    })

    const text = await n8nResponse.text()
    let json: any = null
    try {
      json = text ? JSON.parse(text) : null
    } catch {
      // non‑JSON body from n8n is allowed
    }

    if (!n8nResponse.ok) {
      return NextResponse.json(
        {
          error: 'Upstream n8n error',
          status: n8nResponse.status,
          body: json ?? text,
        },
        { status: 502 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        n8n_status: n8nResponse.status,
        data: json,
      },
      { status: 200 }
    )
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Telegram control error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}