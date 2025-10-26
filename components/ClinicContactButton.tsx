'use client'

import { useState } from 'react'
import TeamContactForm from './TeamContactForm'

interface ClinicContactButtonProps {
  clinicName: string
  clinicId: number
  contactEmail?: string | null
}

export default function ClinicContactButton({ clinicName, clinicId, contactEmail }: ClinicContactButtonProps) {
  const [showForm, setShowForm] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#e87a00] to-[#f59e0b] px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-[#e87a00]/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#e87a00]/40"
      >
        Contact Clinic
      </button>
      {showForm && (
        <TeamContactForm
          teamName={clinicName}
          teamId={clinicId}
          onClose={() => setShowForm(false)}
        />
      )}
    </>
  )
}

