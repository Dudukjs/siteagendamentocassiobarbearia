
import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
    children: ReactNode;
}

export function Button({ className, variant = 'primary', children, ...props }: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";

    const variants = {
        primary: "bg-primary text-slate-900 hover:bg-primary-hover shadow-md",
        outline: "border border-primary text-primary hover:bg-primary hover:text-slate-900",
        ghost: "text-slate-200 hover:bg-slate-800 hover:text-white"
    };

    return (
        <button className={cn(baseStyles, variants[variant], className)} {...props}>
            {children}
        </button>
    );
}
