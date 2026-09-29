import { User } from '@supabase/supabase-js'
import { ChatRoom } from './chat-room'

export default function Chat({ user }: { user: User }) {
  return <ChatRoom user={user} />
}
