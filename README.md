# Creative Coding Hackathon Judging Portal

A premium, production-grade judging platform for the **Creative Coding Hackathon 2026** at **Avantika University**. Built with Next.js 16, Tailwind CSS v4, and Supabase.

## 🚀 Key Features
- **Official Branding**: Fully integrated with Avantika University brand guidelines.
- **Judge Dashboard**: Responsive, real-time evaluation panel for judges.
- **Dynamic Scoring**: Score matrix with auto-calculations for creativity, technicality, and more.
- **Real-time Data**: Syncs directly with Supabase for persistent evaluation records.
- **Premium UI**: Crafted with Framer Motion and custom glassmorphism components.

## 🛠 Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Database**: Supabase
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Playfair Display (Serif), Inter (Sans-serif)

## 📦 Getting Started

### 1. Prerequisites
- Node.js 18.x or later
- npm or pnpm

### 2. Environment Setup
Create a `.env.local` file in the root directory (or copy `.env.example`):
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Install & Run
```bash
npm install
npm run dev
```

## 🌐 Deployment (Vercel)

This project is Vercel-ready. To deploy:

1. Push your code to GitHub.
2. Connect your repository to [Vercel](https://vercel.com).
3. Add the environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Vercel dashboard under Project Settings > Environment Variables.
4. Deployment will trigger automatically on push.

## 🎨 Brand Compliance
The portal adheres to the official Avantika University Brand Guidelines, including the use of primary Red (`#C10016`) and secondary Orange/Yellow accents.

---
Developed for **Avantika University - Creative Coding Hackathon 2026**.
