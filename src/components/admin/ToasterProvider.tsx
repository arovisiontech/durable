'use client'

import { Toaster } from 'sonner'

export function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#0F172A',
          color: '#F8FAFC',
          border: '1px solid #1E293B',
        },
      }}
    />
  )
}
