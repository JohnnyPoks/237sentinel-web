// The logo: a shield with a check — security + verification, the product's job.
// Uses currentColor so it inherits the surrounding text colour.
export default function ShieldMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      role="img"
    >
      <path d="M12 2 4 5.5v5.2c0 4.8 3.3 7.9 8 9.8 4.7-1.9 8-5 8-9.8V5.5L12 2z" />
      <path d="m8.6 11.8 2.3 2.3 4.5-4.6" />
    </svg>
  );
}
