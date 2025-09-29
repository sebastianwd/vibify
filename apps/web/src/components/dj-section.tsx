// components/Hero.tsx
/** biome-ignore-all lint/correctness/useUniqueElementIds: <explanation> */
/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */

import { Icon } from '@iconify/react';
import { api } from '@my-better-t-app/backend/convex/_generated/api';
import type { SearchResponse } from '@my-better-t-app/backend/convex/search';
import { useAction } from 'convex/react';
import { useState } from 'react';
import { Button } from './ui/button';

type HeroProps = {
	setDj: (dj: string) => void;
	onSearchResults?: (results: SearchResponse | null) => void;
};

export default function Hero({ setDj, onSearchResults }: HeroProps) {
	const [input, setInput] = useState('');
	const [isSearching, setIsSearching] = useState(false);

	const searchGoogle = useAction(api.search.searchGoogle);

	const shuffleDjs = [
		'Chill Vibes',
		'Neon Nights',
		'Focus Flow',
		'Upbeat Energy',
		'Ambient Drift',
	];

	const handleShuffle = () => {
		const choice = shuffleDjs[Math.floor(Math.random() * shuffleDjs.length)];
		setDj(choice);
	};

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim()) return;

		setIsSearching(true);
		try {
			const result = await searchGoogle({ query: input });
			onSearchResults?.(result);
			console.log('Search results:', result);
		} catch (error) {
			console.error('Search error:', error);
		} finally {
			setIsSearching(false);
		}
	};

	const handleVoiceSearchStart = () => {
		setIsSearching(true);
	};

	const handleVoiceSearchComplete = (results: any) => {
		onSearchResults?.(results);
		setIsSearching(false);
	};

	return (
		<section className='pt-8 sm:pt-10 md:pt-12'>
			<div className='mx-auto max-w-3xl'>
				<h1
					className='mb-4 font-semibold font-space-grotesk text-3xl text-white tracking-tight sm:text-4xl'
					style={{ fontWeight: 600 }}
				>
					Your AI DJ for playlists, moods, and moments
				</h1>
				<p className='mb-6 font-geist text-white/70'>
					Describe the vibe. Speak it or type it—your sets build themselves.
				</p>

				{/* Command Box */}
				<form onSubmit={handleSearch} className='relative'>
					<label htmlFor='command' className='sr-only font-geist'>
						Command
					</label>
					<div className='flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-2 shadow-[0_6px_24px_rgba(0,0,0,0.35)] ring-1 ring-white/10 backdrop-blur transition-all focus-within:ring-2 focus-within:ring-emerald-400/50 not-focus-within:hover:ring-white/20 sm:px-4'>
						<Icon icon='lucide:search' className='h-5 w-5 text-white/50' />
						<input
							id='command'
							type='text'
							placeholder='Try: Make me a chill study playlist'
							className='w-full bg-transparent py-3 text-base text-white placeholder-white/40 outline-none sm:text-lg'
							style={{ fontWeight: 400 }}
							value={input}
							onChange={(e) => setInput(e.target.value)}
							disabled={isSearching}
						/>
						<div className='flex items-center gap-2'>
							<span className='hidden rounded-md px-2 py-1 font-geist text-white/50 text-xs ring-1 ring-white/10 sm:inline-flex'>
								/
							</span>
							<Button
								type='submit'
								id='micBtn'
								variant='gradient'
								size='gradient'
								aria-pressed='false'
								disabled={isSearching}
							>
								<Icon icon='lucide:mic' className='h-6 w-6 text-white' />
								{/* Live ring */}
								<span
									id='micPulse'
									className='pointer-events-none absolute inset-0 rounded-full opacity-0 ring-4 ring-sky-400/30'
								/>
							</Button>
						</div>
					</div>
					{isSearching && (
						<div className='mt-3 text-center'>
							<p className='text-sm text-white/60'>Searching...</p>
						</div>
					)}
					<div className='mt-3 flex items-center justify-between'>
						<div className='flex w-fit items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.25)] ring-1 ring-white/10 backdrop-blur transition-colors hover:bg-white/10'>
							<Icon
								icon='lucide:keyboard'
								className='h-4 w-4 text-emerald-300'
							/>
							<p className='font-geist text-sm text-white/80'>
								Type a prompt or click the mic to talk to your AI DJ.
							</p>
						</div>
						<Button
							id='shufflePersona'
							variant='ghost'
							className='hidden items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white sm:inline-flex'
							type='button'
						>
							<Icon icon='lucide:shuffle' className='h-4 w-4' />
							<span className='font-geist'>Change DJ</span>
						</Button>
					</div>
				</form>
			</div>
		</section>
	);
}
