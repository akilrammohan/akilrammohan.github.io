import { revalidateTag } from 'next/cache';

export async function POST(request: Request) {
  try {
    const { tag, secret } = await request.json();

    if (secret !== process.env.REVALIDATE_SECRET) {
      return Response.json({ error: 'Invalid secret' }, { status: 401 });
    }

    revalidateTag(tag); // e.g., 'goodreads'
    return Response.json({ revalidated: true, tag, now: Date.now() });
  } catch (error) {
    console.error('Error revalidating:', error);
    return Response.json({ error: 'Error revalidating' }, { status: 500 });
  }
}
