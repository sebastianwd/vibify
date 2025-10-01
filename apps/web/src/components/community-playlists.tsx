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
import { useCallback } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

// Generate deterministic colors for gradient backgrounds based on playlist ID
const generatePlaylistGradient = (playlistId: string) => {
	const colors = [
		'#ff6b6b',
		'#4ecdc4',
		'#45b7d1',
		'#96ceb4',
		'#feca57',
		'#ff9ff3',
		'#54a0ff',
		'#5f27cd',
		'#00d2d3',
		'#ff9f43',
		'#10ac84',
		'#ee5a24',
		'#0984e3',
		'#6c5ce7',
		'#a29bfe',
		'#fd79a8',
		'#fdcb6e',
		'#e17055',
		'#81ecec',
		'#74b9ff',
		'#a29bfe',
		'#fd79a8',
		'#fdcb6e',
		'#e17055',
		'#81ecec',
	];

	// Create a simple hash from the playlist ID
	let hash = 0;
	for (let i = 0; i < playlistId.length; i++) {
		const char = playlistId.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32-bit integer
	}

	// Use hash to generate deterministic values
	const color1 = colors[Math.abs(hash) % colors.length];
	const color2 = colors[Math.abs(hash * 2) % colors.length];
	const color3 = colors[Math.abs(hash * 3) % colors.length];
	const angle = Math.abs(hash) % 360;

	return `linear-gradient(${angle}deg, ${color1}, ${color2}, ${color3})`;
};

interface CommunityPlaylistsProps {
	onSelectPlaylist: (playlistId: Id<'playlists'>) => void;
}

export const CommunityPlaylists = ({
	onSelectPlaylist,
}: CommunityPlaylistsProps) => {
	// Fetch all public playlists for community section
	const communityPlaylists = useQuery(api.playlists.getAllPlaylists, {
		limit: 20,
	});

	// Mutation to copy a playlist to user's collection
	const copyPlaylist = useMutation(api.playlists.copyPlaylist);

	// Share playlist function
	const sharePlaylist = useCallback(async (playlistId: Id<'playlists'>) => {
		const shareUrl = `${window.location.origin}?playlistId=${playlistId}`;
		await navigator.clipboard.writeText(shareUrl);
		toast.success('Playlist URL copied to clipboard!');
	}, []);

	const renderContent = () => {
		return communityPlaylists === undefined ? (
			<div className='flex flex-col items-center justify-center py-8 text-center'>
				<div className='mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/80 to-cyan-400/80 shadow-[0_8px_30px_rgba(16,185,129,0.25)] ring-1 ring-white/20'>
					<Icon
						icon='lucide:loader'
						className='h-4 w-4 animate-spin text-white'
					/>
				</div>
				<p className='text-white/60 text-xs'>Loading community...</p>
			</div>
		) : communityPlaylists.length > 0 ? (
			<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
				{communityPlaylists.map((playlist) => (
					<div
						key={playlist._id}
						className='group overflow-hidden rounded-xl bg-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.35)] ring-1 ring-white/10 backdrop-blur transition-all hover:bg-white/10 hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)]'
					>
						<div className='relative aspect-video overflow-hidden'>
							<div
								className='h-full w-full transition-transform duration-500 group-hover:scale-105'
								style={{
									background: generatePlaylistGradient(playlist._id),
								}}
							/>
							<div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80' />
							<div className='absolute right-2 bottom-2 left-2 flex items-center justify-between'>
								<div className='flex items-center gap-1.5'>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant='icon'
												size='icon'
												className='rounded-md bg-white/10 ring-1 ring-white/20 backdrop-blur hover:bg-white/20'
												onClick={() => onSelectPlaylist(playlist._id)}
											>
												<Icon
													icon='lucide:play'
													className='h-4 w-4 text-white'
												/>
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>View playlist</p>
										</TooltipContent>
									</Tooltip>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant='icon'
												size='icon'
												className='rounded-md bg-white/10 ring-1 ring-white/20 backdrop-blur hover:bg-white/20'
												onClick={() => sharePlaylist(playlist._id)}
											>
												<Icon
													icon='lucide:share-2'
													className='h-4 w-4 text-white'
												/>
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>Share playlist</p>
										</TooltipContent>
									</Tooltip>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant='icon'
												size='icon'
												className='rounded-md bg-white/10 ring-1 ring-white/20 backdrop-blur hover:bg-white/20'
												onClick={async () => {
													try {
														await copyPlaylist({
															playlistId: playlist._id,
														});
														toast.success(
															'Playlist copied to your collection!',
														);
													} catch (error) {
														console.error('Failed to copy playlist:', error);
														toast.error('Failed to copy playlist');
													}
												}}
											>
												<Icon
													icon='lucide:plus'
													className='h-4 w-4 text-white'
												/>
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>Add to my playlists</p>
										</TooltipContent>
									</Tooltip>
								</div>
							</div>
						</div>
						<div className='p-3'>
							<p
								className='truncate font-geist text-white tracking-tight'
								style={{ fontWeight: 600 }}
							>
								{playlist.title}
							</p>
							<p className='font-geist text-sm text-white/60'>
								{playlist.songs.length} tracks
							</p>
						</div>
					</div>
				))}
			</div>
		) : (
			<div className='flex h-full flex-col items-center justify-center pb-4 text-center'>
				<div className='mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/80 to-cyan-400/80 shadow-[0_8px_30px_rgba(16,185,129,0.25)] ring-1 ring-white/20'>
					<Icon icon='lucide:users' className='h-6 w-6 text-white' />
				</div>
				<h4 className='mb-2 font-medium text-sm text-white'>
					No community playlists yet
				</h4>
				<p className='mb-4 text-white/60 text-xs'>
					Be the first to create a playlist!
				</p>
			</div>
		);
	};

	return (
		<div className='mt-8'>
			<h3 className='mb-4 font-medium text-lg text-white'>
				Community Playlists
			</h3>
			<AuthLoading>
				<div className='flex flex-col items-center justify-center py-8 text-center'>
					<div className='mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/80 to-cyan-400/80 shadow-[0_8px_30px_rgba(16,185,129,0.25)] ring-1 ring-white/20'>
						<Icon
							icon='lucide:loader'
							className='h-4 w-4 animate-spin text-white'
						/>
					</div>
					<p className='text-white/60 text-xs'>Loading community...</p>
				</div>
			</AuthLoading>
			<Authenticated>{renderContent()}</Authenticated>
			<Unauthenticated>{renderContent()}</Unauthenticated>
		</div>
	);
};
