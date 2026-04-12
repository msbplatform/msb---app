# MSB Earth

A platform for donations, campaigns, and community impact. MSB Earth connects donors with meaningful causes, enabling transparent fundraising and tracking.

## Features

- **Campaign Browsing** — Discover and explore public campaigns
- **Donations (Stripe)** — Secure payments powered by Stripe
- **Anonymous Donations** — Donate without revealing your identity
- **User Profiles** — Public and private profile pages
- **Campaign Likes & Comments** — Engage with campaigns you care about
- **Liked Campaigns** — View all campaigns you've liked
- **Donation Tracking** — Track donations and campaign progress
- **Password Reset** — Forgot password / recovery flow via email
- **Share Campaigns** — Copy campaign links to clipboard

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend:** Supabase (Auth, PostgreSQL Database, Edge Functions)
- **Payments:** Stripe
- **Routing:** React Router
- **State Management:** TanStack React Query

## Getting Started

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd msb-earth

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Variables

Create a `.env` file with the following:

```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

For Stripe integration, configure your Stripe keys in the Supabase Edge Function secrets.

## Project Structure

```
src/
├── components/       # Reusable UI components
├── contexts/         # Auth context provider
├── hooks/            # Custom React hooks
├── integrations/     # Supabase client & types
├── pages/            # Route pages (Index, Auth, Campaign, Profile, etc.)
└── lib/              # Utility functions

supabase/
└── functions/        # Edge Functions (create-donation, verify-donation)
```

## Live Site

[https://www.msb.earth](https://www.msb.earth)
