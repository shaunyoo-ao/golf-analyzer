/**
 * variant: 'green' | 'amber' | 'red' | 'gray'
 */
export default function Badge({ children, variant = 'green', className = '' }) {
  const variants = {
    green: 'bg-golf-100 text-golf-800',
    amber: 'bg-amber-100 text-amber-800',
    red: 'bg-red-100 text-red-700',
    gray: 'bg-gray-100 text-gray-600',
  };

  return (
    <span
      className={[
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  );
}
