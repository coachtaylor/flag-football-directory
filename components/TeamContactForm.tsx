'use client'

import { useState } from 'react'

interface TeamContactFormProps {
  teamName: string
  teamId: number
  onClose: () => void
}

export default function TeamContactForm({ teamName, teamId, onClose }: TeamContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    // Required
    parentFirstName: '',
    parentLastName: '',
    email: '',
    // Optional
    phone: '',
    city: '',
    state: '',
    // Player Information (optional)
    playerFirstName: '',
    playerLastName: '',
    ageGroup: '',
    gender: '',
    experienceLevel: '',
    playerBio: '',
    highlightVideo: '',
    instagramHandle: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // TODO: Implement actual submission logic (e.g., send to API endpoint)
    // For now, just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    setSubmitted(true)
    setIsSubmitting(false)

    // Close modal after 2 seconds
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="relative w-full max-w-lg rounded-3xl border border-[#001f3d]/10 bg-white p-8 shadow-2xl">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-[#001f3d] mb-2">Message Sent!</h3>
            <p className="text-[#345c72]">The team will be in touch soon.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl border border-[#001f3d]/10 bg-white shadow-2xl my-8">
        {/* Header */}
        <div className="border-b border-[#001f3d]/10 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-[#001f3d]">Contact {teamName}</h2>
              <p className="text-sm text-[#345c72] mt-1">Fill out the form below and the team will reach out to you.</p>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#001f3d]/15 text-[#345c72] transition hover:bg-gray-50 hover:text-[#001f3d]"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          {/* Parent Information - Required */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#001f3d] flex items-center gap-2">
              Parent Information
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Required</span>
            </h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="parentFirstName" className="block text-sm font-medium text-[#001f3d] mb-1.5">
                  First Name *
                </label>
                <input
                  type="text"
                  id="parentFirstName"
                  name="parentFirstName"
                  required
                  value={formData.parentFirstName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#001f3d]/15 bg-white px-4 py-2.5 text-sm font-medium text-[#001f3d] focus:border-[#e87a00] focus:outline-none focus:ring-2 focus:ring-[#e87a00]/25"
                />
              </div>

              <div>
                <label htmlFor="parentLastName" className="block text-sm font-medium text-[#001f3d] mb-1.5">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="parentLastName"
                  name="parentLastName"
                  required
                  value={formData.parentLastName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#001f3d]/15 bg-white px-4 py-2.5 text-sm font-medium text-[#001f3d] focus:border-[#e87a00] focus:outline-none focus:ring-2 focus:ring-[#e87a00]/25"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#001f3d] mb-1.5">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#001f3d]/15 bg-white px-4 py-2.5 text-sm font-medium text-[#001f3d] focus:border-[#e87a00] focus:outline-none focus:ring-2 focus:ring-[#e87a00]/25"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-[#345c72] mb-1.5">
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#001f3d]/15 bg-white px-4 py-2.5 text-sm font-medium text-[#001f3d] focus:border-[#e87a00] focus:outline-none focus:ring-2 focus:ring-[#e87a00]/25"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-[#345c72] mb-1.5">
                  City (optional)
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#001f3d]/15 bg-white px-4 py-2.5 text-sm font-medium text-[#001f3d] focus:border-[#e87a00] focus:outline-none focus:ring-2 focus:ring-[#e87a00]/25"
                />
              </div>
            </div>

            <div className="sm:w-1/2 sm:pr-2">
              <label htmlFor="state" className="block text-sm font-medium text-[#345c72] mb-1.5">
                State (optional)
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                maxLength={2}
                placeholder="CA"
                className="w-full rounded-xl border border-[#001f3d]/15 bg-white px-4 py-2.5 text-sm font-medium text-[#001f3d] uppercase focus:border-[#e87a00] focus:outline-none focus:ring-2 focus:ring-[#e87a00]/25"
              />
            </div>
          </div>

          {/* Player Information - Optional */}
          <div className="space-y-4 border-t border-[#001f3d]/10 pt-6">
            <h3 className="text-lg font-semibold text-[#001f3d] flex items-center gap-2">
              Player Information
              <span className="text-xs font-medium text-[#345c72] bg-gray-100 px-2 py-0.5 rounded-full">Optional</span>
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="playerFirstName" className="block text-sm font-medium text-[#345c72] mb-1.5">
                  Player First Name
                </label>
                <input
                  type="text"
                  id="playerFirstName"
                  name="playerFirstName"
                  value={formData.playerFirstName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#001f3d]/15 bg-white px-4 py-2.5 text-sm font-medium text-[#001f3d] focus:border-[#e87a00] focus:outline-none focus:ring-2 focus:ring-[#e87a00]/25"
                />
              </div>

              <div>
                <label htmlFor="playerLastName" className="block text-sm font-medium text-[#345c72] mb-1.5">
                  Player Last Name
                </label>
                <input
                  type="text"
                  id="playerLastName"
                  name="playerLastName"
                  value={formData.playerLastName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#001f3d]/15 bg-white px-4 py-2.5 text-sm font-medium text-[#001f3d] focus:border-[#e87a00] focus:outline-none focus:ring-2 focus:ring-[#e87a00]/25"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="ageGroup" className="block text-sm font-medium text-[#345c72] mb-1.5">
                  Age Group
                </label>
                <select
                  id="ageGroup"
                  name="ageGroup"
                  value={formData.ageGroup}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#001f3d]/15 bg-white px-4 py-2.5 text-sm font-medium text-[#001f3d] focus:border-[#e87a00] focus:outline-none focus:ring-2 focus:ring-[#e87a00]/25"
                >
                  <option value="">Select</option>
                  <option value="6U">6U</option>
                  <option value="8U">8U</option>
                  <option value="10U">10U</option>
                  <option value="12U">12U</option>
                  <option value="14U">14U</option>
                  <option value="16U">16U</option>
                  <option value="18U">18U</option>
                  <option value="ADULT">Adult</option>
                </select>
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-[#345c72] mb-1.5">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#001f3d]/15 bg-white px-4 py-2.5 text-sm font-medium text-[#001f3d] capitalize focus:border-[#e87a00] focus:outline-none focus:ring-2 focus:ring-[#e87a00]/25"
                >
                  <option value="">Select</option>
                  <option value="boys">Boys</option>
                  <option value="girls">Girls</option>
                  <option value="coed">Coed</option>
                </select>
              </div>

              <div>
                <label htmlFor="experienceLevel" className="block text-sm font-medium text-[#345c72] mb-1.5">
                  Experience
                </label>
                <select
                  id="experienceLevel"
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#001f3d]/15 bg-white px-4 py-2.5 text-sm font-medium text-[#001f3d] capitalize focus:border-[#e87a00] focus:outline-none focus:ring-2 focus:ring-[#e87a00]/25"
                >
                  <option value="">Select</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="elite">Elite</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="playerBio" className="block text-sm font-medium text-[#345c72] mb-1.5">
                Player Bio
              </label>
              <textarea
                id="playerBio"
                name="playerBio"
                rows={4}
                value={formData.playerBio}
                onChange={handleChange}
                placeholder="Tell us about the player's strengths, position preferences, and goals..."
                className="w-full rounded-xl border border-[#001f3d]/15 bg-white px-4 py-2.5 text-sm font-medium text-[#001f3d] focus:border-[#e87a00] focus:outline-none focus:ring-2 focus:ring-[#e87a00]/25 resize-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="highlightVideo" className="block text-sm font-medium text-[#345c72] mb-1.5">
                  Highlight Video URL
                </label>
                <input
                  type="url"
                  id="highlightVideo"
                  name="highlightVideo"
                  value={formData.highlightVideo}
                  onChange={handleChange}
                  placeholder="https://youtube.com/..."
                  className="w-full rounded-xl border border-[#001f3d]/15 bg-white px-4 py-2.5 text-sm font-medium text-[#001f3d] focus:border-[#e87a00] focus:outline-none focus:ring-2 focus:ring-[#e87a00]/25"
                />
              </div>

              <div>
                <label htmlFor="instagramHandle" className="block text-sm font-medium text-[#345c72] mb-1.5">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  id="instagramHandle"
                  name="instagramHandle"
                  value={formData.instagramHandle}
                  onChange={handleChange}
                  placeholder="@username"
                  className="w-full rounded-xl border border-[#001f3d]/15 bg-white px-4 py-2.5 text-sm font-medium text-[#001f3d] focus:border-[#e87a00] focus:outline-none focus:ring-2 focus:ring-[#e87a00]/25"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 border-t border-[#001f3d]/10 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-[#001f3d]/15 bg-white px-5 py-3 text-sm font-semibold text-[#001f3d] transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-xl bg-gradient-to-r from-[#e87a00] to-[#f59e0b] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#e87a00]/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#e87a00]/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

