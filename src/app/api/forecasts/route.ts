import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

type AssetClass = 'CRYPTO' | 'FOREX' | 'INDEX' | 'MINERAL'

interface Forecast {
  id: string
  symbol: string
  name: string
  timeHorizon: string
  predictedPrice: number
  confidence: number
  rationale: string
  keyFactors: string[]
  currentPrice: number
  aiGenerated: boolean
  createdAt: string
}

const baseForecasts: Omit<Forecast, 'id' | 'aiGenerated' | 'createdAt'>[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    timeHorizon: '30 days',
    predictedPrice: 72000,
    confidence: 78,
    rationale: '',
    keyFactors: [
      'Institutional adoption increasing',
      'ETF inflows remain positive',
      'Halving cycle support',
      'Strong network fundamentals'
    ],
    currentPrice: 67234.50
  },
  {
    symbol: 'EUR/USD',
    name: 'Euro/US Dollar',
    timeHorizon: '7 days',
    predictedPrice: 1.0750,
    confidence: 72,
    rationale: '',
    keyFactors: [
      'ECB dovish stance',
      'US economic outperformance',
      'Geopolitical factors',
      'Trade balance data'
    ],
    currentPrice: 1.0845
  },
  {
    symbol: 'GOLD',
    name: 'Gold',
    timeHorizon: '60 days',
    predictedPrice: 2450,
    confidence: 68,
    rationale: '',
    keyFactors: [
      'Central bank purchases',
      'Inflation hedge demand',
      'Geopolitical uncertainty',
      'Currency depreciation risks'
    ],
    currentPrice: 2345.60
  }
]

async function generateAIRationale(assetName: string, currentPrice: number, predictedPrice: number, factors: string[]): Promise<string> {
  try {
    const zai = await ZAI.create()

    const systemPrompt = `You are an expert financial analyst and trading advisor. Provide clear, concise market analysis and rationales for price forecasts. Always include appropriate risk warnings and disclaimers about the limitations of AI predictions.`

    const userPrompt = `Provide a brief analysis and rationale for the following forecast:

Asset: ${assetName}
Current Price: ${currentPrice}
Predicted Price: ${predictedPrice}
Time Horizon: Based on key factors

Key Factors:
${factors.map(f => `- ${f}`).join('\n')}

Provide a 2-3 sentence explanation of why this price movement is expected, based on the factors listed. Keep it professional and objective.`

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      thinking: { type: 'disabled' }
    })

    return completion.choices[0]?.message?.content || 'Analysis based on technical indicators and market conditions.'
  } catch (error) {
    console.error('AI generation error:', error)
    return 'Analysis based on technical indicators and market conditions.'
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')
    const useAI = searchParams.get('ai') === 'true'

    let forecasts = baseForecasts

    if (symbol) {
      forecasts = forecasts.filter(f => f.symbol.toLowerCase() === symbol.toLowerCase())
    }

    if (useAI) {
      forecasts = await Promise.all(forecasts.map(async (forecast) => {
        const rationale = await generateAIRationale(
          forecast.name,
          forecast.currentPrice,
          forecast.predictedPrice,
          forecast.keyFactors
        )

        return {
          ...forecast,
          id: `${forecast.symbol}-${Date.now()}`,
          rationale,
          aiGenerated: true,
          createdAt: new Date().toISOString()
        }
      }))
    } else {
      forecasts = forecasts.map(forecast => ({
        ...forecast,
        id: `${forecast.symbol}-${Date.now()}`,
        rationale: `Based on historical patterns and current market conditions, ${forecast.name} shows ${forecast.predictedPrice > forecast.currentPrice ? 'bullish' : 'bearish'} potential for the ${forecast.timeHorizon} timeframe. Technical analysis and market sentiment suggest this price target.`,
        aiGenerated: false,
        createdAt: new Date().toISOString()
      }))
    }

    return NextResponse.json({
      success: true,
      data: forecasts,
      count: forecasts.length
    })
  } catch (error) {
    console.error('Forecast API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate forecasts'
    }, { status: 500 })
  }
}
