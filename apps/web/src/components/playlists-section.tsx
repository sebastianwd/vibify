import { Icon } from '@iconify/react';
import { api } from '@my-better-t-app/backend/convex/_generated/api';
import type { Id } from '@my-better-t-app/backend/convex/_generated/dataModel';
import {
	Authenticated,
	AuthLoading,
	Unauthenticated,
	useMutation,
	useQuery,
} from 'convex/react';
import { AnimatePresence, motion } from 'motion/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { usePlaySong } from '@/hooks/use-play-song';
import {
	containerVariants,
	itemVariants,
	loadingVariants,
} from '@/lib/animations';
import { usePlayerState } from '@/store/use-player';
import { CommunityPlaylists } from './community-playlists';
import { SongList } from './song-list';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

type CurrentPlaylist = {
	title: string;
	songs: Array<{ artist: string; title: string }>;
} | null;

type PlaylistsSectionProps = {
	selectedPlaylistId: Id<'playlists'> | null;
	setSelectedPlaylistId: (id: Id<'playlists'> | null) => void;
	currentPlaylist: CurrentPlaylist;
};

const HistoryLoadingState = () => {
	return (
		<div className='flex flex-col items-center justify-center py-8 text-center'>
			<div className='mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/80 to-cyan-400/80 shadow-[0_8px_30px_rgba(16,185,129,0.25)] ring-1 ring-white/20'>
				<Icon
					icon='lucide:loader'
					className='h-4 w-4 animate-spin text-white'
				/>
			</div>
			<p className='text-white/60 text-xs'>Loading history...</p>
		</div>
	);
};

