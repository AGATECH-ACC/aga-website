# AGA Website Foundation

Next.js foundation for the AGA website, including the CSTAN Personal NFC AI Card at `/en/gulichantan` and `/zh/gulichantan`.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui

## Scripts

```bash
npm run dev
npm run build
npm run lint
```

## CSTAN NFC AI Card Setup

1. Create a Cloudflare account.

2. Enable Workers AI.

3. Create a Cloudflare API token with Workers AI permission.

4. Find your Cloudflare Account ID.

5. Copy `.env.example` into `.env.local`.

6. Add:

```env
CLOUDFLARE_ACCOUNT_ID=xxxx
CLOUDFLARE_AI_TOKEN=xxxx
```

7. Run:

```bash
npm install
npm run dev
```

8. Test the chat.

9. Deploy to Vercel.

10. Add the same environment variables into Vercel.

11. Point the NFC card to the deployed URL.
