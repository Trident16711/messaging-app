import { createClient } from '@/lib/supabase/server'
import Chat from '@/components/chat'
import Auth from '@/components/auth'
import './globals.css'

export const metadata = { title: 'Loop — Messaging', description: 'A simple real-time messaging app' }

export default async function Home() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return <main><div className="shell"><header><div className="brand"><span className="logo">✦</span><span>loop</span></div>{user && <span className="status">● Live</span>}</header>{user ? <Chat user={user} /> : <Auth />}</div></main>
}
