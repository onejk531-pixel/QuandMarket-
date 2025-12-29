'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart3, TrendingUp, TrendingDown, Network, PieChart, Target, Activity } from 'lucide-react'

type AssetClass = 'CRYPTO' | 'FOREX' | 'INDEX' | 'MINERAL'

interface CorrelationData {
  symbol1: string
  symbol2: string
  correlation: number
}

interface AssetAnalytics {
  symbol: string
  name: string
  volatility: number
  volume24h: number
  marketCap: number
  avgReturn: number
  sharpeRatio: number
  maxDrawdown: number
}

const mockCorrelations: CorrelationData[] = [
  { symbol1: 'BTC', symbol2: 'ETH', correlation: 0.85 },
  { symbol1: 'BTC', symbol2: 'SOL', correlation: 0.78 },
  { symbol1: 'ETH', symbol2: 'SOL', correlation: 0.82 },
  { symbol1: 'BTC', symbol2: 'GOLD', correlation: 0.35 },
  { symbol1: 'ETH', symbol2: 'GOLD', correlation: 0.28 },
  { symbol1: 'EUR/USD', symbol2: 'GBP/USD', correlation: 0.72 },
  { symbol1: 'S&P 500', symbol2: 'NASDAQ', correlation: 0.95 },
  { symbol1: 'GOLD', symbol2: 'SILVER', correlation: 0.88 }
]

const mockAssetAnalytics: AssetAnalytics[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    volatility: 65.2,
    volume24h: 28500000000,
    marketCap: 1320000000000,
    avgReturn: 0.42,
    sharpeRatio: 1.85,
    maxDrawdown: -45.3
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    volatility: 72.5,
    volume24h: 15000000000,
    marketCap: 415000000000,
    avgReturn: 0.38,
    sharpeRatio: 1.62,
    maxDrawdown: -52.1
  },
  {
    symbol: 'GOLD',
    name: 'Gold',
    volatility: 18.3,
    volume24h: 10000000,
    marketCap: 14000000000000,
    avgReturn: 0.12,
    sharpeRatio: 1.45,
    maxDrawdown: -18.5
  },
  {
    symbol: 'S&P 500',
    name: 'S&P 500',
    volatility: 22.1,
    volume24h: 2000000000,
    marketCap: 40000000000000,
    avgReturn: 0.15,
    sharpeRatio: 1.92,
    maxDrawdown: -23.4
  }
]

const portfolioDistribution = [
  { class: 'CRYPTO', value: 45, color: 'bg-purple-500' },
  { class: 'FOREX', value: 20, color: 'bg-blue-500' },
  { class: 'INDEX', value: 25, color: 'bg-emerald-500' },
  { class: 'MINERAL', value: 10, color: 'bg-amber-500' }
]

