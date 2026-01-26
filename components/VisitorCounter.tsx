interface VisitorCounterProps {
  count: number | null;
}

export const VisitorCounter = ({ count }: VisitorCounterProps) => {
  if (count === null) {
    return null;
  }

  const formattedCount = count.toLocaleString();

  return (
    <span className="visitor-counter">
      (visitor {formattedCount})
    </span>
  );
};
