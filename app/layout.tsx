import './globals.css'

export const metadata = {
  title: 'Loop — Messaging',
  description: 'A real-time messaging app built with Supabase and Vercel.'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
