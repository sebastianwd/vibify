import { Icon } from '@iconify/react';
import type { SearchResponse } from '@my-better-t-app/backend/convex/search';
import { Button } from './ui/button';

type PlaylistsSectionProps = {
	searchResults?: SearchResponse | null;
};

export const PlaylistsSection = ({ searchResults }: PlaylistsSectionProps) => {
	return (
		<section className='mt-6 mb-40 md:mb-36'>
			{/* Header */}
			<div className='mb-6'>
				<h2 className='font-medium text-white text-xl'>Playlists</h2>
			</div>

			{/* Main Content */}
			<div className='flex flex-col gap-6 lg:flex-row'>
				{/* History Panel */}
				<div className='order-2 w-full lg:order-0 lg:w-64 lg:flex-shrink-0'>
					<div className='h-full rounded-2xl bg-white/5 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.35)] ring-1 ring-white/10 backdrop-blur'>
						<h3 className='font-medium text-white'>History</h3>
						<div className='flex h-full flex-col items-center justify-center pb-4 text-center'>
							<div className='mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/80 to-cyan-400/80 shadow-[0_8px_30px_rgba(16,185,129,0.25)] ring-1 ring-white/20'>
								<Icon icon='lucide:clock' className='h-6 w-6 text-white' />
							</div>
							<h4 className='mb-2 font-medium text-sm text-white'>
								No history yet
							</h4>
							<p className='mb-4 text-white/60 text-xs'>
								Your created playlists will appear here
							</p>
							<Button variant='outline' size='sm' className='text-xs'>
								<Icon icon='lucide:log-in' className='h-3 w-3' />
								Sign in to save
							</Button>
						</div>
					</div>
				</div>

				{/* Main Playlist Content */}
				<div className='flex-1'>
					<div className='max-h-[50svh] overflow-y-auto rounded-2xl bg-white/5 px-6 shadow-[0_12px_40px_rgba(0,0,0,0.35)] ring-1 ring-white/10 backdrop-blur sm:px-8'>
						{searchResults &&
						searchResults.success &&
						searchResults.data?.songNames ? (
							<>
								{/* Playlist Header */}
								<div className='sticky top-0 flex items-center gap-4 bg-[#10141E] py-6'>
									<Button variant='gradient' size='gradient'>
										<Icon icon='lucide:play' className='h-6 w-6 text-white' />
										{/* Live ring */}
										<span className='pointer-events-none absolute inset-0 rounded-full opacity-0 ring-4 ring-sky-400/30' />
									</Button>
									<div>
										<h3 className='font-medium text-lg text-white'>
											{searchResults.data.playlistTitle ||
												searchResults.originalQuery}
										</h3>
										<p className='text-sm text-white/60'>
											{searchResults.data.songNames.length} tracks • Generated
											playlist
										</p>
									</div>
								</div>

								{/* Song List */}
								<div className='space-y-1'>
									{searchResults.data.songNames.map((song, index) => (
										<div
											key={song}
											className='group flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-white/5'
										>
											{/* Play icon */}
											<Button variant='icon' size='icon'>
												<Icon icon='lucide:play' className='h-4 w-4' />
											</Button>

											{/* Track number */}
											<span className='w-4 text-sm text-white/40'>
												{index + 1}
											</span>

											{/* Track info */}
											<div className='min-w-0 flex-1'>
												<p className='truncate font-medium text-sm text-white'>
													{song}
												</p>
												<p className='text-white/50 text-xs'>
													{new Date().toLocaleDateString('en-US', {
														month: 'short',
														day: 'numeric',
													})}
												</p>
											</div>

											{/* More options */}
											<Button variant='icon' size='icon'>
												<Icon
													icon='lucide:more-horizontal'
													className='h-4 w-4'
												/>
											</Button>
										</div>
									))}
								</div>
							</>
						) : (
							<div className='flex flex-col items-center justify-center py-16 text-center'>
								<div className='mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/80 to-cyan-400/80 shadow-[0_8px_30px_rgba(16,185,129,0.25)] ring-1 ring-white/20'>
									<Icon
										icon='lucide:list-music'
										className='h-8 w-8 text-white'
									/>
								</div>
								<h3
									className='mb-2 font-geist text-white text-xl tracking-tight'
									style={{ fontWeight: 600 }}
								>
									No playlists yet
								</h3>
								<p className='mb-6 max-w-md font-geist text-white/70'>
									Kick things off by asking your AI DJ for a vibe. Your
									creations will appear here.
								</p>
								<div className='flex flex-col items-center gap-3 sm:flex-row'>
									<Button
										variant='default'
										size='sm'
										className='bg-emerald-500/90 hover:bg-emerald-400'
									>
										Generate a playlist
									</Button>
									<Button variant='outline' size='sm'>
										Import from file
									</Button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Community Playlists */}
			<div className='mt-8'>
				<h3 className='mb-4 font-medium text-lg text-white'>
					Community Playlists
				</h3>
				<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
					{/* Card */}
					<div className='group overflow-hidden rounded-xl bg-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.35)] ring-1 ring-white/10 backdrop-blur transition-all hover:bg-white/10 hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)]'>
						<div className='relative aspect-square overflow-hidden'>
							<img
								src='https://images.unsplash.com/photo-1546443046-ed1ce6ffd1ab?q=80&w=800&auto=format&fit=crop'
								alt='Playlist cover'
								className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
							/>
							<div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80' />
							<div className='absolute right-2 bottom-2 left-2 flex items-center justify-between'>
								<div className='flex items-center gap-1.5'>
									<Button
										variant='icon'
										size='icon'
										className='rounded-md bg-white/10 ring-1 ring-white/20 backdrop-blur hover:bg-white/20'
									>
										<Icon icon='lucide:play' className='h-4 w-4 text-white' />
									</Button>
									<Button
										variant='icon'
										size='icon'
										className='rounded-md bg-white/10 ring-1 ring-white/20 backdrop-blur hover:bg-white/20'
									>
										<Icon
											icon='lucide:share-2'
											className='h-4 w-4 text-white'
										/>
									</Button>
									<Button
										variant='icon'
										size='icon'
										className='rounded-md bg-white/10 ring-1 ring-white/20 backdrop-blur hover:bg-white/20'
									>
										<Icon icon='lucide:plus' className='h-4 w-4 text-white' />
									</Button>
								</div>
							</div>
						</div>
						<div className='p-3'>
							<p
								className='truncate font-geist text-white tracking-tight'
								style={{ fontWeight: 600 }}
							>
								Midnight Commute
							</p>
							<p className='font-geist text-sm text-white/60'>by Alex</p>
						</div>
					</div>
					{/* Card */}
					<div className='group overflow-hidden rounded-xl bg-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.35)] ring-1 ring-white/10 backdrop-blur transition-all hover:bg-white/10 hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)]'>
						<div className='relative aspect-square overflow-hidden'>
							<img
								src='https://images.unsplash.com/photo-1621619856624-42fd193a0661?w=1080&q=80'
								alt='Playlist cover'
								className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
							/>
							<div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80' />
							<div className='absolute right-2 bottom-2 left-2 flex items-center justify-between'>
								<div className='flex items-center gap-1.5'>
									<Button
										variant='icon'
										size='icon'
										className='rounded-md bg-white/10 ring-1 ring-white/20 backdrop-blur hover:bg-white/20'
									>
										<Icon icon='lucide:play' className='h-4 w-4 text-white' />
									</Button>
									<Button
										variant='icon'
										size='icon'
										className='rounded-md bg-white/10 ring-1 ring-white/20 backdrop-blur hover:bg-white/20'
									>
										<Icon
											icon='lucide:share-2'
											className='h-4 w-4 text-white'
										/>
									</Button>
									<Button
										variant='icon'
										size='icon'
										className='rounded-md bg-white/10 ring-1 ring-white/20 backdrop-blur hover:bg-white/20'
									>
										<Icon icon='lucide:plus' className='h-4 w-4 text-white' />
									</Button>
								</div>
							</div>
						</div>
						<div className='p-3'>
							<p
								className='truncate font-geist text-white tracking-tight'
								style={{ fontWeight: 600 }}
							>
								Lo-Fi Study Room
							</p>
							<p className='font-geist text-sm text-white/60'>by Priya</p>
						</div>
					</div>
					{/* Card */}
					<div className='group overflow-hidden rounded-xl bg-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.35)] ring-1 ring-white/10 backdrop-blur transition-all hover:bg-white/10 hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)]'>
						<div className='relative aspect-square overflow-hidden'>
							<img
								src='https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop'
								alt='Playlist cover'
								className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
							/>
							<div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80' />
							<div className='absolute right-2 bottom-2 left-2 flex items-center justify-between'>
								<div className='flex items-center gap-1.5'>
									<Button
										variant='icon'
										size='icon'
										className='rounded-md bg-white/10 ring-1 ring-white/20 backdrop-blur hover:bg-white/20'
									>
										<Icon icon='lucide:play' className='h-4 w-4 text-white' />
									</Button>
									<Button
										variant='icon'
										size='icon'
										className='rounded-md bg-white/10 ring-1 ring-white/20 backdrop-blur hover:bg-white/20'
									>
										<Icon
											icon='lucide:share-2'
											className='h-4 w-4 text-white'
										/>
									</Button>
									<Button
										variant='icon'
										size='icon'
										className='rounded-md bg-white/10 ring-1 ring-white/20 backdrop-blur hover:bg-white/20'
									>
										<Icon icon='lucide:plus' className='h-4 w-4 text-white' />
									</Button>
								</div>
							</div>
						</div>
						<div className='p-3'>
							<p
								className='truncate font-geist text-white tracking-tight'
								style={{ fontWeight: 600 }}
							>
								Neon Nights
							</p>
							<p className='font-geist text-sm text-white/60'>by Kaito</p>
						</div>
					</div>
					{/* Card */}
					<div className='group overflow-hidden rounded-xl bg-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.35)] ring-1 ring-white/10 backdrop-blur transition-all hover:bg-white/10 hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)]'>
						<div className='relative aspect-square overflow-hidden'>
							<img
								src='https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=1080&q=80'
								alt='Playlist cover'
								className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
							/>
							<div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80' />
							<div className='absolute right-2 bottom-2 left-2 flex items-center justify-between'>
								<div className='flex items-center gap-1.5'>
									<Button
										variant='icon'
										size='icon'
										className='rounded-md bg-white/10 ring-1 ring-white/20 backdrop-blur hover:bg-white/20'
									>
										<Icon icon='lucide:play' className='h-4 w-4 text-white' />
									</Button>
									<Button
										variant='icon'
										size='icon'
										className='rounded-md bg-white/10 ring-1 ring-white/20 backdrop-blur hover:bg-white/20'
									>
										<Icon
											icon='lucide:share-2'
											className='h-4 w-4 text-white'
										/>
									</Button>
									<Button
										variant='icon'
										size='icon'
										className='rounded-md bg-white/10 ring-1 ring-white/20 backdrop-blur hover:bg-white/20'
									>
										<Icon icon='lucide:plus' className='h-4 w-4 text-white' />
									</Button>
								</div>
							</div>
						</div>
						<div className='p-3'>
							<p
								className='truncate font-geist text-white tracking-tight'
								style={{ fontWeight: 600 }}
							>
								Deep Work Flow
							</p>
							<p className='font-geist text-sm text-white/60'>by Nora</p>
						</div>
					</div>
					{/* Card */}
					<div className='group overflow-hidden rounded-xl bg-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.35)] ring-1 ring-white/10 backdrop-blur transition-all hover:bg-white/10 hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)]'>
						<div className='relative aspect-square overflow-hidden'>
							<img
								src='https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?q=80&w=800&auto=format&fit=crop'
								alt='Playlist cover'
								className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
							/>
							<div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80' />
							<div className='absolute right-2 bottom-2 left-2 flex items-center justify-between'>
								<div className='flex items-center gap-1.5'>
									<Button
										variant='icon'
										size='icon'
										className='rounded-md bg-white/10 ring-1 ring-white/20 backdrop-blur hover:bg-white/20'
									>
										<Icon icon='lucide:play' className='h-4 w-4 text-white' />
									</Button>
									<Button
										variant='icon'
										size='icon'
										className='rounded-md bg-white/10 ring-1 ring-white/20 backdrop-blur hover:bg-white/20'
									>
										<Icon
											icon='lucide:share-2'
											className='h-4 w-4 text-white'
										/>
									</Button>
									<Button
										variant='icon'
										size='icon'
										className='rounded-md bg-white/10 ring-1 ring-white/20 backdrop-blur hover:bg-white/20'
									>
										<Icon icon='lucide:plus' className='h-4 w-4 text-white' />
									</Button>
								</div>
							</div>
						</div>
						<div className='p-3'>
							<p
								className='truncate font-geist text-white tracking-tight'
								style={{ fontWeight: 600 }}
							>
								Sunset Drive
							</p>
							<p className='font-geist text-sm text-white/60'>by Liam</p>
						</div>
					</div>
					{/* Card */}
					<div className='group overflow-hidden rounded-xl bg-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.35)] ring-1 ring-white/10 backdrop-blur transition-all hover:bg-white/10 hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)]'>
						<div className='relative aspect-square overflow-hidden'>
							<img
								src='https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop'
								alt='Playlist cover'
								className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
							/>
							<div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80' />
							<div className='absolute right-2 bottom-2 left-2 flex items-center justify-between'>
								<div className='flex items-center gap-1.5'>
									<Button
										variant='icon'
										size='icon'
										className='rounded-md bg-white/10 ring-1 ring-white/20 backdrop-blur hover:bg-white/20'
									>
										<Icon icon='lucide:play' className='h-4 w-4 text-white' />
									</Button>
									<Button
										variant='icon'
										size='icon'
										className='rounded-md bg-white/10 ring-1 ring-white/20 backdrop-blur hover:bg-white/20'
									>
										<Icon
											icon='lucide:share-2'
											className='h-4 w-4 text-white'
										/>
									</Button>
									<Button
										variant='icon'
										size='icon'
										className='rounded-md bg-white/10 ring-1 ring-white/20 backdrop-blur hover:bg-white/20'
									>
										<Icon icon='lucide:plus' className='h-4 w-4 text-white' />
									</Button>
								</div>
							</div>
						</div>
						<div className='p-3'>
							<p
								className='truncate font-geist text-white tracking-tight'
								style={{ fontWeight: 600 }}
							>
								Synthwave Sprint
							</p>
							<p className='font-geist text-sm text-white/60'>by Jae</p>
						</div>
					</div>
					{/* Card */}
					<div className='group overflow-hidden rounded-xl bg-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.35)] ring-1 ring-white/10 backdrop-blur transition-all hover:bg-white/10 hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)]'>
						<div className='relative aspect-square overflow-hidden'>
							<img
								src='https://images.unsplash.com/photo-1635151227785-429f420c6b9d?w=1080&q=80'
								alt='Playlist cover'
								className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
							/>
							<div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80' />
							<div className='absolute right-2 bottom-2 left-2 flex items-center justify-between'>
								<div className='flex items-center gap-1.5'>
									<Button
										variant='icon'
										size='icon'
										className='rounded-md bg-white/10 ring-1 ring-white/20 backdrop-blur hover:bg-white/20'
									>
										<Icon icon='lucide:play' className='h-4 w-4 text-white' />
									</Button>
									<Button
										variant='icon'
										size='icon'
										className='rounded-md bg-white/10 ring-1 ring-white/20 backdrop-blur hover:bg-white/20'
									>
										<Icon
											icon='lucide:share-2'
											className='h-4 w-4 text-white'
										/>
									</Button>
									<Button
										variant='icon'
										size='icon'
										className='rounded-md bg-white/10 ring-1 ring-white/20 backdrop-blur hover:bg-white/20'
									>
										<Icon icon='lucide:plus' className='h-4 w-4 text-white' />
									</Button>
								</div>
							</div>
						</div>
						<div className='p-3'>
							<p
								className='truncate font-geist text-white tracking-tight'
								style={{ fontWeight: 600 }}
							>
								Coffee &amp; Code
							</p>
							<p className='font-geist text-sm text-white/60'>by Sam</p>
						</div>
					</div>
					{/* Card */}
					<div className='group overflow-hidden rounded-xl bg-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.35)] ring-1 ring-white/10 backdrop-blur transition-all hover:bg-white/10 hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)]'>
						<div className='relative aspect-square overflow-hidden'>
							<img
								src='https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800&auto=format&fit=crop'
								alt='Playlist cover'
								className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
							/>
							<div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80' />
							<div className='absolute right-2 bottom-2 left-2 flex items-center justify-between'>
								<div className='flex items-center gap-1.5'>
									<Button
										variant='icon'
										size='icon'
										className='rounded-md bg-white/10 ring-1 ring-white/20 backdrop-blur hover:bg-white/20'
									>
										<Icon icon='lucide:play' className='h-4 w-4 text-white' />
									</Button>
									<Button
										variant='icon'
										size='icon'
										className='rounded-md bg-white/10 ring-1 ring-white/20 backdrop-blur hover:bg-white/20'
									>
										<Icon
											icon='lucide:share-2'
											className='h-4 w-4 text-white'
										/>
									</Button>
									<Button
										variant='icon'
										size='icon'
										className='rounded-md bg-white/10 ring-1 ring-white/20 backdrop-blur hover:bg-white/20'
									>
										<Icon icon='lucide:plus' className='h-4 w-4 text-white' />
									</Button>
								</div>
							</div>
						</div>
						<div className='p-3'>
							<p
								className='truncate font-geist text-white tracking-tight'
								style={{ fontWeight: 600 }}
							>
								Ambient Focus
							</p>
							<p className='font-geist text-sm text-white/60'>by Aria</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
