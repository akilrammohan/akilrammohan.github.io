import Navigation from '@/components/Navigation';
import { incrementVisitorCount } from '@/lib/visitor';
import { VisitorCounter } from '@/components/VisitorCounter';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Writing',
};

export default async function WritingPage() {
  const visitorCount = await incrementVisitorCount();

  return (
    <div className="main-content-column">
      <h1 className="floating-title">Writing<VisitorCounter count={visitorCount} /></h1>
      <Navigation />
      <p>Under construction...</p>
    </div>
  );
}
