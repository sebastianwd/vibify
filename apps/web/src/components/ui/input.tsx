import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const inputVariants = cva(
	'flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:ring-destructive/40',
	{
		variants: {
			variant: {
				default: 'border-input dark:bg-input/30',
				auth: 'border-white/20 bg-white/5 text-white placeholder-white/40 focus:border-emerald-400 focus:ring-emerald-400/50',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
);

export interface InputProps
	extends React.ComponentProps<'input'>,
		VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, variant, type, ...props }, ref) => {
		return (
			<input
				type={type}
				data-slot='input'
				className={cn(inputVariants({ variant, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);
Input.displayName = 'Input';

export { Input };
