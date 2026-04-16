/**
 * variant: 'primary' | 'secondary' | 'ghost' | 'danger'
 * size: 'sm' | 'md' | 'lg'
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
}) {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 active:scale-95 select-none';

  const sizes = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 py-3 text-base min-h-[44px]',
    lg: 'px-6 py-4 text-lg min-h-[52px]',
  };

  const variants = {
    primary:
      'bg-golf-600 text-white hover:bg-golf-700 active:bg-golf-800 disabled:bg-golf-300 disabled:text-golf-600',
    secondary:
      'bg-golf-100 text-golf-800 hover:bg-golf-200 active:bg-golf-300 border border-golf-300',
    ghost:
      'bg-transparent text-golf-700 hover:bg-golf-100 active:bg-golf-200',
    danger:
      'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        base,
        sizes[size],
        variants[variant],
        fullWidth ? 'w-full' : '',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  );
}