export function AdvancedAnalytics() {
  const [timeRange, setTimeRange] = useState<string>('1M')
  const [selectedAssetClass, setSelectedAssetClass] = useState<string>('ALL')

  const getCorrelationColor = (correlation: number) => {
    if (correlation > 0.7) return 'bg-emerald-500'
    if (correlation > 0.4) return 'bg-emerald-400'
    if (correlation > 0) return 'bg-emerald-200'
    if (correlation > -0.4) return 'bg-red-200'
    if (correlation > -0.7) return 'bg-red-400'
    return 'bg-red-500'
  }

  const getVolatilityColor = (volatility: number) => {
    if (volatility > 60) return 'text-red-600'
    if (volatility > 40) return 'text-amber-600'
    return 'text-emerald-600'
  }

  const filteredAnalytics = selectedAssetClass === 'ALL'
    ? mockAssetAnalytics
    : mockAssetAnalytics.filter(a => {
        if (selectedAssetClass === 'CRYPTO') return ['BTC', 'ETH', 'SOL'].includes(a.symbol)
        if (selectedAssetClass === 'FOREX') return a.symbol.includes('/')
        if (selectedAssetClass === 'INDEX') return ['S&P 500', 'NASDAQ'].includes(a.symbol)
        if (selectedAssetClass === 'MINERAL') return ['GOLD', 'SILVER'].includes(a.symbol)
        return true
      })

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Advanced Analytics</h3>
          <p className="text-sm text-muted-foreground">
            Deep insights into market correlations and asset performance
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1W">1 Week</SelectItem>
              <SelectItem value="1M">1 Month</SelectItem>
              <SelectItem value="3M">3 Months</SelectItem>
              <SelectItem value="1Y">1 Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="correlations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="correlations">Correlations</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="distribution">Portfolio Distribution</TabsTrigger>
        </TabsList>

        {/* Correlations Tab */}
        <TabsContent value="correlations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5" />
                Asset Correlations
              </CardTitle>
              <CardDescription>
                Measure how assets move together
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium text-muted-foreground">Asset Pair</th>
                      <th className="text-center p-3 font-medium text-muted-foreground">Correlation</th>
                      <th className="text-center p-3 font-medium text-muted-foreground">Strength</th>
                      <th className="text-center p-3 font-medium text-muted-foreground">Interpretation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockCorrelations.map((item, idx) => (
                      <tr key={idx} className="border-b hover:bg-muted/50">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{item.symbol1}</Badge>
                            <span className="text-muted-foreground">↔</span>
                            <Badge variant="outline">{item.symbol2}</Badge>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`font-bold ${item.correlation > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {item.correlation > 0 ? '+' : ''}{item.correlation.toFixed(2)}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="inline-flex items-center gap-2">
                            <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className={`h-full ${getCorrelationColor(item.correlation)}`}
                                style={{ width: `${Math.abs(item.correlation) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">
                              {Math.abs(item.correlation) > 0.7 ? 'Strong' : Math.abs(item.correlation) > 0.4 ? 'Moderate' : 'Weak'}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-center text-sm">
                          {Math.abs(item.correlation) > 0.7
                            ? 'Assets move strongly together'
                            : Math.abs(item.correlation) > 0.4
                            ? 'Assets have some relationship'
                            : 'Assets move independently'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Asset Performance
              </CardTitle>
              <CardDescription>
                Detailed metrics for each asset
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  {['ALL', 'CRYPTO', 'FOREX', 'INDEX', 'MINERAL'].map((cls) => (
                    <Button
                      key={cls}
                      variant={selectedAssetClass === cls ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedAssetClass(cls)}
                    >
                      {cls}
                    </Button>
                  ))}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium text-muted-foreground">Asset</th>
                        <th className="text-center p-3 font-medium text-muted-foreground">Volatility</th>
                        <th className="text-center p-3 font-medium text-muted-foreground">Sharpe Ratio</th>
                        <th className="text-center p-3 font-medium text-muted-foreground">Avg Return</th>
                        <th className="text-center p-3 font-medium text-muted-foreground">Max Drawdown</th>
                        <th className="text-center p-3 font-medium text-muted-foreground">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAnalytics.map((asset) => {
                        const score = asset.sharpeRatio - (Math.abs(asset.maxDrawdown) / 100) + (asset.avgReturn * 10)
                        return (
                          <tr key={asset.symbol} className="border-b hover:bg-muted/50">
                            <td className="p-3">
                              <div>
                                <p className="font-semibold">{asset.symbol}</p>
                                <p className="text-xs text-muted-foreground">{asset.name}</p>
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              <span className={`font-semibold ${getVolatilityColor(asset.volatility)}`}>
                                {asset.volatility.toFixed(1)}%
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <span className={`font-semibold ${asset.sharpeRatio > 1.5 ? 'text-emerald-600' : asset.sharpeRatio > 1 ? 'text-amber-600' : 'text-red-600'}`}>
                                {asset.sharpeRatio.toFixed(2)}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <span className={`font-semibold ${asset.avgReturn > 0.3 ? 'text-emerald-600' : asset.avgReturn > 0.1 ? 'text-amber-600' : 'text-red-600'}`}>
                                {asset.avgReturn.toFixed(2)}%
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <span className={`font-semibold ${asset.maxDrawdown > -30 ? 'text-emerald-600' : asset.maxDrawdown > -50 ? 'text-amber-600' : 'text-red-600'}`}>
                                {asset.maxDrawdown.toFixed(1)}%
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <Badge variant="outline" className={`font-semibold ${score > 2 ? 'bg-emerald-100 text-emerald-800' : score > 1 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                                {score.toFixed(2)}
                              </Badge>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Portfolio Distribution Tab */}
        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Portfolio Distribution
              </CardTitle>
              <CardDescription>
                Allocation across asset classes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Visual Distribution */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-8 rounded-full overflow-hidden flex">
                    {portfolioDistribution.map((item) => (
                      <div
                        key={item.class}
                        className={`${item.color} transition-all hover:opacity-80`}
                        style={{ width: `${item.value}%` }}
                        title={`${item.class}: ${item.value}%`}
                      />
                    ))}
                  </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {portfolioDistribution.map((item) => (
                    <div key={item.class} className="p-4 bg-secondary/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {item.class}
                        </Badge>
                        <span className="text-2xl font-bold">{item.value}%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.class.toLowerCase()} allocation
                      </p>
                    </div>
                  ))}
                </div>

                {/* Recommendations */}
                <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Recommendations
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Activity className="w-4 h-4 mt-0.5 text-emerald-600" />
                      <span>
                        <strong>High Correlation:</strong> BTC and ETH are strongly correlated. Consider reducing overlap.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Activity className="w-4 h-4 mt-0.5 text-amber-600" />
                      <span>
                        <strong>Diversification:</strong> Gold provides good diversification to crypto assets.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Activity className="w-4 h-4 mt-0.5 text-emerald-600" />
                      <span>
                        <strong>Risk Management:</strong> Consider increasing allocation to lower-volatility assets.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
