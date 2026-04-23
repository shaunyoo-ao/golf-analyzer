export default function Card({ children, className = '', onClick }) {
  return (
    <div
      onClick={onClick}
      className={[
        'glass-card',
        onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