export const PlaylistsSection = ({
	selectedPlaylistId,
	setSelectedPlaylistId,
	currentPlaylist,
}: PlaylistsSectionProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	// Check authentication status
	const user = useQuery(api.auth.getCurrentUser);

	// Fetch saved playlists from Convex (only if authenticated)
	const savedPlaylists = useQuery(
		api.playlists.getPlaylists,
		user ? { limit: 10 } : 'skip',
	);

	const removeSongFromPlaylist = useMutation(
		api.playlists.removeSongFromPlaylist,
	);
	const deletePlaylist = useMutation(api.playlists.deletePlaylist);

	// Handle URL parameter for playlist sharing
	useEffect(() => {
		const playlistIdFromUrl = searchParams.get('playlistId');
		if (playlistIdFromUrl && playlistIdFromUrl !== selectedPlaylistId) {
			setSelectedPlaylistId(playlistIdFromUrl as Id<'playlists'>);
			router.replace('/');
		}
	}, [
		searchParams,
		selectedPlaylistId,
		setSelectedPlaylistId,
		router,
		pathname,
	]);

	// Share playlist function
	const sharePlaylist = useCallback(async (playlistId: Id<'playlists'>) => {
		const shareUrl = `${window.location.origin}?playlistId=${playlistId}`;
		await navigator.clipboard.writeText(shareUrl);
		toast.success('Playlist URL copied to clipboard!');
	}, []);

	// Fetch selected playlist data when ID is set (works for both user playlists and community playlists)
	const selectedPlaylist = useQuery(
		api.playlists.getPlaylist,
		selectedPlaylistId ? { playlistId: selectedPlaylistId } : 'skip',
	);

	// Determine what to display (prioritize selected playlist from history, fall back to current search)
	const displayData = selectedPlaylist || currentPlaylist;

	// Check if we're loading a selected playlist
	const isLoadingPlaylist =
		selectedPlaylistId && selectedPlaylist === undefined;

	const { onPlaySong } = usePlaySong({
		songs: displayData?.songs || [],
		songsIdentifier: selectedPlaylistId || '',
	});

	// Get player state for play/pause functionality
	const currentSong = usePlayerState((state) => state.currentSong);
	const isPlaying = usePlayerState((state) => state.isPlaying);
	const setIsPlaying = usePlayerState((state) => state.setIsPlaying);

	// Handle removing a song from playlist
	const handleRemoveSong = useCallback(
		async (song: { artist: string; title: string }, index: number) => {
			if (!selectedPlaylistId) return;

			try {
				await removeSongFromPlaylist({
					playlistId: selectedPlaylistId,
					songIndex: index,
				});

				// Also remove from player queue if it exists
				const removeFromQueue = usePlayerState.getState().removeFromQueue;
				removeFromQueue(song);

				toast.success('Song removed from playlist');
			} catch (error) {
				console.error('Error removing song:', error);
				toast.error('Failed to remove song from playlist');
			}
		},
		[selectedPlaylistId, removeSongFromPlaylist],
	);

	// Handle deleting a playlist
	const handleDeletePlaylist = useCallback(
		async (playlistId: Id<'playlists'>) => {
			try {
				await deletePlaylist({ playlistId });
				toast.success('Playlist deleted');
				// Clear selection if deleted playlist was selected
				if (selectedPlaylistId === playlistId) {
					setSelectedPlaylistId(null);
				}
			} catch (error) {
				console.error('Error deleting playlist:', error);
				toast.error('Failed to delete playlist');
			}
		},
		[deletePlaylist, selectedPlaylistId],
	);

	const renderHistory = () => {
		return (
			<>
				<AuthLoading>
					<div className='mt-[40%] p-4 pt-0'>
						<HistoryLoadingState />
					</div>
				</AuthLoading>
				<Unauthenticated>
					<div className='mt-[40%] flex flex-col items-center justify-center pb-4 text-center'>
						<div className='mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/80 to-cyan-400/80 shadow-[0_8px_30px_rgba(16,185,129,0.25)] ring-1 ring-white/20'>
							<Icon icon='lucide:log-in' className='h-6 w-6 text-white' />
						</div>
						<h4 className='mb-2 font-medium text-sm text-white'>
							Sign in to save playlists
						</h4>
						<p className='mb-4 text-white/60 text-xs'>
							Your created playlists will appear here
						</p>
						<Button variant='outline' size='sm' className='text-xs'>
							<Icon icon='lucide:log-in' className='h-3 w-3' />
							Sign in to save
						</Button>
					</div>
				</Unauthenticated>
				<Authenticated>
					<div className='p-4'>
						{savedPlaylists === undefined ? (
							<div className='flex flex-col items-center justify-center py-8 text-center'>
								<div className='mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/80 to-cyan-400/80 shadow-[0_8px_30px_rgba(16,185,129,0.25)] ring-1 ring-white/20'>
									<Icon
										icon='lucide:loader'
										className='h-4 w-4 animate-spin text-white'
									/>
								</div>
								<p className='text-white/60 text-xs'>Loading history...</p>
							</div>
						) : savedPlaylists.length > 0 ? (
							<motion.div
								variants={containerVariants}
								initial='hidden'
								animate='visible'
								className='space-y-1'
							>
								{savedPlaylists.map((playlist) => (
									<Button
										key={playlist._id}
										variant='playlistItem'
										className={`flex w-full items-center gap-2 rounded-lg transition-colors ${
											selectedPlaylistId === playlist._id
												? 'bg-white/10 ring-1 ring-emerald-400/50'
												: ''
										}`}
										onClick={() => setSelectedPlaylistId(playlist._id)}
										disabled={
											!!isLoadingPlaylist && selectedPlaylistId === playlist._id
										}
									>
										<div className='flex min-w-0 flex-1 flex-col gap-1'>
											<p className='truncate font-medium text-sm text-white'>
												{playlist.title}
											</p>
											<p className='text-white/50 text-xs'>
												{playlist.songs.length} tracks
											</p>
										</div>
										{isLoadingPlaylist &&
										selectedPlaylistId === playlist._id ? (
											<Icon
												icon='lucide:loader'
												className='h-3 w-3 animate-spin text-white/40'
											/>
										) : (
											<Icon
												icon='lucide:play'
												className='h-3 w-3 text-white/40'
											/>
										)}
									</Button>
								))}
							</motion.div>
						) : (
							<div className='flex h-full flex-col items-center justify-center pb-4 text-center'>
								<div className='mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/80 to-cyan-400/80 shadow-[0_8px_30px_rgba(16,185,129,0.25)] ring-1 ring-white/20'>
									<Icon icon='lucide:clock' className='h-6 w-6 text-white' />
								</div>
								<h4 className='mb-2 font-medium text-sm text-white'>
									No playlists yet
								</h4>
								<p className='mb-4 text-white/60 text-xs'>
									Your created playlists will appear here
								</p>
								<Button variant='outline' size='sm' className='text-xs'>
									<Icon icon='lucide:log-in' className='h-3 w-3' />
									Sign in to save
								</Button>
							</div>
						)}
					</div>
				</Authenticated>
			</>
		);
	};

	return (
		<section className='mt-6 mb-40 md:mb-36'>
			{/* Header */}
			<div className='mb-6'>
				<h2 className='font-medium text-white text-xl'>Playlists</h2>
			</div>

			{/* Main Content */}
			<div className='flex flex-col gap-6 lg:flex-row'>
				{/* Your Playlists Panel */}
				<div className='order-2 w-full lg:order-0 lg:w-64 lg:flex-shrink-0'>
					<div className='h-[50svh] overflow-y-auto rounded-2xl bg-white/5 shadow-[0_12px_40px_rgba(0,0,0,0.35)] ring-1 ring-white/10 backdrop-blur'>
						<div className='sticky top-0 z-10 bg-[#10141E] px-4 py-4'>
							<h3 className='font-medium text-white'>Your Playlists</h3>
						</div>
						{renderHistory()}
					</div>
				</div>

				{/* Main Playlist Content */}
				<div className='flex-1'>
					<div className='h-[50svh] overflow-y-auto rounded-2xl bg-white/5 px-6 shadow-[0_12px_40px_rgba(0,0,0,0.35)] ring-1 ring-white/10 backdrop-blur sm:px-8'>
						<AnimatePresence mode='wait'>
							{isLoadingPlaylist ? (
								<motion.div
									key='loading'
									variants={loadingVariants}
									initial='hidden'
									animate='visible'
									exit='exit'
									className='flex flex-col items-center justify-center py-16 text-center'
								>
									<div className='mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/80 to-cyan-400/80 shadow-[0_8px_30px_rgba(16,185,129,0.25)] ring-1 ring-white/20'>
										<Icon
											icon='lucide:loader'
											className='h-8 w-8 animate-spin text-white'
										/>
									</div>
									<h3
										className='mb-2 font-geist text-white text-xl tracking-tight'
										style={{ fontWeight: 600 }}
									>
										Loading playlist...
									</h3>
									<p className='font-geist text-white/70'>
										Fetching your saved playlist
									</p>
								</motion.div>
							) : displayData ? (
								<motion.div
									key='playlist'
									variants={containerVariants}
									initial='hidden'
									animate='visible'
									exit='exit'
								>
									{/* Playlist Header */}
									<div className='-mx-6 sm:-mx-8 sticky top-0 z-10 flex items-center justify-between bg-[#10141E] px-6 py-6 sm:px-8'>
										<div className='flex items-center gap-4'>
											<Button
												variant='gradient'
												size='gradient'
												onClick={() => {
													if (displayData.songs.length > 0) {
														// Check if any song from the current playlist is playing
														const isPlaylistPlaying = displayData.songs.some(
															(song) =>
																currentSong?.title === song.title &&
																currentSong?.artist === song.artist,
														);

														if (isPlaylistPlaying) {
															setIsPlaying(!isPlaying); // Pause
														} else {
															onPlaySong(displayData.songs[0]); // Play first song
														}
													}
												}}
											>
												<Icon
													icon={
														displayData.songs.some(
															(song) =>
																currentSong?.title === song.title &&
																currentSong?.artist === song.artist &&
																isPlaying,
														)
															? 'lucide:pause'
															: 'lucide:play'
													}
													className='h-6 w-6 text-white'
												/>
												{/* Live ring */}
												<span className='pointer-events-none absolute inset-0 rounded-full opacity-0 ring-4 ring-sky-400/30' />
											</Button>
											<div>
												<h3 className='font-medium text-lg text-white'>
													{displayData.title}
												</h3>
												<p className='text-sm text-white/60'>
													{displayData.songs.length} tracks •{' '}
													{selectedPlaylist
														? 'Saved playlist'
														: 'Generated playlist'}
												</p>
											</div>
										</div>
										<div className='flex items-center gap-2'>
											{selectedPlaylistId && (
												<>
													<Button
														variant='icon'
														size='icon'
														className='rounded-md bg-white/10 ring-1 ring-white/20 backdrop-blur hover:bg-white/20'
														onClick={() => sharePlaylist(selectedPlaylistId)}
													>
														<Icon
															icon='lucide:share-2'
															className='h-4 w-4 text-white'
														/>
													</Button>
													<Button
														variant='icon'
														size='icon'
														className='rounded-md bg-red-500/20 ring-1 ring-red-500/30 backdrop-blur hover:bg-red-500/30'
														onClick={() =>
															handleDeletePlaylist(selectedPlaylistId)
														}
													>
														<Icon
															icon='lucide:trash-2'
															className='h-4 w-4 text-red-400'
														/>
													</Button>
												</>
											)}
										</div>
									</div>

									{/* Song List */}
									<SongList
										songs={displayData.songs}
										onPlay={onPlaySong}
										onRemoveSong={handleRemoveSong}
									/>
								</motion.div>
							) : (
								<motion.div
									key='empty'
									variants={loadingVariants}
									initial='hidden'
									animate='visible'
									exit='exit'
									className='flex h-full flex-col items-center justify-center pb-4 text-center'
								>
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
										No playlist selected
									</h3>
									<p className='max-w-md font-geist text-white/70'>
										Select a playlist from your history or generate a new one
										with your AI DJ.
									</p>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>
			</div>

			<CommunityPlaylists onSelectPlaylist={setSelectedPlaylistId} />
		</section>
	);
};
