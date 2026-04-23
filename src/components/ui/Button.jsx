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
    primary: 'btn-glass',
    secondary: 'btn-glass',
    ghost: 'text-white/50 hover:bg-white/10 active:bg-white/15',
    danger: 'bg-red-500/70 border border-red-400/40 text-white',
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
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  );
}
