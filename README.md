# Messaging App

A real-time messaging app built with Next.js, Supabase, and Vercel.

## Features

- Email/password authentication via Supabase Auth
- Public room and direct-message-ready data model
- Real-time message updates with Supabase Realtime
- Responsive chat interface
- Typing-friendly message composer

## Run locally

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL Editor.
3. Copy `.env.example` to `.env.local` and add your project URL and anon key.
4. Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy to Vercel

Import this repository into Vercel and add the variables from `.env.example` in Project Settings → Environment Variables.
