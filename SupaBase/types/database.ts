export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      accounts: {
        Row: {
          id: string
          user_id: string
          balance: number
          equity: number
          bot_status: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          balance?: number
          equity?: number
          bot_status?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          balance?: number
          equity?: number
          bot_status?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      trades: {
        Row: {
          id: string
          user_id: string
          account_id: string
          symbol: string
          direction: 'BUY' | 'SELL'
          entry_price: number
          exit_price: number | null
          lot_size: number
          profit: number
          status: 'OPEN' | 'CLOSED' | 'PENDING'
          ai_comment: string | null
          opened_at: string
          closed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          account_id: string
          symbol: string
          direction: 'BUY' | 'SELL'
          entry_price: number
          exit_price?: number | null
          lot_size?: number
          profit?: number
          status?: 'OPEN' | 'CLOSED' | 'PENDING'
          ai_comment?: string | null
          opened_at?: string
          closed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          account_id?: string
          symbol?: string
          direction?: 'BUY' | 'SELL'
          entry_price?: number
          exit_price?: number | null
          lot_size?: number
          profit?: number
          status?: 'OPEN' | 'CLOSED' | 'PENDING'
          ai_comment?: string | null
          opened_at?: string
          closed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      screenshots: {
        Row: {
          id: string
          trade_id: string
          storage_path: string
          created_at: string
        }
        Insert: {
          id?: string
          trade_id: string
          storage_path: string
          created_at?: string
        }
        Update: {
          id?: string
          trade_id?: string
          storage_path?: string
          created_at?: string
        }
      }
      signals: {
        Row: {
          id: string
          user_id: string
          symbol: string
          direction: 'BUY' | 'SELL'
          entry_price: number
          take_profit: number | null
          stop_loss: number | null
          confidence_score: number | null
          notes: string | null
          signal_type: 'DAILY' | 'WEEKLY'
          created_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          symbol: string
          direction: 'BUY' | 'SELL'
          entry_price: number
          take_profit?: number | null
          stop_loss?: number | null
          confidence_score?: number | null
          notes?: string | null
          signal_type: 'DAILY' | 'WEEKLY'
          created_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          symbol?: string
          direction?: 'BUY' | 'SELL'
          entry_price?: number
          take_profit?: number | null
          stop_loss?: number | null
          confidence_score?: number | null
          notes?: string | null
          signal_type?: 'DAILY' | 'WEEKLY'
          created_at?: string
          expires_at?: string | null
        }
      }
      alerts: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          alert_type: string
          seen: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          alert_type?: string
          seen?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          alert_type?: string
          seen?: boolean
          created_at?: string
        }
      }
    }
  }
}



