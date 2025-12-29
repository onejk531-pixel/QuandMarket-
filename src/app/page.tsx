'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { RealTimePrices } from '@/components/real-time-prices'
import { PriceCharts } from '@/components/price-charts'
import { Backtesting } from '@/components/backtesting'
import { StrategyCreation } from '@/components/strategy-creation'
import { AdvancedAnalytics } from '@/components/advanced-analytics'
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Target,
  AlertTriangle,
  BarChart3,
  Brain,
  Shield,
  Zap,
  Clock
} from 'lucide-react'

type AssetClass = 'CRYPTO' | 'FOREX' | 'INDEX' | 'MINERAL'

type Signal = {
  id: string
  symbol: string
  name: string
  type: 'BUY' | 'SELL' | 'HOLD'
  confidence: number
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  currentPrice: number
  targetPrice?: number
  stopLoss?: number
  reasoning?: string
  class: AssetClass
}

type Forecast = {
  id: string
  symbol: string
  name: string
  timeHorizon: string
  predictedPrice: number
  confidence: number
  rationale: string
  keyFactors: string[]
  currentPrice: number
}

type AlertItem = {
  id: string
  symbol: string
  name: string
  condition: string
  threshold: number
  isTriggered: boolean
}

const mockAssets: Signal[] = [
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
    class: 'CRYPTO'
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
    class: 'CRYPTO'
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
    class: 'FOREX'
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
    class: 'FOREX'
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
    class: 'INDEX'
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
    class: 'MINERAL'
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
    class: 'MINERAL'
  }
]

const mockForecasts: Forecast[] = [
  {
    id: '1',
    symbol: 'BTC',
    name: 'Bitcoin',
    timeHorizon: '30 days',
    predictedPrice: 72000,
    confidence: 78,
    rationale: 'Based on historical patterns and current market momentum, Bitcoin shows strong bullish potential. Technical indicators suggest continuation of upward trend with possible consolidation phases.',
    keyFactors: [
      'Institutional adoption increasing',
      'ETF inflows remain positive',
      'Halving cycle support',
      'Strong network fundamentals'
    ],
    currentPrice: 67234.50
  },
  {
    id: '2',
    symbol: 'EUR/USD',
    name: 'Euro/US Dollar',
    timeHorizon: '7 days',
    predictedPrice: 1.0750,
    confidence: 72,
    rationale: 'Bearish outlook due to interest rate differential and economic data divergence between Eurozone and US.',
    keyFactors: [
      'ECB dovish stance',
      'US economic outperformance',
      'Geopolitical factors',
      'Trade balance data'
    ],
    currentPrice: 1.0845
  },
  {
    id: '3',
    symbol: 'GOLD',
    name: 'Gold',
    timeHorizon: '60 days',
    predictedPrice: 2450,
    confidence: 68,
    rationale: 'Gold poised for upside as central banks continue diversifying reserves and investors seek safe-haven assets.',
    keyFactors: [
      'Central bank purchases',
      'Inflation hedge demand',
      'Geopolitical uncertainty',
      'Currency depreciation risks'
    ],
    currentPrice: 2345.60
  }
]

const mockAlerts: AlertItem[] = [
  {
    id: '1',
    symbol: 'BTC',
    name: 'Bitcoin',
    condition: 'PRICE_ABOVE',
    threshold: 70000,
    isTriggered: false
  },
  {
    id: '2',
    symbol: 'EUR/USD',
    name: 'Euro/US Dollar',
    condition: 'PRICE_BELOW',
    threshold: 1.0800,
    isTriggered: true
  },
  {
    id: '3',
    symbol: 'GOLD',
    name: 'Gold',
    condition: 'PERCENT_CHANGE',
    threshold: 5,
    isTriggered: false
  }
]

const mockPortfolio = {
  totalValue: 125432.50,
  totalPnl: 8234.50,
  totalPnlPercent: 7.02,
  riskScore: 65,
  assets: [
    { symbol: 'BTC', name: 'Bitcoin', quantity: 0.5, avgCost: 65000, currentValue: 33617.25, pnl: 817.25, pnlPercent: 2.51 },
    { symbol: 'ETH', name: 'Ethereum', quantity: 2.5, avgCost: 3200, currentValue: 8641.95, pnl: 641.95, pnlPercent: 8.03 },
    { symbol: 'GOLD', name: 'Gold', quantity: 10, avgCost: 2280, currentValue: 23456.00, pnl: 656.00, pnlPercent: 2.88 }
  ]
}

