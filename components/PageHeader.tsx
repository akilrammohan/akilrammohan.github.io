import { Navigation } from './Navigation';

export const PageHeader = ({ title }: { title: string }) => (
  <>
    <div className="page-header">
      <div className="title-block">
        <h1>{title}</h1>
      </div>
    </div>
    <div className="page-nav">
      <Navigation />
    </div>
  </>
);
