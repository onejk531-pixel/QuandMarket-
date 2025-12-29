'use client'

import { useState, useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, TrendingUp, TrendingDown } from 'lucide-react'

type AssetClass = 'CRYPTO' | 'FOREX' | 'INDEX' | 'MINERAL'

interface AssetPrice {
  symbol: string
  name: string
  class: AssetClass
  price: number
  change: number
  changePercent: number
  volume: number
  timestamp: number
}

export function RealTimePrices() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [prices, setPrices] = useState<AssetPrice[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>('')

  useEffect(() => {
    // Connect to WebSocket service
    // Never use PORT in the URL, always use XTransformPort
    // DO NOT change the path, it is used by Caddy to forward the request to the correct port
    const socketInstance = io('/?XTransformPort=3001', {
      transports: ['websocket', 'polling'],
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000
    })

    setSocket(socketInstance)

    socketInstance.on('connect', () => {
      console.log('Connected to market data service')
      setIsConnected(true)
      socketInstance.emit('subscribe', {})
    })

    socketInstance.on('connected', (data: { message: string; assets: AssetPrice[] }) => {
      console.log('Market data subscription confirmed:', data.message)
      setPrices(data.assets)
    })

    socketInstance.on('price-update', (updates: AssetPrice[]) => {
      setPrices(updates)
      setLastUpdate(new Date().toLocaleTimeString())
    })

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from market data service')
      setIsConnected(false)
    })

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Real-Time Prices</h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? 'default' : 'secondary'} className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            {isConnected ? 'Live' : 'Disconnected'}
          </Badge>
          {lastUpdate && (
            <span className="text-xs text-muted-foreground">Updated: {lastUpdate}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {prices.map((asset) => {
          const isPositive = asset.changePercent >= 0

          return (
            <Card key={asset.symbol} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{asset.symbol}</p>
                      <p className="text-xs text-muted-foreground">{asset.name}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {asset.class}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-lg font-bold">
                      ${asset.price.toLocaleString()}
                    </p>
                    <p className={`text-sm flex items-center gap-1 ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {!isConnected && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <p className="text-sm text-amber-800">
              <Activity className="w-4 h-4 inline mr-2" />
              Connecting to real-time market data service...
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
