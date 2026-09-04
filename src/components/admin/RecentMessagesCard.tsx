import Link from 'next/link'
import { Mail, ArrowRight, MessageSquare } from 'lucide-react'

interface ContactMessageItem {
  id: string
  full_name?: string
  email?: string
  subject?: string
  status?: string
  created_at?: string
}

interface RecentMessagesCardProps {
  messages: ContactMessageItem[]
}

export function RecentMessagesCard({ messages }: RecentMessagesCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Recent Inquiries</h3>
            <p className="text-xs text-slate-500">Latest website contact messages</p>
          </div>
        </div>
        <Link
          href="/admin/contact-messages"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="py-4 flex-1">
        {messages.length === 0 ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">No contact messages yet</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-0.5">
                New inquiries submitted via the website contact page will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50/80 rounded-lg px-2 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {msg.full_name || 'Anonymous Inquiry'}
                    </p>
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        msg.status === 'read'
                          ? 'bg-slate-100 text-slate-600'
                          : msg.status === 'replied'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-700 border border-red-100'
                      }`}
                    >
                      {msg.status || 'new'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {msg.subject || msg.email || 'No Subject'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 text-right">
        <Link
          href="/admin/contact-messages"
          className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          Open Inbox →
        </Link>
      </div>
    </div>
  )
}
