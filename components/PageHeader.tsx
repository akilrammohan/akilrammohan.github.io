import { Navigation } from './Navigation';
import { ThemeToggle } from './ThemeToggle';

export const PageHeader = ({ title }: { title: string }) => (
  <>
    <div className="page-header">
      <div className="title-block">
        <h1>{title}</h1>
      </div>
      <ThemeToggle />
    </div>
    <div className="page-nav">
      <Navigation />
      <ThemeToggle />
    </div>
  </>
);