function SignalBadge({ type }: { type: 'BUY' | 'SELL' | 'HOLD' }) {
  const variants = {
    BUY: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
    SELL: 'bg-red-100 text-red-800 hover:bg-red-200',
    HOLD: 'bg-amber-100 text-amber-800 hover:bg-amber-200'
  }

  return (
    <Badge className={variants[type]}>
      {type}
    </Badge>
  )
}

function RiskBadge({ level }: { level: 'LOW' | 'MEDIUM' | 'HIGH' }) {
  const variants = {
    LOW: 'bg-green-100 text-green-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-red-100 text-red-800'
  }

  return (
    <Badge className={variants[level]} variant="secondary">
      {level} RISK
    </Badge>
  )
}

function SignalCard({ signal }: { signal: Signal }) {
  const isPositive = signal.priceChangePercent >= 0

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{signal.symbol}</CardTitle>
            <CardDescription className="text-sm">{signal.name}</CardDescription>
          </div>
          <div className="flex gap-2">
            <SignalBadge type={signal.type} />
            <RiskBadge level={signal.riskLevel} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold">${signal.currentPrice.toLocaleString()}</p>
            <p className={`text-sm flex items-center gap-1 ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {isPositive ? '+' : ''}{((signal.currentPrice - signal.basePrice) / signal.basePrice * 100).toFixed(2)}%
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Confidence</p>
            <p className="text-lg font-semibold">{signal.confidence}%</p>
          </div>
        </div>

        {(signal.targetPrice || signal.stopLoss) && (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t">
            {signal.targetPrice && (
              <div>
                <p className="text-xs text-muted-foreground">Target</p>
                <p className="text-sm font-medium text-emerald-600">${signal.targetPrice.toLocaleString()}</p>
              </div>
            )}
            {signal.stopLoss && (
              <div>
                <p className="text-xs text-muted-foreground">Stop Loss</p>
                <p className="text-sm font-medium text-red-600">${signal.stopLoss.toLocaleString()}</p>
              </div>
            )}
          </div>
        )}

        {signal.reasoning && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground line-clamp-2">{signal.reasoning}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ForecastCard({ forecast }: { forecast: Forecast }) {
  const priceChange = ((forecast.predictedPrice - forecast.currentPrice) / forecast.currentPrice * 100)
  const isPositive = priceChange > 0

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{forecast.symbol}</CardTitle>
            <CardDescription className="text-sm">{forecast.name}</CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {forecast.timeHorizon}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Current</p>
            <p className="text-xl font-bold">${forecast.currentPrice.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Predicted</p>
            <p className={`text-xl font-bold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
              ${forecast.predictedPrice.toLocaleString()}
            </p>
            <p className={`text-sm ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Confidence</span>
            <span className="text-sm font-semibold">{forecast.confidence}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${forecast.confidence}%` }}
            />
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-sm font-medium mb-2">Key Factors:</p>
          <div className="flex flex-wrap gap-1">
            {forecast.keyFactors.map((factor, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {factor}
              </Badge>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-sm text-muted-foreground line-clamp-3">{forecast.rationale}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function AlertCard({ alert }: { alert: AlertItem }) {
  return (
    <Card className={alert.isTriggered ? 'border-red-200 bg-red-50/50' : ''}>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold">{alert.symbol}</p>
              <p className="text-sm text-muted-foreground">{alert.name}</p>
              {alert.isTriggered && (
                <Badge className="bg-red-100 text-red-800">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Triggered
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {alert.condition === 'PRICE_ABOVE' && 'Price above'}
              {alert.condition === 'PRICE_BELOW' && 'Price below'}
              {alert.condition === 'PERCENT_CHANGE' && 'Change exceeds'}
              {' '}${alert.threshold.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Home() {
  const [selectedAssetClass, setSelectedAssetClass] = useState<string>('ALL')

  const filteredSignals = selectedAssetClass === 'ALL'
    ? mockAssets
    : mockAssets.filter(asset => asset.class === selectedAssetClass)

  const assetClasses = [
    { value: 'ALL', label: 'All Assets', icon: BarChart3 },
    { value: 'CRYPTO', label: 'Crypto', icon: Activity },
    { value: 'FOREX', label: 'Forex', icon: DollarSign },
    { value: 'INDEX', label: 'Indices', icon: TrendingUp },
    { value: 'MINERAL', label: 'Minerals', icon: Shield }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">QuandMarket</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Multi-Asset Trading Analytics</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="hidden sm:flex items-center gap-1">
                <Zap className="w-3 h-3" />
                AI Active
              </Badge>
              <Button variant="outline" size="sm">
                <Shield className="w-4 h-4 mr-2" />
                Risk Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Real-Time Prices */}
        <RealTimePrices />

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 mt-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Portfolio Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">${mockPortfolio.totalValue.toLocaleString()}</p>
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-emerald-600 mt-1">
                +${mockPortfolio.totalPnl.toLocaleString()} ({mockPortfolio.totalPnlPercent}%)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Signals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{mockAssets.length}</p>
                <Target className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Across {assetClasses.length - 1} asset classes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                AI Forecasts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{mockForecasts.length}</p>
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Avg confidence: {Math.round(mockForecasts.reduce((sum, f) => sum + f.confidence, 0) / mockForecasts.length)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Risk Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{mockPortfolio.riskScore}/100</p>
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {mockPortfolio.riskScore < 50 ? 'Low Risk' : mockPortfolio.riskScore < 70 ? 'Medium Risk' : 'High Risk'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="signals" className="space-y-4">
          <TabsList className="grid w-full grid-cols-8 lg:w-auto lg:grid-cols-8">
            <TabsTrigger value="signals">Signals</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="backtest">Backtest</TabsTrigger>
            <TabsTrigger value="strategies">Strategies</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="forecasts">AI Forecasts</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          </TabsList>

          {/* Signals Tab */}
          <TabsContent value="signals" className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {assetClasses.map(({ value, label, icon: Icon }) => (
                <Button
                  key={value}
                  variant={selectedAssetClass === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedAssetClass(value)}
                  className={selectedAssetClass === value ? "" : "bg-background"}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSignals.map((signal) => (
                <SignalCard key={signal.id} signal={signal} />
              ))}
            </div>
          </TabsContent>

          {/* Charts Tab */}
          <TabsContent value="charts" className="space-y-4">
            <PriceCharts />
          </TabsContent>

          {/* Backtest Tab */}
          <TabsContent value="backtest" className="space-y-4">
            <Backtesting />
          </TabsContent>

          {/* Strategies Tab */}
          <TabsContent value="strategies" className="space-y-4">
            <StrategyCreation />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <AdvancedAnalytics />
          </TabsContent>

          {/* AI Forecasts Tab */}
          <TabsContent value="forecasts" className="space-y-4">
            <Alert>
              <Brain className="h-4 w-4" />
              <AlertDescription>
                AI-generated forecasts based on market analysis, technical indicators, and historical patterns.
                Always verify with your own analysis before making trading decisions.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockForecasts.map((forecast) => (
                <ForecastCard key={forecast.id} forecast={forecast} />
              ))}
            </div>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Price Alerts</h3>
                <p className="text-sm text-muted-foreground">
                  Configure alerts to stay informed about market movements
                </p>
              </div>
              <Button>Create Alert</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mockAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Analytics</CardTitle>
                <CardDescription>
                  Track your positions, performance, and risk metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-3">
                    {mockPortfolio.assets.map((asset, idx) => (
                      <Card key={idx}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold">{asset.symbol}</p>
                                <p className="text-sm text-muted-foreground">{asset.name}</p>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {asset.quantity} @ ${asset.avgCost.toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold">${asset.currentValue.toLocaleString()}</p>
                              <p className={`text-sm ${asset.pnl >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                {asset.pnl >= 0 ? '+' : ''}${asset.pnl.toLocaleString()} ({asset.pnlPercent}%)
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-semibold mb-2">QuandMarket</p>
              <p className="text-muted-foreground">
                AI-powered multi-asset trading analytics platform
              </p>
            </div>
            <div>
              <p className="font-semibold mb-2">Resources</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Tutorials</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">Disclaimer</p>
              <p className="text-muted-foreground">
                Trading involves risk. AI forecasts are for informational purposes only.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t text-center text-sm text-muted-foreground">
            © 2025 QuandMarket. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
