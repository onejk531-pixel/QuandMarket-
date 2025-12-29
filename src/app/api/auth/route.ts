import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required'
      }, { status: 400 })
    }

    // Check if user exists (for sign in)
    let user = await db.user.findUnique({
      where: { email }
    })

    if (name) {
      // Sign up - create new user
      if (user) {
        return NextResponse.json({
          success: false,
          error: 'User already exists'
        }, { status: 400 })
      }

      user = await db.user.create({
        data: {
          email,
          name,
          // In production, hash the password!
          // password: await hash(password)
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Account created successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      }, { status: 201 })
    } else {
      // Sign in
      if (!user) {
        return NextResponse.json({
          success: false,
          error: 'Invalid credentials'
        }, { status: 401 })
      }

      // In production, verify password hash!
      // const isValid = await verify(password, user.password)

      return NextResponse.json({
        success: true,
        message: 'Signed in successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      })
    }
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({
      success: false,
      error: 'Authentication failed'
    }, { status: 500 })
  }
}
