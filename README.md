# Fast Country Search

## 🔗 [Demo](https://search-omop.vercel.app/)

A high-performance country search application built with Next.js, Redis, and Cloudflare Workers, providing real-time search suggestions with response times under 300ms.

## 🚀 Features

- Real-time country search with prefix matching
- Sub-300ms response times
- Dark/Light theme support
- Type-safe implementation
- Edge computing with Cloudflare Workers
- Redis-powered search index

## 🛠️ Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Cloudflare Workers, Hono
- **Database**: Redis (Upstash)
- **Deployment**: Vercel (Frontend), Cloudflare (API)

## 🏗️ Architecture

The application is built with three main components:

1. **Next.js Frontend**: Handles user interface and search interactions
2. **Redis Database**: Stores and indexes country data
3. **Cloudflare Workers API**: Processes search requests at the edge

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- Yarn or npm
- Upstash Redis account
- Cloudflare account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fast-country-search.git
cd fast-country-search
```

2. Install dependencies:
```bash
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Update the following variables in your `.env.local`:
```
REDIS_URL=your_redis_url
REDIS_TOKEN=your_redis_token
```

### Development

Run the development server:
```bash
yarn dev
```

Visit `http://localhost:3000` to see the application.

## 📦 Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── [[...route]]/
│   │   │       └── route.ts    # API endpoints
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx           # Main search page
│   ├── lib/
│   │   └── seed.ts            # Redis seeding script
│   └── styles/
│       └── globals.css        # Global styles
├── public/
├── wrangler.toml              # Cloudflare configuration
└── package.json
```

## 🔍 Implementation Details

### Frontend Search Component

The main search functionality is implemented with debouncing and error handling:

```typescript
const search = async (searchTerm: string) => {
  if (!searchTerm.trim()) {
    setResult(null);
    return;
  }

  setIsLoading(true);
  setError(null);

  try {
    const response = await fetch(
      `https://search-redis.fast-search.workers.dev/api/search?input=${encodeURIComponent(searchTerm)}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // ... response handling
  } catch (err) {
    setError({ 
      message: err instanceof Error ? err.message : 'An unexpected error occurred' 
    });
  }
};
```

### API Implementation

The search API endpoint uses Hono and Redis for efficient prefix matching:

```typescript
app.get('/search', async (c) => {
  const input = c.req.query('input')?.toUpperCase();
  const redis = new Redis({
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN,
  });

  const res = [];
  const rank = await redis.zrank('terms', input);

  // ... search logic
});
```

## 🎨 Styling

The application uses Tailwind CSS with a custom theme configuration supporting both light and dark modes. Theme variables are defined in `globals.css`.

## 📈 Performance Optimizations

1. **Debounced Search**: Prevents excessive API calls
2. **Edge Computing**: Low-latency responses
3. **Efficient Data Structure**: Redis sorted sets
4. **Type Safety**: TypeScript implementation
5. **Client-side Caching**: State management

## 🚀 Deployment

### Frontend Deployment (Vercel)

```bash
yarn build
vercel deploy
```

### API Deployment (Cloudflare)

```bash
yarn deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Upstash Redis](https://upstash.com/)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Hono](https://hono.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/fast-country-search](https://github.com/yourusername/fast-country-search)
```

This README provides a comprehensive overview of the project, including setup instructions, architecture details, and deployment guidelines. Remember to replace placeholder values (like usernames and social media links) with your actual information before using it.
