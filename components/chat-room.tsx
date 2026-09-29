'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

type Message = {
  id: number
  content: string
  user_id: string
  created_at: string
  profiles: { display_name: string | null } | null
}

export function ChatRoom({ user }: { user: User }) {
  const supabase = createClient()
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const end = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let active = true

    async function load() {
      const { data, error } = await supabase
        .from('messages')
        .select('id, content, user_id, created_at, profiles(display_name)')
        .order('created_at', { ascending: true })
        .limit(100)

      if (error) {
        console.error(error)
        return
      }

      if (active) {
        setMessages((data as Message[]) ?? [])
        setLoading(false)
      }
    }

    load()

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        async ({ new: row }) => {
          const { data, error } = await supabase
            .from('messages')
            .select('id, content, user_id, created_at, profiles(display_name)')
            .eq('id', row.id)
            .single()

          if (error) {
            console.error(error)
            return
          }

          const message = data as Message
          setMessages((current) => (current.some((m) => m.id === message.id) ? current : [...current, message]))
        }
      )
      .subscribe()

    return () => {
      active = false
      supabase.removeChannel(channel)
    }
  }, [supabase])

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const content = text.trim()
    if (!content) return

    setText('')
    const { error } = await supabase.from('messages').insert({ content, user_id: user.id })
    if (error) {
      console.error(error)
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    window.location.reload()
  }

  return (
    <section className="chat">
      <div className="chat-title">
        <div>
          <p className="eyebrow">GENERAL ROOM</p>
          <h1>Community chat</h1>
        </div>
        <button className="ghost" onClick={signOut}>Sign out</button>
      </div>

      <div className="messages">
        {loading ? (
          <p className="empty">Loading messages…</p>
        ) : messages.length === 0 ? (
          <p className="empty">No messages yet. Start the conversation.</p>
        ) : (
          messages.map((message) => (
            <article className={message.user_id === user.id ? 'message mine' : 'message'} key={message.id}>
              <div className="avatar">
                {(message.profiles?.display_name || 'U').slice(0, 1).toUpperCase()}
              </div>
              <div>
                <div className="meta">
                  <strong>{message.user_id === user.id ? 'You' : message.profiles?.display_name || 'Member'}</strong>
                  <time>
                    {new Date(message.created_at).toLocaleTimeString([], {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </time>
                </div>
                <p>{message.content}</p>
              </div>
            </article>
          ))
        )}
        <div ref={end} />
      </div>

      <form className="composer" onSubmit={send}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a message…"
          maxLength={2000}
        />
        <button aria-label="Send message">➜</button>
      </form>
    </section>
  )
}
