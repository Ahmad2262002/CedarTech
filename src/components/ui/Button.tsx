import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', fullWidth = false, children, disabled, ...props }, ref) => {
    
    let baseStyles = 'inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-blue disabled:opacity-50 disabled:cursor-not-allowed';
    
    let sizeStyles = '';
    if (size === 'sm') sizeStyles = 'px-4 py-2 text-xs';
    if (size === 'md') sizeStyles = 'px-6 py-3 text-sm';
    if (size === 'lg') sizeStyles = 'px-8 py-4 text-base';

    let variantStyles = '';
    if (variant === 'primary') {
      variantStyles = 'bg-accent-blue text-white hover:bg-blue-600 shadow-[0_4px_14px_rgba(0,113,227,0.3)] hover:shadow-[0_6px_20px_rgba(0,113,227,0.4)] active:scale-95';
    } else if (variant === 'ghost') {
      variantStyles = 'bg-white/5 text-brand-text-primary hover:bg-white/10 active:scale-95 border border-white/10 hover:border-white/20';
    } else if (variant === 'outline') {
      variantStyles = 'bg-transparent text-brand-text-primary hover:bg-white/5 active:scale-95 border border-white/20 hover:border-white/40';
    } else if (variant === 'danger') {
      variantStyles = 'bg-red-500/10 text-red-500 hover:bg-red-500/20 active:scale-95 border border-transparent hover:border-red-500/30';
    }

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${widthStyle} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
