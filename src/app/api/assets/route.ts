import { NextRequest, NextResponse } from 'next/server'

type AssetClass = 'CRYPTO' | 'FOREX' | 'INDEX' | 'MINERAL'

interface Asset {
  id: string
  symbol: string
  name: string
  class: AssetClass
  basePrice: number
  currentPrice: number
  priceChange: number
  priceChangePercent: number
  volume?: number
  marketCap?: number
  lastUpdated: string
}

const mockAssets: Asset[] = [
  {
    id: '1',
    symbol: 'BTC',
    name: 'Bitcoin',
    class: 'CRYPTO',
    basePrice: 65000,
    currentPrice: 67234.50,
    priceChange: 2234.50,
    priceChangePercent: 3.44,
    volume: 28500000000,
    marketCap: 1320000000000,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '2',
    symbol: 'ETH',
    name: 'Ethereum',
    class: 'CRYPTO',
    basePrice: 3400,
    currentPrice: 3456.78,
    priceChange: 56.78,
    priceChangePercent: 1.67,
    volume: 15000000000,
    marketCap: 415000000000,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '3',
    symbol: 'EUR/USD',
    name: 'Euro/US Dollar',
    class: 'FOREX',
    basePrice: 1.0900,
    currentPrice: 1.0845,
    priceChange: -0.0055,
    priceChangePercent: -0.50,
    volume: 500000000000,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '4',
    symbol: 'GBP/USD',
    name: 'British Pound/US Dollar',
    class: 'FOREX',
    basePrice: 1.2700,
    currentPrice: 1.2678,
    priceChange: -0.0022,
    priceChangePercent: -0.17,
    volume: 350000000000,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '5',
    symbol: 'S&P 500',
    name: 'S&P 500 Index',
    class: 'INDEX',
    basePrice: 5200,
    currentPrice: 5234.56,
    priceChange: 34.56,
    priceChangePercent: 0.66,
    volume: 2000000000,
    marketCap: 40000000000000,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '6',
    symbol: 'NASDAQ',
    name: 'NASDAQ Composite',
    class: 'INDEX',
    basePrice: 16500,
    currentPrice: 16789.23,
    priceChange: 289.23,
    priceChangePercent: 1.75,
    volume: 1500000000,
    marketCap: 28000000000000,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '7',
    symbol: 'GOLD',
    name: 'Gold',
    class: 'MINERAL',
    basePrice: 2280,
    currentPrice: 2345.60,
    priceChange: 65.60,
    priceChangePercent: 2.88,
    volume: 10000000,
    marketCap: 14000000000000,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '8',
    symbol: 'SILVER',
    name: 'Silver',
    class: 'MINERAL',
    basePrice: 27.50,
    currentPrice: 28.45,
    priceChange: 0.95,
    priceChangePercent: 3.45,
    volume: 500000,
    marketCap: 1700000000000,
    lastUpdated: new Date().toISOString()
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const assetClass = searchParams.get('class') as AssetClass | null

    let filteredAssets = mockAssets

    if (assetClass && Object.values(['CRYPTO', 'FOREX', 'INDEX', 'MINERAL']).includes(assetClass)) {
      filteredAssets = mockAssets.filter(asset => asset.class === assetClass)
    }

    return NextResponse.json({
      success: true,
      data: filteredAssets,
      count: filteredAssets.length
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch assets'
    }, { status: 500 })
  }
}
