'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Save, Play, Trash2, Settings, TrendingUp, TrendingDown, Target, Shield } from 'lucide-react'

type StrategyType = 'trend' | 'momentum' | 'mean_reversion' | 'breakout'
type IndicatorType = 'RSI' | 'MACD' | 'BOLLINGER_BANDS' | 'MOVING_AVERAGE' | 'VOLUME'

interface Strategy {
  id: string
  name: string
  type: StrategyType
  indicators: IndicatorType[]
  parameters: Record<string, number>
  riskManagement: {
    stopLoss: number
    takeProfit: number
    maxPositionSize: number
  }
  description: string
  isActive: boolean
}

const mockStrategies: Strategy[] = [
  {
    id: '1',
    name: 'BTC Trend Following',
    type: 'trend',
    indicators: ['MOVING_AVERAGE', 'RSI'],
    parameters: {
      maPeriod: 20,
      rsiPeriod: 14,
      rsiOversold: 30,
      rsiOverbought: 70
    },
    riskManagement: {
      stopLoss: 5,
      takeProfit: 10,
      maxPositionSize: 10
    },
    description: 'Follow the trend using MA crossovers and RSI confirmation',
    isActive: true
  },
  {
    id: '2',
    name: 'ETH Momentum',
    type: 'momentum',
    indicators: ['RSI', 'MACD', 'VOLUME'],
    parameters: {
      rsiPeriod: 14,
      macdFast: 12,
      macdSlow: 26,
      macdSignal: 9
    },
    riskManagement: {
      stopLoss: 3,
      takeProfit: 6,
      maxPositionSize: 15
    },
    description: 'Capture momentum moves with MACD and RSI',
    isActive: false
  }
]

const strategyTypes = [
  { value: 'trend', label: 'Trend Following', icon: TrendingUp },
  { value: 'momentum', label: 'Momentum', icon: Activity },
  { value: 'mean_reversion', label: 'Mean Reversion', icon: Target },
  { value: 'breakout', label: 'Breakout', icon: Zap }
]

const indicators = [
  { value: 'RSI', label: 'RSI (Relative Strength Index)' },
  { value: 'MACD', label: 'MACD (Moving Average Convergence Divergence)' },
  { value: 'BOLLINGER_BANDS', label: 'Bollinger Bands' },
  { value: 'MOVING_AVERAGE', label: 'Moving Average' },
  { value: 'VOLUME', label: 'Volume Analysis' }
]

