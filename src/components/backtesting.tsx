'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Play, RotateCcw, TrendingUp, TrendingDown, AlertCircle, CheckCircle, BarChart3, DollarSign } from 'lucide-react'

type AssetClass = 'CRYPTO' | 'FOREX' | 'INDEX' | 'MINERAL'
type BacktestStatus = 'idle' | 'running' | 'completed' | 'error'

interface BacktestResult {
  initialCapital: number
  finalCapital: number
  totalReturn: number
  returnPercent: number
  maxDrawdown: number
  sharpeRatio: number
  winRate: number
  totalTrades: number
  winningTrades: number
  losingTrades: number
  avgWin: number
  avgLoss: number
  profitFactor: number
}

const mockBacktestResults: BacktestResult = {
  initialCapital: 100000,
  finalCapital: 108500,
  totalReturn: 8500,
  returnPercent: 8.5,
  maxDrawdown: -12.3,
  sharpeRatio: 1.45,
  winRate: 58.3,
  totalTrades: 120,
  winningTrades: 70,
  losingTrades: 50,
  avgWin: 185.71,
  avgLoss: -127.5,
  profitFactor: 2.04
}

export function Backtesting() {
  const [selectedAsset, setSelectedAsset] = useState<string>('BTC')
  const [timeHorizon, setTimeHorizon] = useState<string>('1Y')
  const [initialCapital, setInitialCapital] = useState<number>([100000])
  const [stopLoss, setStopLoss] = useState<number>([5])
  const [takeProfit, setTakeProfit] = useState<number>([10])
  const [status, setStatus] = useState<BacktestStatus>('idle')
  const [progress, setProgress] = useState<number>(0)
  const [results, setResults] = useState<BacktestResult | null>(null)

  const assets = [
    { value: 'BTC', label: 'Bitcoin', class: 'CRYPTO' },
    { value: 'ETH', label: 'Ethereum', class: 'CRYPTO' },
    { value: 'EUR/USD', label: 'EUR/USD', class: 'FOREX' },
    { value: 'S&P 500', label: 'S&P 500', class: 'INDEX' },
    { value: 'GOLD', label: 'Gold', class: 'MINERAL' }
  ]

  const timeHorizons = [
    { value: '3M', label: '3 Months' },
    { value: '6M', label: '6 Months' },
    { value: '1Y', label: '1 Year' },
    { value: '2Y', label: '2 Years' },
    { value: '3Y', label: '3 Years' }
  ]

  const runBacktest = () => {
    setStatus('running')
    setProgress(0)
    setResults(null)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setStatus('completed')
          setResults(mockBacktestResults)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const resetBacktest = () => {
    setStatus('idle')
    setProgress(0)
    setResults(null)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Backtesting Engine</CardTitle>
          <CardDescription>
            Test your strategies against historical data to evaluate performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Asset Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Asset</label>
              <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {assets.map((asset) => (
                    <SelectItem key={asset.value} value={asset.value}>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{asset.class}</Badge>
                        {asset.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Time Horizon */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Horizon</label>
              <Select value={timeHorizon} onValueChange={setTimeHorizon}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeHorizons.map((horizon) => (
                    <SelectItem key={horizon.value} value={horizon.value}>
                      {horizon.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Initial Capital */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Initial Capital: ${initialCapital[0].toLocaleString()}
              </label>
              <Slider
                value={initialCapital}
                onValueChange={setInitialCapital}
                min={10000}
                max={1000000}
                step={10000}
                className="w-full"
              />
            </div>

            {/* Stop Loss */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Stop Loss: {stopLoss[0]}%
              </label>
              <Slider
                value={stopLoss}
                onValueChange={setStopLoss}
                min={1}
                max={20}
                step={1}
                className="w-full"
              />
            </div>

            {/* Take Profit */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Take Profit: {takeProfit[0]}%
              </label>
              <Slider
                value={takeProfit}
                onValueChange={setTakeProfit}
                min={1}
                max={50}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={runBacktest}
              disabled={status === 'running'}
              className="flex-1"
            >
              <Play className="w-4 h-4 mr-2" />
              {status === 'running' ? 'Running...' : 'Run Backtest'}
            </Button>
            <Button
              onClick={resetBacktest}
              variant="outline"
              disabled={status === 'running'}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Progress Bar */}
          {status === 'running' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing historical data...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Status Alert */}
          {status === 'completed' && (
            <Alert className="border-emerald-200 bg-emerald-50">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Backtest completed successfully. Results are displayed below.
              </AlertDescription>
            </Alert>
          )}

          {status === 'error' && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                An error occurred during backtesting. Please try again.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Backtest Results
            </CardTitle>
            <CardDescription>
              Performance metrics for {selectedAsset} over {timeHorizon}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-secondary/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <Badge variant={results.returnPercent >= 0 ? 'default' : 'destructive'}>
                    {results.returnPercent >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {results.returnPercent >= 0 ? '+' : ''}{results.returnPercent}%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Total Return</p>
                <p className="text-2xl font-bold">
                  ${results.totalReturn.toLocaleString()}
                </p>
              </div>

              <div className="p-4 bg-secondary/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <Badge variant="outline">
                    {results.sharpeRatio.toFixed(2)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                <p className="text-2xl font-bold">
                  {results.sharpeRatio.toFixed(2)}
                </p>
              </div>

              <div className="p-4 bg-secondary/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <Badge variant="outline">
                    {results.winRate.toFixed(1)}%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Win Rate</p>
                <p className="text-2xl font-bold">
                  {results.winRate.toFixed(1)}%
                </p>
              </div>

              <div className="p-4 bg-secondary/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <AlertCircle className="w-4 h-4 text-primary" />
                  <Badge variant="outline">
                    {results.maxDrawdown.toFixed(1)}%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Max Drawdown</p>
                <p className="text-2xl font-bold">
                  {results.maxDrawdown.toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Detailed Statistics */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold">Capital Growth</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Initial Capital</span>
                    <span className="font-medium">${results.initialCapital.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Final Capital</span>
                    <span className="font-medium">${results.finalCapital.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total P&L</span>
                    <span className={`font-medium ${results.totalReturn >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      ${results.totalReturn.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Trade Statistics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Trades</span>
                    <span className="font-medium">{results.totalTrades}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Winning Trades</span>
                    <span className="font-medium text-emerald-600">{results.winningTrades}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Losing Trades</span>
                    <span className="font-medium text-red-600">{results.losingTrades}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Profit Factor</span>
                    <span className="font-medium">{results.profitFactor.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Average Performance</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Average Win</span>
                    <span className="font-medium text-emerald-600">${results.avgWin.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Average Loss</span>
                    <span className="font-medium text-red-600">${results.avgLoss.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Risk Metrics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sharpe Ratio</span>
                    <span className="font-medium">{results.sharpeRatio.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Max Drawdown</span>
                    <span className={`font-medium ${results.maxDrawdown <= -10 ? 'text-red-600' : 'text-emerald-600'}`}>
                      {results.maxDrawdown.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
