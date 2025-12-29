'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'

type AssetClass = 'CRYPTO' | 'FOREX' | 'INDEX' | 'MINERAL'
type TimeRange = '1D' | '1W' | '1M' | '3M' | '1Y'

interface PriceDataPoint {
  time: string
  price: number
  volume?: number
}

const mockChartData: Record<string, PriceDataPoint[]> = {
  BTC: generateMockData(65000, 72000, 100),
  ETH: generateMockData(3200, 3800, 100),
  'EUR/USD': generateMockData(1.07, 1.10, 100, true),
  'GBP/USD': generateMockData(1.25, 1.28, 100, true),
  'S&P 500': generateMockData(5100, 5400, 100),
  NASDAQ: generateMockData(16200, 17000, 100),
  GOLD: generateMockData(2200, 2500, 100),
  SILVER: generateMockData(26, 30, 100, true)
}

function generateMockData(min: number, max: number, points: number, isForex: boolean = false): PriceDataPoint[] {
  const data: PriceDataPoint[] = []
  let currentPrice = min + (max - min) * 0.5

  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.5) * ((max - min) / 20)
    currentPrice += change
    currentPrice = Math.max(min, Math.min(max, currentPrice))

    data.push({
      time: `${i}`,
      price: parseFloat(currentPrice.toFixed(isForex ? 4 : 2)),
      volume: Math.floor(Math.random() * 1000000)
    })
  }

  return data
}

export function PriceCharts() {
  const [selectedAsset, setSelectedAsset] = useState<string>('BTC')
  const [timeRange, setTimeRange] = useState<TimeRange>('1D')
  const [chartType, setChartType] = useState<'line' | 'area'>('line')

  const assets = [
    { value: 'BTC', label: 'Bitcoin', class: 'CRYPTO' },
    { value: 'ETH', label: 'Ethereum', class: 'CRYPTO' },
    { value: 'EUR/USD', label: 'EUR/USD', class: 'FOREX' },
    { value: 'GBP/USD', label: 'GBP/USD', class: 'FOREX' },
    { value: 'S&P 500', label: 'S&P 500', class: 'INDEX' },
    { value: 'NASDAQ', label: 'NASDAQ', class: 'INDEX' },
    { value: 'GOLD', label: 'Gold', class: 'MINERAL' },
    { value: 'SILVER', label: 'Silver', class: 'MINERAL' }
  ]

  const data = mockChartData[selectedAsset] || []
  const currentPrice = data[data.length - 1]?.price || 0
  const previousPrice = data[0]?.price || 0
  const priceChange = currentPrice - previousPrice
  const priceChangePercent = ((priceChange / previousPrice) * 100)

  const filteredData = data.slice(
    timeRange === '1D' ? -24 : timeRange === '1W' ? -48 : timeRange === '1M' ? -72 : timeRange === '3M' ? -90 : -100
  )

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Price Charts</CardTitle>
              <CardDescription>Interactive price history and analysis</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={chartType} onValueChange={(value: 'line' | 'area') => setChartType(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="area">Area Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Asset Selection */}
          <div className="flex flex-wrap gap-2">
            {assets.map((asset) => (
              <Button
                key={asset.value}
                variant={selectedAsset === asset.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedAsset(asset.value)}
              >
                {asset.label}
              </Button>
            ))}
          </div>

          {/* Time Range Selection */}
          <div className="flex gap-2">
            {(Object.keys({ '1D': null, '1W': null, '1M': null, '3M': null, '1Y': null }) as TimeRange[]).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange(range)}
                className={timeRange === range ? "" : "text-muted-foreground"}
              >
                {range}
              </Button>
            ))}
          </div>

          {/* Price Summary */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-secondary/20 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Current Price</p>
              <p className="text-2xl font-bold">${currentPrice.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Change</p>
              <p className={`text-2xl font-bold ${priceChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Change %</p>
              <p className={`text-2xl font-bold ${priceChangePercent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <LineChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="time"
                    className="text-xs text-muted-foreground"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    className="text-xs text-muted-foreground"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem'
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              ) : (
                <AreaChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="time"
                    className="text-xs text-muted-foreground"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    className="text-xs text-muted-foreground"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem'
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="hsl(var(--primary))"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
