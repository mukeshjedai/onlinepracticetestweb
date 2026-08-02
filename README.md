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

## Deployment topology

| App | Host | URL |
|-----|------|-----|
| Next.js frontend | Vercel | https://www.aussiecitizenshipprep.com.au |
| ASP.NET API/MVC | MonsterASP / runasp | http://citizenshiptest.runasp.net |

Browser calls **same-origin** Next.js `/api/*`. Next.js server routes proxy authenticated requests to ASP.NET using `X-Api-Key` + `X-User-Email`.

## Auth & Stripe setup

Set these on Vercel (Production) and in `.env.local` for local:

- `NEXT_PUBLIC_APP_URL` / `AUTH_URL` / `NEXTAUTH_URL` → `https://www.aussiecitizenshipprep.com.au`
- `ASPNET_API_URL` → `http://citizenshiptest.runasp.net`
- `ASPNET_API_KEY` → must match ASP.NET `ApiAuth:ApiKey`
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` (or `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`)
- `AUTH_SECRET`
- `STRIPE_SECRET_KEY`
- `PREMIUM_TOKEN_SECRET`

Google Cloud Console → Authorized redirect URIs:

- `https://www.aussiecitizenshipprep.com.au/api/auth/callback/google`
- `https://onlinepracticetest.vercel.app/api/auth/callback/google`
- `http://localhost:3000/api/auth/callback/google` (local)

## Project layout

- `src/app` — pages and API routes (BFF to ASP.NET)
- `src/components` — landing, quiz, checkout UI
- `src/data` — practice questions and test catalogue
- `public/images` — website imagery

ASP.NET (repo root) exposes authenticated JSON APIs under `/api/*` (`X-Api-Key` required).
"# onlinepracticetestweb" 
