export const runtime = 'edge';

export async function GET() {
  try {
    const response = await fetch(
      'https://github.com/akilrammohan/resume/raw/main/basic-resume/Akil_Rammohan_Resume_Public.pdf'
    );

    if (!response.ok) {
      return new Response('Resume not found', { status: 404 });
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'application/pdf',
        // s-maxage lets Vercel's CDN serve this without invoking the function;
        // stale-while-revalidate keeps serving the old PDF while refreshing.
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  } catch (error) {
    console.error('Error fetching resume:', error);
    return new Response('Error fetching resume', { status: 500 });
  }
}
