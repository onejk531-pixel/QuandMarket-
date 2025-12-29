import { createServer } from 'http'
import { Server } from 'socket.io'

const PORT = 3001

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

type AssetClass = 'CRYPTO' | 'FOREX' | 'INDEX' | 'MINERAL'

interface PriceUpdate {
  symbol: string
  name: string
  class: AssetClass
  price: number
  change: number
  changePercent: number
  volume: number
  timestamp: number
}

const mockAssets: PriceUpdate[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    class: 'CRYPTO',
    price: 67234.50,
    change: 2234.50,
    changePercent: 3.44,
    volume: 28500000000,
    timestamp: Date.now()
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    class: 'CRYPTO',
    price: 3456.78,
    change: 56.78,
    changePercent: 1.67,
    volume: 15000000000,
    timestamp: Date.now()
  },
  {
    symbol: 'EUR/USD',
    name: 'Euro/US Dollar',
    class: 'FOREX',
    price: 1.0845,
    change: -0.0055,
    changePercent: -0.50,
    volume: 500000000000,
    timestamp: Date.now()
  },
  {
    symbol: 'GBP/USD',
    name: 'British Pound/US Dollar',
    class: 'FOREX',
    price: 1.2678,
    change: -0.0022,
    changePercent: -0.17,
    volume: 350000000000,
    timestamp: Date.now()
  },
  {
    symbol: 'S&P 500',
    name: 'S&P 500 Index',
    class: 'INDEX',
    price: 5234.56,
    change: 34.56,
    changePercent: 0.66,
    volume: 2000000000,
    timestamp: Date.now()
  },
  {
    symbol: 'NASDAQ',
    name: 'NASDAQ Composite',
    class: 'INDEX',
    price: 16789.23,
    change: 289.23,
    changePercent: 1.75,
    volume: 1500000000,
    timestamp: Date.now()
  },
  {
    symbol: 'GOLD',
    name: 'Gold',
    class: 'MINERAL',
    price: 2345.60,
    change: 65.60,
    changePercent: 2.88,
    volume: 10000000,
    timestamp: Date.now()
  },
  {
    symbol: 'SILVER',
    name: 'Silver',
    class: 'MINERAL',
    price: 28.45,
    change: 0.95,
    changePercent: 3.45,
    volume: 500000,
    timestamp: Date.now()
  }
]

function generatePriceUpdate(asset: PriceUpdate): PriceUpdate {
  const priceChangePercent = (Math.random() - 0.5) * 0.2
  const newPrice = asset.price * (1 + priceChangePercent / 100)
  const change = newPrice - asset.price + (asset.change || 0) * 0.99

  return {
    ...asset,
    price: parseFloat(newPrice.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(((change / newPrice) * 100).toFixed(2)),
    timestamp: Date.now()
  }
}

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`)

  socket.on('subscribe', (data: { symbols?: string[] }) => {
    console.log(`Client ${socket.id} subscribing to:`, data.symbols || 'all assets')

    socket.join('market-updates')

    socket.emit('connected', {
      message: 'Subscribed to market updates',
      assets: mockAssets.map(a => ({
        symbol: a.symbol,
        name: a.name,
        class: a.class,
        price: a.price,
        change: a.change,
        changePercent: a.changePercent
      }))
    })
  })

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`)
  })
})

const updateInterval = 2000

setInterval(() => {
  const updates = mockAssets.map(asset => {
    const updated = generatePriceUpdate(asset)

    mockAssets[mockAssets.findIndex(a => a.symbol === asset.symbol)] = updated

    return updated
  })

  io.to('market-updates').emit('price-update', updates)
}, updateInterval)

httpServer.listen(PORT, () => {
  console.log(`Market data service running on port ${PORT}`)
  console.log(`Broadcasting price updates every ${updateInterval}ms`)
})
