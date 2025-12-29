import { NextRequest, NextResponse } from 'next/server'

type SignalType = 'BUY' | 'SELL' | 'HOLD'
type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH'
type AssetClass = 'CRYPTO' | 'FOREX' | 'INDEX' | 'MINERAL'

interface Signal {
  id: string
  symbol: string
  name: string
  type: SignalType
  confidence: number
  riskLevel: RiskLevel
  currentPrice: number
  targetPrice?: number
  stopLoss?: number
  reasoning?: string
  patterns?: string
  class: AssetClass
  createdAt: string
}

const mockSignals: Signal[] = [
  {
    id: '1',
    symbol: 'BTC',
    name: 'Bitcoin',
    type: 'BUY',
    confidence: 78,
    riskLevel: 'HIGH',
    currentPrice: 67234.50,
    targetPrice: 72000,
    stopLoss: 64000,
    reasoning: 'Strong momentum with increasing institutional interest. RSI showing oversold conditions.',
    patterns: 'Breakout, Bullish Flag',
    class: 'CRYPTO',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    symbol: 'ETH',
    name: 'Ethereum',
    type: 'HOLD',
    confidence: 65,
    riskLevel: 'MEDIUM',
    currentPrice: 3456.78,
    targetPrice: 3800,
    reasoning: 'Consolidation phase. Wait for breakout above resistance.',
    patterns: 'Consolidation, Triangle',
    class: 'CRYPTO',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    symbol: 'EUR/USD',
    name: 'Euro/US Dollar',
    type: 'SELL',
    confidence: 72,
    riskLevel: 'MEDIUM',
    currentPrice: 1.0845,
    targetPrice: 1.0750,
    reasoning: 'Bearish divergence on daily chart. ECB expected to maintain dovish stance.',
    patterns: 'Double Top, Bearish Divergence',
    class: 'FOREX',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    symbol: 'GBP/USD',
    name: 'British Pound/US Dollar',
    type: 'HOLD',
    confidence: 58,
    riskLevel: 'LOW',
    currentPrice: 1.2678,
    reasoning: 'Sideways trading. No clear directional bias.',
    patterns: 'Sideways Channel',
    class: 'FOREX',
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    symbol: 'S&P 500',
    name: 'S&P 500 Index',
    type: 'BUY',
    confidence: 71,
    riskLevel: 'LOW',
    currentPrice: 5234.56,
    targetPrice: 5400,
    reasoning: 'Positive earnings season and strong economic data supporting growth.',
    patterns: 'Uptrend, Ascending Triangle',
    class: 'INDEX',
    createdAt: new Date().toISOString()
  },
  {
    id: '6',
    symbol: 'GOLD',
    name: 'Gold',
    type: 'BUY',
    confidence: 68,
    riskLevel: 'LOW',
    currentPrice: 2345.60,
    targetPrice: 2450,
    reasoning: 'Safe-haven demand amid geopolitical tensions. Central bank buying continues.',
    patterns: 'Uptrend, Support Hold',
    class: 'MINERAL',
    createdAt: new Date().toISOString()
  },
  {
    id: '7',
    symbol: 'SILVER',
    name: 'Silver',
    type: 'HOLD',
    confidence: 61,
    riskLevel: 'MEDIUM',
    currentPrice: 28.45,
    reasoning: 'Consolidating above key support. Monitor industrial demand trends.',
    patterns: 'Consolidation, Rectangle',
    class: 'MINERAL',
    createdAt: new Date().toISOString()
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const assetClass = searchParams.get('class') as AssetClass | null
    const signalType = searchParams.get('type') as SignalType | null

    let filteredSignals = mockSignals

    if (assetClass) {
      filteredSignals = filteredSignals.filter(signal => signal.class === assetClass)
    }

    if (signalType) {
      filteredSignals = filteredSignals.filter(signal => signal.type === signalType)
    }

    return NextResponse.json({
      success: true,
      data: filteredSignals,
      count: filteredSignals.length
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch signals'
    }, { status: 500 })
  }
}
