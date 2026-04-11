import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost' | 'gradient';
    children: ReactNode;
}

export function Button({ className, variant = 'primary', children, disabled, ...props }: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 relative overflow-hidden";

    const variants = {
        primary: "bg-primary text-slate-900 hover:bg-primary-hover shadow-md hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98]",
        gradient: "bg-gradient-to-r from-primary to-yellow-300 text-slate-900 font-bold hover:shadow-xl hover:shadow-primary/40 active:scale-[0.98] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-700",
        outline: "border-2 border-primary text-primary hover:bg-primary hover:text-slate-900 hover:border-transparent transition-all active:scale-[0.98]",
        ghost: "text-slate-200 hover:bg-slate-800 hover:text-white"
    };

    return (
        <motion.button 
            className={cn(baseStyles, variants[variant], className)}
            disabled={disabled}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            {...props}
        >
            {children}
        </motion.button>
    );
}
