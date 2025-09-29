// components/Hero.tsx
/** biome-ignore-all lint/correctness/useUniqueElementIds: <explanation> */
import { Icon } from '@iconify/react';
import { api } from '@my-better-t-app/backend/convex/_generated/api';
import type { SearchResponse } from '@my-better-t-app/backend/convex/search';
import { useAction } from 'convex/react';
import { useState } from 'react';
import { Button } from './ui/button';
import { VapiWidget } from './vapi-widget';

type HeroProps = {
	setDj: (dj: string) => void;
	onSearchResults?: (results: SearchResponse | null) => void;
};

export default function Hero({ setDj, onSearchResults }: HeroProps) {
	const [input, setInput] = useState('');
	const [isListening, setIsListening] = useState(false);
	const [isSearching, setIsSearching] = useState(false);

	const searchGoogle = useAction(api.search.searchGoogle);

	const vapiWidget = VapiWidget({
		apiKey: process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '',
		assistantId: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || '',
		onCallStart: () => {
			setIsListening(true);
			console.log('Voice call started');
		},
		onCallEnd: () => {
			setIsListening(false);
			setIsSearching(false);
			console.log('Voice call ended');
		},
		onFunctionCall: async (functionCall, vapiRef) => {
			console.log('Function call:', functionCall);
			console.log('Function call2:', functionCall.function.name);
			if (functionCall.function.name === 'search_music') {
				const query = functionCall.function.arguments.query as string;

				// Switch to searching state
				setIsSearching(true);
				setIsListening(false);

				// Say "Searching..." immediately
				vapiRef.current?.say('Searching for your music now...');

				try {
					const result = await searchGoogle({ query });
					onSearchResults?.(result);
					console.log('Voice search completed:', result);

					// Say success message
					const songCount =
						result.success && result.data?.songs ? result.data.songs.length : 0;
					if (songCount > 0) {
						vapiRef.current?.say(
							`Perfect! I found ${songCount} songs for you.`,
							true,
						);
					} else {
						vapiRef.current?.say(
							`Hmm, I couldn't find any songs. Try asking for a different genre or mood!`,
						);
						// Switch back to listening for retry
						setIsListening(true);
						setIsSearching(false);
					}
				} catch (error) {
					console.error('Voice search error:', error);
					vapiRef.current?.say(
						'Sorry, I ran into an issue searching for music. Please try again!',
					);
					// Switch back to listening for retry
					setIsListening(true);
					setIsSearching(false);
				}
			}
		},
		onError: (error) => {
			console.error('Vapi error:', error);
			setIsListening(false);
			setIsSearching(false);
		},
		onTranscript: (transcript, role) => {
			if (role === 'user') {
				console.log('User said:', transcript);
				// Optionally update the input field with voice input
				// setInput(transcript);
			}
		},
	});

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
		if (isListening) {
			// If already listening, stop the call
			vapiWidget.stopCall();
		} else {
			// Start listening
			vapiWidget.startCall();
		}
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
								id='micBtn'
								variant='gradient'
								size='gradient'
								aria-pressed={!!isListening}
								disabled={isSearching}
								onClick={handleVoiceSearchStart}
								className={isListening ? 'animate-pulse' : ''}
								title={isListening ? 'Stop listening' : 'Start voice search'}
							>
								<Icon
									icon={isListening ? 'lucide:mic-2' : 'lucide:mic'}
									className='h-6 w-6 text-white'
								/>
								{/* Live ring - only when listening */}
								{isListening && (
									<span
										id='micPulse'
										className='pointer-events-none absolute inset-0 animate-ping rounded-full ring-4 ring-sky-400/50'
									/>
								)}
							</Button>
						</div>
					</div>
					{/* Status messages */}
					{isListening && (
						<div className='mt-3 text-center'>
							<p className='flex items-center justify-center gap-2 text-emerald-400 text-sm'>
								<Icon
									icon='lucide:waveform'
									className='h-4 w-4 animate-pulse'
								/>
								Listening...
							</p>
						</div>
					)}
					{isSearching && (
						<div className='mt-3 text-center'>
							<p className='flex items-center justify-center gap-2 text-blue-400 text-sm'>
								<Icon icon='lucide:loader' className='h-4 w-4 animate-spin' />
								Searching...
							</p>
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
