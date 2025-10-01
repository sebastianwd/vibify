import type { Variants } from 'motion/react';

// Container variants for staggered animations
export const containerVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { duration: 0.15 },
	},
	exit: {
		opacity: 0,
		transition: { duration: 0.1 },
	},
};

// Item variants for individual elements
export const itemVariants: Variants = {
	hidden: { opacity: 0, y: 10 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.15 },
	},
};

// Loading variants for loading states
export const loadingVariants: Variants = {
	hidden: { opacity: 0, scale: 0.9 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: { duration: 0.2, ease: 'easeOut' },
	},
	exit: {
		opacity: 0,
		scale: 0.9,
		transition: { duration: 0.1 },
	},
};

// Slide variants for horizontal animations
export const slideVariants: Variants = {
	hidden: { opacity: 0, x: -20 },
	visible: {
		opacity: 1,
		x: 0,
		transition: { duration: 0.3, ease: 'easeOut' },
	},
	exit: {
		opacity: 0,
		x: 20,
		transition: { duration: 0.2 },
	},
};

// Fade variants for simple opacity transitions
export const fadeVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { duration: 0.3 },
	},
	exit: {
		opacity: 0,
		transition: { duration: 0.2 },
	},
};

// Scale variants for hover effects
export const scaleVariants: Variants = {
	hidden: { scale: 1 },
	visible: {
		scale: 1.05,
		transition: { duration: 0.2 },
	},
	exit: {
		scale: 1,
		transition: { duration: 0.2 },
	},
};
