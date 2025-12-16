// Shared types between frontend and backend

export enum SignalStatus {
  GOOD = 'GOOD',
  NEUTRAL = 'NEUTRAL',
  AVOID = 'AVOID',
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum ActionType {
  SECURE_PROFITS = 'SECURE_PROFITS',
  REDUCE_EXPOSURE = 'REDUCE_EXPOSURE',
  EXIT_CLEAN = 'EXIT_CLEAN',
  PAUSE_SYSTEM = 'PAUSE_SYSTEM',
  ACTIVATE_STRATEGY = 'ACTIVATE_STRATEGY',
  DEACTIVATE_STRATEGY = 'DEACTIVATE_STRATEGY',
}

export enum ActionStatus {
  QUEUED = 'QUEUED',
  RUNNING = 'RUNNING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export enum TradeOutcome {
  WIN = 'WIN',
  LOSS = 'LOSS',
  BREAKEVEN = 'BREAKEVEN',
}

export interface Instrument {
  id: string
  symbol: string
  displayName: string
  enabled: boolean
}

export interface SignalSnapshot {
  id: string
  instrumentId: string
  confidence: number
  status: SignalStatus
  risk: RiskLevel
  activeStrategyName: string | null
  timestamp: string
}

export interface InstrumentWithSignal extends Instrument {
  signal?: SignalSnapshot
}

export interface Strategy {
  id: string
  key: string
  name: string
  description: string | null
  riskProfile: string
  enabled: boolean
  monthlyPerformance?: number
  winRate?: number
  marketFitNow?: number
}

export interface StrategyActivation {
  id: string
  userId: string
  strategyId: string
  instrumentId: string | null
  status: 'ACTIVE' | 'PAUSED' | 'INACTIVE'
  createdAt: string
  strategy?: Strategy
  instrument?: Instrument
}

export interface Trade {
  id: string
  userId: string
  instrumentId: string
  strategyId: string | null
  openedAt: string
  closedAt: string | null
  outcome: TradeOutcome
  pnlPct: number | null
  beforeImageUrl: string | null
  afterImageUrl: string | null
  aiSummary: string | null
  instrument?: Instrument
  strategy?: Strategy
}

export interface Action {
  id: string
  userId: string
  type: ActionType
  status: ActionStatus
  requestPayload?: any
  responsePayload?: any
  errorMessage?: string
  createdAt: string
  updatedAt: string
}

export interface ChatMessage {
  id: string
  threadId: string
  role: 'user' | 'assistant'
  content: string
  creditsCost: number | null
  createdAt: string
}

export interface ChatThread {
  id: string
  userId: string
  createdAt: string
  messages?: ChatMessage[]
}

export interface User {
  id: string
  email: string
  role: 'USER' | 'ADMIN'
  creditsBalance: number
}

export interface CreditLedgerEntry {
  id: string
  userId: string
  delta: number
  reason: string
  refType: string | null
  refId: string | null
  createdAt: string
}

