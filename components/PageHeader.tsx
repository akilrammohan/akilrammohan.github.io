import { ThemeToggle } from './ThemeToggle';

export const PageHeader = ({ title }: { title: string }) => (
  <div className="page-header">
    <h1>{title}</h1>
    <ThemeToggle />
  </div>
);
