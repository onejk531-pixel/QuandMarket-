'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LogIn, User, Mail, Lock, AlertCircle } from 'lucide-react'

type AuthMode = 'signin' | 'signup' | 'forgot'

export function Auth() {
  const [mode, setMode] = useState<AuthMode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Simulate authentication
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (mode === 'signin') {
        // Handle sign in
        console.log('Sign in:', { email, password })
      } else if (mode === 'signup') {
        // Handle sign up
        console.log('Sign up:', { name, email, password })
      } else if (mode === 'forgot') {
        // Handle forgot password
        console.log('Forgot password:', { email })
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getModeTitle = () => {
    switch (mode) {
      case 'signin':
        return 'Sign In'
      case 'signup':
        return 'Create Account'
      case 'forgot':
        return 'Reset Password'
    }
  }

  const getModeDescription = () => {
    switch (mode) {
      case 'signin':
        return 'Welcome back to QuandMarket'
      case 'signup':
        return 'Start your trading journey today'
      case 'forgot':
        return 'We\'ll send you a reset link'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <LogIn className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">{getModeTitle()}</CardTitle>
          <CardDescription>{getModeDescription()}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : getModeTitle()}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm space-y-2">
            {mode !== 'signin' && (
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-primary hover:underline"
              >
                Already have an account? Sign in
              </button>
            )}

            {mode !== 'signup' && mode !== 'forgot' && (
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-primary hover:underline block"
              >
                Don't have an account? Sign up
              </button>
            )}

            {mode !== 'forgot' && (
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="text-muted-foreground hover:underline block"
              >
                Forgot your password?
              </button>
            )}

            {mode === 'forgot' && (
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-muted-foreground hover:underline block"
              >
                Back to sign in
              </button>
            )}
          </div>

          <div className="mt-6 pt-6 border-t text-center text-xs text-muted-foreground">
            <p>
              By continuing, you agree to QuandMarket's{' '}
              <a href="#" className="text-primary hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
