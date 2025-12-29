import { NextRequest, NextResponse } from 'next/server'

interface Alert {
  id: string
  symbol: string
  name: string
  condition: string
  threshold: number
  isActive: boolean
  isTriggered: boolean
  triggeredAt?: string
  createdAt: string
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    symbol: 'BTC',
    name: 'Bitcoin',
    condition: 'PRICE_ABOVE',
    threshold: 70000,
    isActive: true,
    isTriggered: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    symbol: 'EUR/USD',
    name: 'Euro/US Dollar',
    condition: 'PRICE_BELOW',
    threshold: 1.0800,
    isActive: true,
    isTriggered: true,
    triggeredAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '3',
    symbol: 'GOLD',
    name: 'Gold',
    condition: 'PERCENT_CHANGE',
    threshold: 5,
    isActive: true,
    isTriggered: false,
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isTriggered = searchParams.get('triggered') === 'true'
    const isActive = searchParams.get('active') !== 'false'

    let filteredAlerts = mockAlerts

    if (isTriggered !== undefined) {
      filteredAlerts = filteredAlerts.filter(alert => alert.isTriggered === isTriggered)
    }

    if (isActive !== undefined) {
      filteredAlerts = filteredAlerts.filter(alert => alert.isActive === isActive)
    }

    return NextResponse.json({
      success: true,
      data: filteredAlerts,
      count: filteredAlerts.length
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch alerts'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newAlert: Alert = {
      id: `alert-${Date.now()}`,
      symbol: body.symbol,
      name: body.name,
      condition: body.condition,
      threshold: body.threshold,
      isActive: true,
      isTriggered: false,
      createdAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: newAlert
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to create alert'
    }, { status: 500 })
  }
}
