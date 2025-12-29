import { NextRequest, NextResponse } from 'next/server'

interface ExternalAssetData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap?: number
}

// Mock external API responses
const mockExternalData: Record<string, ExternalAssetData> = {
  BTC: {
    symbol: 'BTC',
    price: 67234.50,
    change: 2234.50,
    changePercent: 3.44,
    volume: 28500000000,
    marketCap: 1320000000000
  },
  ETH: {
    symbol: 'ETH',
    price: 3456.78,
    change: 56.78,
    changePercent: 1.67,
    volume: 15000000000,
    marketCap: 415000000000
  },
  SOL: {
    symbol: 'SOL',
    price: 142.35,
    change: 8.45,
    changePercent: 6.31,
    volume: 3200000000,
    marketCap: 62000000000
  }
}

async function fetchFromCryptoCompare(symbol: string): Promise<ExternalAssetData | null> {
  try {
    const response = await fetch(
      `https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USD`
    )

    if (!response.ok) {
      throw new Error('CryptoCompare API error')
    }

    const data = await response.json()

    return {
      symbol,
      price: data.USD,
      change: 0,
      changePercent: 0,
      volume: 0
    }
  } catch (error) {
    console.error('Error fetching from CryptoCompare:', error)
    return null
  }
}

async function fetchFromCoinGecko(symbol: string): Promise<ExternalAssetData | null> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${symbol.toLowerCase()}&vs_currencies=usd&include_24hr_change=true`
    )

    if (!response.ok) {
      throw new Error('CoinGecko API error')
    }

    const data = await response.json()

    const assetData = data[symbol.toLowerCase()]
    if (!assetData) {
      return null
    }

    return {
      symbol,
      price: assetData.usd,
      change: assetData.usd_24h_change || 0,
      changePercent: assetData.usd_24h_change || 0,
      volume: 0
    }
  } catch (error) {
    console.error('Error fetching from CoinGecko:', error)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')
    const useRealData = searchParams.get('real') === 'true'

    if (!symbol) {
      return NextResponse.json({
        success: false,
        error: 'Symbol parameter is required'
      }, { status: 400 })
    }

    if (useRealData) {
      // Try fetching from multiple sources
      let data = await fetchFromCoinGecko(symbol)

      if (!data) {
        data = await fetchFromCryptoCompare(symbol)
      }

      if (data) {
        return NextResponse.json({
          success: true,
          data,
          source: 'external'
        })
      }
    }

    // Fall back to mock data
    const mockData = mockExternalData[symbol.toUpperCase()]
    if (mockData) {
      return NextResponse.json({
        success: true,
        data: mockData,
        source: 'mock'
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Asset not found'
    }, { status: 404 })
  } catch (error) {
    console.error('Market data API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch market data'
    }, { status: 500 })
  }
}
