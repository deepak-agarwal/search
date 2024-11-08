/* eslint-disable @typescript-eslint/no-explicit-any */
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
    terms: any;
    TERMS_KV : any;
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

app.get('/search/kv', async (c) => {
    try {
        const input = c.req.query('input')?.toUpperCase();
        console.log('Search input:', input);

        if(!input) {
            return c.json({ message: 'No input provided' }, 400);
        }

        const start = performance.now();
        
        const { TERMS_KV } = env(c) as EnvConfig;
        console.log('KV binding:', TERMS_KV ? 'exists' : 'missing');
        
        const res: string[] = [];
        
        // List KV keys with the prefix (input)
        console.log('Attempting to list keys with prefix:', input);
        const keys = await TERMS_KV.list({ prefix: input, limit: 100 });
        console.log('Retrieved keys:', keys);
        
        // Process each key
        for (const key of keys.keys) {
            console.log('Processing key:', key);
            if (!key.name.startsWith(input)) {
                break;
            }
            // Remove the '*' suffix if it exists
            if (key.name.endsWith('*')) {
                res.push(key.name.slice(0, -1));
            }
        }
        
        const end = performance.now();
        console.log('Final results:', res);

        return c.json({ results: res, duration: end - start });
    } catch (err: unknown) {
        console.error('Error details:', err);
        // Return more detailed error information
        return c.json({ 
            message: 'Internal server error', 
            error: err instanceof Error ? err.message : String(err),
            stack: err instanceof Error ? err.stack : undefined
        }, 500);
    }
});

export const GET = handle(app);
export default app as never;