import { Redis } from '@upstash/redis/cloudflare';
import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { cors } from 'hono/cors';
import { handle } from 'hono/vercel';

export const runtime = 'edge';

const app = new Hono().basePath('/api');

type EnvConfig={
    redis_token: string;
    redis_url: string;
}
app.use('*', cors());
app.get('/search',async (c) => {
    try{
        const {redis_token, redis_url} = env(c) as EnvConfig;

    const redis = new Redis({
        url: redis_url,
        token: redis_token,
    });

    const start = performance.now();

    const input = c.req.query('input')?.toUpperCase();

    if(!input) {
        return c.json({ message: 'No input provided' }, 400);
    }

    const res = [];
    const rank = await redis.zrank('terms', input);

    if(rank) {
        const temp: string[] = await redis.zrange('terms', rank, rank + 100);

        for (const item of temp) {
            if(!item.includes(input)) {
                break;
            }
            if(item.endsWith('*')) {
                res.push(item.slice(0, -1));
            }
        }
    }

    const end = performance.now();
        return c.json({ results: res, duration: end - start });
    } catch (err: unknown) {
        return c.json({ message: 'Internal server error', err }, 500);
    }
});

export const GET = handle(app);
export default app as never;