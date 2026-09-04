'use client'

import { useState } from 'react'
import { Send, Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { subscribeNewsletterAction } from '@/app/actions/public'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.')
      return
    }

    setIsSubmitting(true)
    const res = await subscribeNewsletterAction(email)
    setIsSubmitting(false)

    if (res.success) {
      toast.success(res.message)
      setIsSubscribed(true)
      setEmail('')
    } else {
      toast.error(res.message)
    }
  }

  if (isSubscribed) {
    return (
      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-4 py-3 rounded-2xl">
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        <span>Thank you! You are subscribed to Durable Medical updates.</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-md w-full">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your work email address..."
        disabled={isSubmitting}
        required
        className="w-full text-xs px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-white placeholder-slate-500 font-medium"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-5 py-3 text-xs font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors shadow-xs flex items-center gap-1.5 shrink-0"
      >
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <span>Subscribe</span>
            <Send className="w-3.5 h-3.5" />
          </>
        )}
      </button>
    </form>
  )
}
