'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { supabase } = useAuth()
  const [verifying, setVerifying] = useState(true)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const code = searchParams.get('code')
    const type = searchParams.get('type')

    if (!code || type !== 'recovery') {
      setError('This password reset link is invalid or has expired.')
      setVerifying(false)
      return
    }

    supabase.auth
      .exchangeCodeForSession(code)
      .then(({ error: exchangeError }) => {
        if (exchangeError) {
          setError(exchangeError.message)
        } else {
          setVerified(true)
        }
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Unable to verify reset link.')
      })
      .finally(() => setVerifying(false))
  }, [searchParams, supabase])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) {
        setError(updateError.message)
      } else {
        setSuccess(true)
        setPassword('')
        setConfirmPassword('')
        setTimeout(() => router.replace('/login'), 2000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update your password.')
    } finally {
      setSubmitting(false)
    }
  }

  if (verifying) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-gray-500">
        Verifying reset link…
      </div>
    )
  }

  if (!verified) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="max-w-md rounded-3xl border border-red-200 bg-red-50 px-6 py-8 text-center shadow">
          <h1 className="text-xl font-semibold text-red-700 mb-3">Password reset link invalid</h1>
          <p className="text-sm text-red-600">{error ?? 'Please request a new reset link from the login page.'}</p>
          <button
            onClick={() => router.push('/login')}
            className="mt-6 inline-flex items-center rounded-2xl bg-[#001f3d] px-5 py-2.5 text-sm font-semibold text-white shadow hover:-translate-y-0.5 hover:shadow-lg transition"
          >
            Back to login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50/30 px-6">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white px-8 py-10 shadow-2xl">
        <h1 className="text-2xl font-semibold text-[#001f3d] text-center mb-2">Set a new password</h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter a new password for your FlagFootballDirectory account.
        </p>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {success && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            Password updated! Redirecting you to login…
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#001f3d] mb-2">
              New password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-[#001f3d] placeholder:text-gray-400 focus:border-[#001f3d] focus:outline-none focus:ring-2 focus:ring-[#001f3d]/20 transition-all duration-200"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#001f3d] mb-2">
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-[#001f3d] placeholder:text-gray-400 focus:border-[#001f3d] focus:outline-none focus:ring-2 focus:ring-[#001f3d]/20 transition-all duration-200"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-[#001f3d] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-50 hover:text-[#001f3d] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  )
}