export function StrategyCreation() {
  const [strategies, setStrategies] = useState<Strategy[]>(mockStrategies)
  const [isCreating, setIsCreating] = useState(false)
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null)

  // New strategy form state
  const [name, setName] = useState('')
  const [type, setType] = useState<StrategyType>('trend')
  const [indicators, setIndicators] = useState<IndicatorType[]>([])
  const [stopLoss, setStopLoss] = useState<number>([5])
  const [takeProfit, setTakeProfit] = useState<number>([10])
  const [maxPositionSize, setMaxPositionSize] = useState<number>([10])

  const handleCreateStrategy = () => {
    const newStrategy: Strategy = {
      id: Date.now().toString(),
      name,
      type,
      indicators,
      parameters: {},
      riskManagement: {
        stopLoss: stopLoss[0],
        takeProfit: takeProfit[0],
        maxPositionSize: maxPositionSize[0]
      },
      description: `${type} strategy using ${indicators.join(', ')}`,
      isActive: false
    }

    setStrategies([...strategies, newStrategy])
    setIsCreating(false)
    resetForm()
  }

  const handleDeleteStrategy = (id: string) => {
    setStrategies(strategies.filter(s => s.id !== id))
  }

  const handleToggleActive = (id: string) => {
    setStrategies(strategies.map(s =>
      s.id === id ? { ...s, isActive: !s.isActive } : s
    ))
  }

  const resetForm = () => {
    setName('')
    setType('trend')
    setIndicators([])
    setStopLoss([5])
    setTakeProfit([10])
    setMaxPositionSize([10])
  }

  const getTypeIcon = (strategyType: StrategyType) => {
    const type = strategyTypes.find(t => t.value === strategyType)
    return type?.icon || Settings
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Custom Strategies</CardTitle>
              <CardDescription>
                Create and manage your own trading strategies
              </CardDescription>
            </div>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Strategy
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list">
            <TabsList>
              <TabsTrigger value="list">My Strategies</TabsTrigger>
              {isCreating && <TabsTrigger value="create">Create New</TabsTrigger>}
            </TabsList>

            <TabsContent value="list" className="space-y-4 mt-4">
              {strategies.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No strategies created yet. Create your first strategy to get started.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {strategies.map((strategy) => {
                    const TypeIcon = getTypeIcon(strategy.type)

                    return (
                      <Card key={strategy.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <CardTitle className="text-lg">{strategy.name}</CardTitle>
                                <Badge variant={strategy.isActive ? 'default' : 'secondary'}>
                                  {strategy.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <TypeIcon className="w-4 h-4" />
                                {strategyTypes.find(t => t.value === strategy.type)?.label}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleActive(strategy.id)}
                              >
                                {strategy.isActive ? 'Pause' : 'Activate'}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteStrategy(strategy.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <CardDescription className="mt-2">
                            {strategy.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm font-medium mb-2">Indicators</p>
                              <div className="flex flex-wrap gap-1">
                                {strategy.indicators.map((ind) => (
                                  <Badge key={ind} variant="outline" className="text-xs">
                                    {indicators.find(i => i.value === ind)?.label}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                              <div>
                                <p className="text-xs text-muted-foreground">Stop Loss</p>
                                <p className="text-sm font-semibold text-red-600">
                                  {strategy.riskManagement.stopLoss}%
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Take Profit</p>
                                <p className="text-sm font-semibold text-emerald-600">
                                  {strategy.riskManagement.takeProfit}%
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Max Position</p>
                                <p className="text-sm font-semibold">
                                  {strategy.riskManagement.maxPositionSize}%
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="create" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="strategy-name">Strategy Name</Label>
                  <Input
                    id="strategy-name"
                    placeholder="My Trend Strategy"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="strategy-type">Strategy Type</Label>
                  <Select value={type} onValueChange={(value: StrategyType) => setType(value)}>
                    <SelectTrigger id="strategy-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {strategyTypes.map((strategyType) => {
                        const Icon = strategyType.icon
                        return (
                          <SelectItem key={strategyType.value} value={strategyType.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              {strategyType.label}
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Technical Indicators</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {indicators.map((indicator) => (
                      <label key={indicator.value} className="flex items-center gap-2 p-2 border rounded hover:bg-secondary/50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={indicators.includes(indicator.value as IndicatorType)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setIndicators([...indicators, indicator.value as IndicatorType])
                            } else {
                              setIndicators(indicators.filter(i => i !== indicator.value as IndicatorType))
                            }
                          }}
                        />
                        <span className="text-sm">{indicator.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Risk Management
                  </h3>

                  <div className="space-y-2">
                    <Label>
                      Stop Loss: {stopLoss[0]}%
                    </Label>
                    <Slider
                      value={stopLoss}
                      onValueChange={setStopLoss}
                      min={1}
                      max={20}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Take Profit: {takeProfit[0]}%
                    </Label>
                    <Slider
                      value={takeProfit}
                      onValueChange={setTakeProfit}
                      min={1}
                      max={50}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Max Position Size: {maxPositionSize[0]}%
                    </Label>
                    <Slider
                      value={maxPositionSize}
                      onValueChange={setMaxPositionSize}
                      min={1}
                      max={100}
                      step={1}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleCreateStrategy} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Save Strategy
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false)
                      resetForm()
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function Activity({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  )
}

function Zap({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
      />
    </svg>
  )
}
