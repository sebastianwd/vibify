import type { ComponentProps } from 'react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface RangeSliderProps extends ComponentProps<typeof Slider> {
	maxLabel?: string;
	minLabel?: string;
}

export const RangeSlider = (props: RangeSliderProps) => {
	const { maxLabel, minLabel, className, ...rest } = props;

	return (
		<div className={cn('flex items-center gap-1', className)}>
			{minLabel ? (
				<span className='block w-6 text-gray-400 text-xs'>{minLabel}</span>
			) : null}
			<Slider {...rest} />
			{maxLabel ? (
				<span className='block w-6 text-gray-400 text-xs'>{maxLabel}</span>
			) : null}
		</div>
	);
};
