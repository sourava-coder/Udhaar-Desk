# UdhaarDesk - Kirana Credit & Khata

A mobile-first web app tailored for Kirana (grocery) shop owners in India to track customer credit (udhaar), send 30-day payment reminders with UPI pay links via WhatsApp, and generate instant UPI QR codes.

## Features

1. **Udhaar List (Khata Screen)**: Shows total outstanding debt, individual customer balances, and auto-flags dues older than 30 days with a high-contrast Red Alert.
2. **Add Entry (Naya Bill)**: Record Udhaar (credit) or Jama (payment received) with fast Kirana item chips and an option to send an itemized bill via WhatsApp.
3. **Taqaza Screen (30+ Days Overdue)**: Filter customers with 30+ days due, preview formatted Hinglish reminders, and send 1-tap WhatsApp reminders with auto-generated UPI payment links.
4. **Customer Khata Page**: Itemized ledger history, running balance, "Pay by UPI" deep link, and live counter QR code generator for instant payments.
5. **Dukaan Hisaab (Owner Reports)**: Track weekly recovery amounts, total outstanding market credit, and top oldest dues ranking.

## How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

Open your browser at `http://localhost:3000` (or the port displayed in your terminal). To see the mobile view, toggle Device Emulation in Chrome DevTools (Ctrl+Shift+I / Cmd+Option+I -> Mobile icon).

## Cloud Accounts (Laptop + Mobile)

Account login and shop ledgers use Supabase so the same email address and password can be used on multiple devices.

1. Create a Supabase project and copy its Project URL and publishable (anon) key.
2. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. In the Supabase SQL Editor, run [`supabase/schema.sql`](./supabase/schema.sql).
4. In Supabase Authentication, enable Email sign-in. If email confirmation is enabled, configure email delivery and confirm the address before signing in. Supabase requires passwords to be at least 6 characters.
5. Restart the Vite server. Create the cloud account on one device, then log in on other devices with the same email and password.

Only the publishable/anon key belongs in the frontend. Never expose the Supabase `service_role` key.

Accounts created before cloud setup were stored only in that browser. They are not automatically transferred; create a new cloud account with an email address. Existing phone-auth accounts and their customer ledgers are not automatically migrated to email authentication.

### 3. Build for Production
```bash
npm run build
```

## Tech Stack
- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Lucide React Icons
- QRCode generation & Canvas Confetti
- Web Audio API for cash register chimes
