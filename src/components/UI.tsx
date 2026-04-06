import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'error';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  loading,
  children,
  ...props
}) => {
  const variants = {
    primary: 'bg-primary-dark text-white hover:bg-primary-medium shadow-sm',
    secondary: 'bg-accent-gold text-primary-dark hover:bg-white shadow-sm',
    outline: 'border-2 border-primary-dark text-primary-dark hover:bg-primary-dark hover:text-white',
    ghost: 'text-gray-dark hover:bg-gray-light',
    error: 'bg-error text-white hover:bg-red-700',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-full font-bold transition-all focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && <label className="text-sm font-semibold text-gray-dark ml-1">{label}</label>}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary-medium focus:ring-2 focus:ring-primary-light/20 outline-none transition-all placeholder:text-gray-400',
            error && 'border-error focus:border-error focus:ring-error/20',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-error font-medium ml-1">{error}</p>}
      </div>
    );
  }
);
