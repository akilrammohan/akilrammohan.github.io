import { allPosts } from 'contentlayer/generated';
import { notFound } from 'next/navigation';
import { useMDXComponent } from 'next-contentlayer/hooks';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';

export async function generateStaticParams() {
  return allPosts
    .filter(post => process.env.NODE_ENV === 'production' ? !post.draft : true)
    .map(post => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = allPosts.find(p => p.slug === params.slug);
  return { title: post?.title };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = allPosts.find(p => p.slug === params.slug);

  if (!post) notFound();

  const MDXContent = useMDXComponent(post.body.code);

  return (
    <div className="container">
      <h1>{post.title}</h1>
      <Navigation />
      <article>
        <Link href="/writing">← Back to Writing</Link>
        <time dateTime={post.date}>
          {new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </time>
        {post.draft && <span> Draft</span>}
        <div>
          <MDXContent />
        </div>
      </article>
    </div>
  );
}
