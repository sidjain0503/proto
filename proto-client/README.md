This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Features

- **Authentication**: Login system with JWT token management
- **AI Chat**: Integrated AI chat interface using the backend AI service
- **Protected Routes**: Automatic route protection for authenticated pages
- **Reusable Components**: Built with shadcn/ui components

## Getting Started

### Prerequisites

1. Make sure the backend server is running (see `../proto-backend`)
2. Create a `.env.local` file in the root directory with:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/proto/api
```

Replace `3000` with your backend server port if different.

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3001](http://localhost:3001) (or the port shown in the terminal) with your browser to see the result.

### Usage

1. Navigate to `/login` to authenticate
2. After login, you'll be redirected to the home page
3. Use the sidebar to navigate to the Chat page
4. Start chatting with the AI service

## Project Structure

- `app/` - Next.js app router pages
  - `login/` - Login page
  - `chat/` - AI chat interface
  - `page.js` - Home page
- `components/` - Reusable React components
  - `ui/` - shadcn/ui components
  - `shared/` - Shared components (Sidebar, Search)
  - `ProtectedRoute.jsx` - Route protection wrapper
- `contexts/` - React contexts
  - `AuthContext.jsx` - Authentication state management
- `lib/` - Utility functions
  - `api.js` - API client for backend communication

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
