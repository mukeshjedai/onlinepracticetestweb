# AussieCitizenshipPrep (Next.js)

Australian citizenship practice test frontend migrated to Next.js, inspired by [ozcitizenshiptest.com.au](https://www.ozcitizenshiptest.com.au/), with freemium access and Stripe checkout.

## Features

- Full-bleed hero using the Australian passport / Harbour Bridge image
- Free practice tests across the four official topic areas
- Premium one-time unlock (**AU$10.99**) for the full mock library
- Live scoring quiz player with immediate answer feedback
- Stripe Checkout + local demo unlock when Stripe keys are absent

## Run locally

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without Stripe keys, clicking **Buy Premium** unlocks Premium instantly for local testing.

## Auth & Stripe setup

Copy `.env.example` to `.env.local` and fill in:

- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- `AUTH_SECRET` / `AUTH_URL`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (optional for this Checkout flow)
- `STRIPE_WEBHOOK_SECRET` (optional; webhook logs completed sessions)
- `PREMIUM_TOKEN_SECRET`
- `NEXT_PUBLIC_APP_URL`

In Google Cloud Console, add this Authorized redirect URI:

`http://localhost:3000/api/auth/callback/google`

(and your production URL equivalent when deployed).

## Project layout

- `src/app` — pages and API routes
- `src/components` — landing, quiz, checkout UI
- `src/data` — practice questions and test catalogue
- `public/images` — website imagery

The original ASP.NET MVC app remains in the repo root. This `web` app is the new frontend experience.
"# onlinepracticetestweb" 
