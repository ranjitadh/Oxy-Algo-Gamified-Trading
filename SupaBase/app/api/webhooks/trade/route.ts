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

const TradeSchema = z.object({
  user_id: z.string().uuid(),
  account_id: z.string().uuid().optional(),
  symbol: z.string(),
  direction: z.enum(['BUY', 'SELL']),
  entry_price: z.number(),
  exit_price: z.number().optional(),
  lot_size: z.number().default(0.01),
  profit: z.number().default(0),
  status: z.enum(['OPEN', 'CLOSED', 'PENDING']).default('OPEN'),
  ai_comment: z.string().optional(),
  opened_at: z.string().optional(),
  closed_at: z.string().optional(),
  trade_id: z.string().uuid().optional(), // For updates
})

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const expectedSecret = process.env.WEBHOOK_SECRET

    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = TradeSchema.parse(body)

    const { user_id, trade_id, ...tradeData } = validatedData

    // Get or create account
    let accountId = validatedData.account_id
    if (!accountId) {
      const { data: account } = await supabaseAdmin
        .from('accounts')
        .select('id')
        .eq('user_id', user_id)
        .single()

      if (!account) {
        // Create account if it doesn't exist
        const { data: newAccount, error: accountError } = await supabaseAdmin
          .from('accounts')
          .insert({
            user_id,
            balance: 0,
            equity: 0,
            bot_status: false,
          })
          .select()
          .single()

        if (accountError) {
          return NextResponse.json(
            { error: 'Failed to create account', details: accountError.message },
            { status: 500 }
          )
        }

        accountId = newAccount.id
      } else {
        accountId = account.id
      }
    }

    // Update or insert trade
    if (trade_id) {
      // Update existing trade
      const { data, error } = await supabaseAdmin
        .from('trades')
        .update({
          ...tradeData,
          account_id: accountId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', trade_id)
        .eq('user_id', user_id)
        .select()
        .single()

      if (error) {
        return NextResponse.json(
          { error: 'Failed to update trade', details: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, trade: data })
    } else {
      // Insert new trade
      const { data, error } = await supabaseAdmin
        .from('trades')
        .insert({
          ...tradeData,
          user_id,
          account_id: accountId,
          opened_at: validatedData.opened_at || new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        return NextResponse.json(
          { error: 'Failed to create trade', details: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, trade: data })
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


