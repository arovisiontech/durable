import { redirect } from 'next/navigation'
import { createClient } from '@/src/lib/supabase/server'
import { AdminShell } from '@/src/components/admin/AdminShell'

export const dynamic = 'force-dynamic'

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      redirect('/admin/login')
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, role, is_active')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError || !profile || !profile.is_active || (profile.role !== 'admin' && profile.role !== 'editor')) {
      redirect('/admin/login')
    }

    return (
      <AdminShell
        email={user.email}
        fullName={profile.full_name || undefined}
        role={profile.role}
      >
        {children}
      </AdminShell>
    )
  } catch (err) {
    // If redirect was thrown by Next.js navigation, rethrow it
    if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) {
      throw err
    }
    console.error('Error in AdminProtectedLayout:', err)
    redirect('/admin/login')
  }
}
