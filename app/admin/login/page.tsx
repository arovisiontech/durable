import { redirect } from 'next/navigation'
import { createClient } from '@/src/lib/supabase/server'
import LoginForm from './LoginForm'

export default async function AdminLoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_active')
      .eq('id', user.id)
      .single()

    if (profile && profile.is_active && (profile.role === 'admin' || profile.role === 'editor')) {
      redirect('/admin')
    }
  }

  return <LoginForm />
}
