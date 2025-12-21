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

const AccountSchema = z.object({
  user_id: z.string().uuid(),
  balance: z.number().optional(),
  equity: z.number().optional(),
  bot_status: z.boolean().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const expectedSecret = process.env.WEBHOOK_SECRET

    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = AccountSchema.parse(body)

    const { user_id, ...updateData } = validatedData

    // Get existing account or create new one
    const { data: existingAccount } = await supabaseAdmin
      .from('accounts')
      .select('*')
      .eq('user_id', user_id)
      .single()

    if (existingAccount) {
      // Update existing account
      const { data, error } = await supabaseAdmin
        .from('accounts')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user_id)
        .select()
        .single()

      if (error) {
        return NextResponse.json(
          { error: 'Failed to update account', details: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, account: data })
    } else {
      // Create new account
      const { data, error } = await supabaseAdmin
        .from('accounts')
        .insert({
          user_id,
          balance: updateData.balance || 0,
          equity: updateData.equity || 0,
          bot_status: updateData.bot_status || false,
        })
        .select()
        .single()

      if (error) {
        return NextResponse.json(
          { error: 'Failed to create account', details: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, account: data })
    }
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



