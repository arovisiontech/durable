'use client'

import { useTransition } from 'react'
import { logoutAction } from '../actions'

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => startTransition(() => logoutAction())}
      disabled={isPending}
      className="px-4 py-2.5 bg-red-600/80 hover:bg-red-600 text-white text-xs font-semibold uppercase tracking-wider rounded-xl shadow-md transition duration-200 disabled:opacity-50 flex items-center gap-2"
    >
      {isPending ? (
        <>
          <svg
            className="animate-spin h-3.5 w-3.5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Signing Out...</span>
        </>
      ) : (
        <span>Sign Out</span>
      )}
    </button>
  )
}
