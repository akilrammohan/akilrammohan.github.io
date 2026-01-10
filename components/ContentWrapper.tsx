'use client';

interface ContentWrapperProps {
  children: React.ReactNode;
}

export const ContentWrapper = ({ children }: ContentWrapperProps) => {
  // CSS uses vw units which are stable (include scrollbar space)
  // No JavaScript compensation needed
  return (
    <main className="content">
      {children}
    </main>
  );
};
