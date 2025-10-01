import { Icon } from '@iconify/react';
import { motion } from 'motion/react';
import { usePlaySong } from '@/hooks/use-play-song';
import { containerVariants, itemVariants } from '@/lib/animations';
import { usePlayerState } from '@/store/use-player';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface Song {
	artist: string;
	title: string;
}

interface SongListProps {
	songs: Song[];
	onPlay?: (song: Song, index: number) => void;
	onMoreOptions?: (song: Song, index: number) => void;
	onRemoveSong?: (song: Song, index: number) => void;
}

export function SongList({
	songs,
	onPlay,
	onMoreOptions,
	onRemoveSong,
}: SongListProps) {
	const currentSong = usePlayerState((state) => state.currentSong);
	const isPlaying = usePlayerState((state) => state.isPlaying);
	const setIsPlaying = usePlayerState((state) => state.setIsPlaying);
	const loadingSongId = usePlayerState((state) => state.loadingSongId);

	return (
		<motion.div
			variants={containerVariants}
			initial='hidden'
			animate='visible'
			className='space-y-1'
		>
			{songs.map((song, index) => {
				const isCurrentSong =
					currentSong?.title === song.title &&
					currentSong.artist === song.artist;
				const isCurrentlyPlaying = isCurrentSong && isPlaying;
				const songId = `${song.artist}-${song.title}`;
				const isCurrentlyLoading = loadingSongId === songId;

				return (
					<motion.div
						key={`${song.artist}-${song.title}-${index}`}
						variants={itemVariants}
						className={`group flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-white/5 ${
							isCurrentSong ? 'bg-white/10' : ''
						}`}
					>
						{/* Play icon */}
						<Button
							variant='icon'
							size='icon'
							disabled={isCurrentlyLoading}
							onClick={() => {
								if (isCurrentlyPlaying) {
									setIsPlaying(false);
								} else {
									onPlay?.(song, index);
								}
							}}
						>
							<Icon
								icon={
									isCurrentlyLoading
										? 'lucide:loader-2'
										: isCurrentlyPlaying
											? 'lucide:pause'
											: 'lucide:play'
								}
								className={`h-4 w-4 ${isCurrentlyLoading ? 'animate-spin' : ''}`}
							/>
						</Button>

						{/* Track number */}
						<span className='w-4 text-sm text-white/40'>{index + 1}</span>

						{/* Track info */}
						<div className='min-w-0 flex-1'>
							<p
								className={`truncate font-medium text-sm ${
									isCurrentSong ? 'text-white' : 'text-white'
								}`}
							>
								{song.title}
							</p>
							<p
								className={`text-xs ${
									isCurrentSong ? 'text-white/70' : 'text-white/50'
								}`}
							>
								{song.artist}
							</p>
						</div>

						{/* More options */}
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant='icon'
									size='icon'
									className='opacity-0 transition-opacity group-hover:opacity-100'
								>
									<Icon icon='lucide:more-horizontal' className='h-4 w-4' />
								</Button>
							</PopoverTrigger>
							<PopoverContent
								className='w-56 border-white/10 bg-[#1a1a1a] p-2'
								align='end'
								side='bottom'
							>
								<div className='space-y-1'>
									{onRemoveSong && (
										<Button
											variant='ghost'
											size='sm'
											className='w-full justify-start text-red-400 text-sm hover:bg-red-500/10 hover:text-red-300'
											onClick={() => {
												onRemoveSong(song, index);
											}}
										>
											<Icon
												icon='lucide:trash-2'
												className='mr-2 h-4 w-4 flex-shrink-0'
											/>
											<span className='truncate'>Remove from playlist</span>
										</Button>
									)}
									{onMoreOptions && (
										<Button
											variant='ghost'
											size='sm'
											className='w-full justify-start text-sm text-white/70 hover:bg-white/10 hover:text-white'
											onClick={() => onMoreOptions(song, index)}
										>
											<Icon
												icon='lucide:more-horizontal'
												className='mr-2 h-4 w-4 flex-shrink-0'
											/>
											<span className='truncate'>More options</span>
										</Button>
									)}
								</div>
							</PopoverContent>
						</Popover>
					</motion.div>
				);
			})}
		</motion.div>
	);
}
