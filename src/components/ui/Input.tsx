import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', icon, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-brand-text-secondary">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute inset-y-0 left-3.5 flex items-center text-brand-text-tertiary pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={`
              w-full text-brand-text-primary rounded-xl py-3 outline-none text-sm
              bg-white/5 border border-white/10
              focus:bg-white/10 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${icon ? 'pl-10 pr-4' : 'px-4'}
              ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
