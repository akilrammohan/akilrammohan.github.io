export const runtime = 'edge';

export async function GET() {
  try {
    const response = await fetch(
      'https://github.com/akilrammohan/resume/raw/main/basic-resume/main.pdf'
    );

    if (!response.ok) {
      return new Response('Resume not found', { status: 404 });
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'application/pdf',
        'Cache-Control': 'public, max-age=86400', // 1 day cache
      },
    });
  } catch (error) {
    console.error('Error fetching resume:', error);
    return new Response('Error fetching resume', { status: 500 });
  }
}
