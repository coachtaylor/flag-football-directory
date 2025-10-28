'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

const CheckIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
)

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
}

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [formValues, setFormValues] = useState(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const router = useRouter()
  const { supabase, user, loading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/dashboard')
    }
  }, [authLoading, user, router])

  const handleToggle = (next: boolean) => {
    setIsLogin(next)
    setError(null)
    setMessage(null)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => setFormValues(INITIAL_FORM)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (authLoading || submitting) return

    setError(null)
    setMessage(null)
    setSubmitting(true)

    const { firstName, lastName, email, password, confirmPassword } = formValues

    try {
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) {
          setError(signInError.message)
        } else {
          resetForm()
          router.replace('/dashboard')
        }
      } else {
        if (password !== confirmPassword) {
          setError('Passwords do not match.')
          return
        }
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
            },
          },
        })

        if (signUpError) {
          setError(signUpError.message)
        } else {
          resetForm()
          if (data.session) {
            router.replace('/dashboard')
          } else {
            setMessage('Check your email to confirm your account before signing in.')
            setIsLogin(true)
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleForgotPassword = async () => {
    setError(null)
    setMessage(null)

    if (!formValues.email) {
      setError('Enter your email above so we can send a reset link.')
      return
    }

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(formValues.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (resetError) {
        setError(resetError.message)
      } else {
        setMessage('Check your email for a password reset link.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to request a password reset right now.')
    }
  }

  const submitLabel = useMemo(() => {
    if (submitting) {
      return isLogin ? 'Signing in…' : 'Creating account…'
    }
    return isLogin ? 'Sign In' : 'Create Account'
  }, [isLogin, submitting])

  const disableSubmit = submitting || authLoading

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8 lg:px-12">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-3 group mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-lg bg-[#001f3d] group-hover:bg-[#002d57] transition-all duration-300">
              FF
            </div>
            <div className="flex flex-col leading-tight text-left">
              <span className="text-lg font-semibold text-[#001f3d]">FlagFootball</span>
              <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#e87a00]">Directory</span>
            </div>
          </Link>
        </div>

        <div className="mx-auto max-w-md">
          <div className="mb-8 flex gap-2 rounded-2xl border border-gray-200 bg-white p-1.5">
            <button
              onClick={() => handleToggle(true)}
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                isLogin ? 'bg-[#001f3d] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => handleToggle(false)}
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                !isLogin ? 'bg-[#001f3d] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-semibold text-[#001f3d] mb-2">
                {isLogin ? 'Welcome back' : 'Get started'}
              </h1>
              <p className="text-gray-600">
                {isLogin ? 'Sign in to manage your programs' : 'Create an account to list your programs'}
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
                <span aria-hidden>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 flex items-start gap-2">
                <CheckIcon />
                <span>{message}</span>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-[#001f3d] mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formValues.firstName}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-[#001f3d] placeholder:text-gray-400 focus:border-[#001f3d] focus:outline-none focus:ring-2 focus:ring-[#001f3d]/20 transition-all duration-200"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-[#001f3d] mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formValues.lastName}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-[#001f3d] placeholder:text-gray-400 focus:border-[#001f3d] focus:outline-none focus:ring-2 focus:ring-[#001f3d]/20 transition-all duration-200"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#001f3d] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-[#001f3d] placeholder:text-gray-400 focus:border-[#001f3d] focus:outline-none focus:ring-2 focus:ring-[#001f3d]/20 transition-all duration-200"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#001f3d] mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formValues.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-[#001f3d] placeholder:text-gray-400 focus:border-[#001f3d] focus:outline-none focus:ring-2 focus:ring-[#001f3d]/20 transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>

              {!isLogin && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#001f3d] mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formValues.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-[#001f3d] placeholder:text-gray-400 focus:border-[#001f3d] focus:outline-none focus:ring-2 focus:ring-[#001f3d]/20 transition-all duration-200"
                    placeholder="••••••••"
                  />
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Need an account?{' '}
                    <button type="button" onClick={() => handleToggle(false)} className="font-semibold text-[#001f3d] hover:text-[#002d57]">
                      Create one
                    </button>
                  </span>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={!formValues.email || submitting}
                    className="text-[#001f3d] hover:text-[#002d57] font-medium disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={disableSubmit}
                className="w-full rounded-2xl bg-[#001f3d] px-6 py-3.5 text-sm font-semibold text-white hover:bg-blue-50 hover:text-[#001f3d] shadow-lg transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitLabel}
              </button>
            </form>

            {!isLogin && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-sm font-semibold text-[#001f3d] mb-4">What you&apos;ll get:</p>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-3">
                    <CheckIcon />
                    <span>Manage your flag football programs from a single dashboard.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckIcon />
                    <span>Connect with teams, players, and league directors.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckIcon />
                    <span>Track registrations and inquiries in real time.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckIcon />
                    <span>Get verified and boost your organization’s visibility.</span>
                  </li>
                </ul>
              </div>
            )}

            <div className="mt-6 text-center text-sm text-gray-600">
              {isLogin ? (
                <>
                  Don&apos;t have an account?{' '}
                  <button onClick={() => handleToggle(false)} className="text-[#001f3d] hover:text-[#002d57] font-semibold">
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button onClick={() => handleToggle(true)} className="text-[#001f3d] hover:text-[#002d57] font-semibold">
                    Sign in
                  </button>
                </>
              )}
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-gray-500">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="font-semibold text-[#001f3d] hover:text-[#002d57]">
              Terms & Conditions
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
