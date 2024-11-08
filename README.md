# Fast Country Search Comparison

## 🔗 [Demo](https://search-omop.vercel.app/)

A high-performance country search application comparing Redis and Cloudflare KV performance, built with Next.js, providing real-time search suggestions with response time comparisons.

## 🚀 Features

- Real-time country search with prefix matching
- Performance comparison between Redis and Cloudflare KV
- Sub-300ms response times
- Dark/Light theme support using Shadcn/ui
- Type-safe implementation
- Edge computing with Cloudflare Workers
- Redis and KV-powered search indexes

## 🛠️ Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Cloudflare Workers, Hono
- **Database**: Redis (Upstash), Cloudflare KV
- **Deployment**: Vercel (Frontend), Cloudflare (API)

## 🏗️ Architecture

The application is built with four main components:

1. **Next.js Frontend**: Handles user interface and parallel search interactions
2. **Redis Database**: Stores and indexes country data using sorted sets
3. **Cloudflare KV**: Provides alternative storage and search capabilities
4. **Cloudflare Workers API**: Processes search requests at the edge

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- Yarn or npm
- Upstash Redis account
- Cloudflare account with Workers and KV access

### Installation

1. Clone the repository
2. Install dependencies
3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Update the following variables in your `.env.local`:
```
REDIS_URL=your_redis_url
REDIS_TOKEN=your_redis_token
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token
CLOUDFLARE_NAMESPACE_ID=your_kv_namespace_id
```

## 📦 Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── [[...route]]/
│   │   │       └── route.ts    # API endpoints for Redis and KV
│   │   ├── components/
│   │   │   └── ui/            # Shadcn components
│   │   ├── layout.tsx         # Root layout with theme
│   │   └── page.tsx          # Main comparison page
│   ├── lib/
│   │   ├── seed.ts           # Redis seeding script
│   │   └── seed-cloudflare.ts # KV seeding script
│   └── styles/
│       └── globals.css       # Global styles and theme
```

## 🔍 Implementation Details

### Parallel Search Implementation

The application performs parallel searches against both Redis and Cloudflare KV:

```typescript
const search = async (searchTerm: string) => {
  if (!searchTerm.trim()) {
    setResult(null);
    setKvResult(null);
    return;
  }

  // Parallel search execution
  Promise.all([
    searchRedis(searchTerm),
    searchKV(searchTerm)
  ]).catch(err => {
    console.error('Search error:', err);
  });
};
```

### Performance Comparison

The UI displays real-time performance metrics for both storage solutions:

- Response time comparison
- Result count comparison
- Search accuracy comparison

## 🎨 Styling

The application uses Tailwind CSS with Shadcn/ui components for a consistent design system:

- Dark/Light theme support
- Custom color variables
- Responsive design
- Accessible components

## 📈 Performance Optimizations

1. **Parallel Execution**: Simultaneous Redis and KV queries
2. **Edge Computing**: Low-latency responses
3. **Efficient Data Structures**: 
   - Redis: Sorted sets for prefix matching
   - KV: Key-based prefix search
4. **Type Safety**: Full TypeScript implementation
5. **Client-side State Management**: Optimized rendering

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
- [Cloudflare KV](https://developers.cloudflare.com/workers/runtime-apis/kv)
- [Hono](https://hono.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)

## 📧 Contact


Project Link: [https://github.com/yourusername/fast-country-search](https://github.com/yourusername/fast-country-search)
```

This README provides a comprehensive overview of the project, including setup instructions, architecture details, and deployment guidelines. Remember to replace placeholder values (like usernames and social media links) with your actual information before using it.
