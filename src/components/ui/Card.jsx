export default function Card({ children, className = '', onClick }) {
  return (
    <div
      onClick={onClick}
      className={[
        'bg-white rounded-2xl shadow-sm border border-golf-100 p-4',
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
