'use client';

import { Icon } from '@iconify/react';
import { Fragment, useCallback } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useShallow } from 'zustand/react/shallow';
import { RangeSlider } from '@/components/range-slider';
import { Button } from '@/components/ui/button';
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from '@/components/ui/hover-card';
import { TextAutoScroll } from '@/components/ui/text-auto-scroll';
import { useLocalSettings } from '@/store/use-local-settings';
import {
	usePlayerInstance,
	usePlayerProgressState,
	usePlayerState,
} from '@/store/use-player';
import { splitArtist } from '@/utils/song-title-utils';

const formatSeconds = (seconds: number) => {
	// format time and consider adding 0 if less than 10
	const minutes = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);

	return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

export const FooterPlayer = () => {
	const {
		isPlaying,
		setIsPlaying,
		currentSong,
		duration,
		playNext,
		playPrevious,
		isShuffled,
		setShuffle,
		volume,
		setVolume,
		toggleMute,
	} = usePlayerState();

	const { progress } = usePlayerProgressState();

	const { instance } = usePlayerInstance();

	const onSeek = useCallback(
		(e: number[]) => {
			instance.current?.seekTo(Number(e[0]) / 100, 'fraction');
		},
		[instance],
	);

	const onVolumeChange = useCallback(
		(e: number[]) => {
			const newVolume = Number(e[0]) / 100;
			setVolume(newVolume);
		},
		[setVolume],
	);

	const { queueIdentifier, repeatMode, setRepeatMode } = usePlayerState(
		useShallow((state) => ({
			queueIdentifier: state.queueIdentifier,
			repeatMode: state.repeatMode,
			setRepeatMode: state.setRepeatMode,
		})),
	);

	const toggleShuffledPlaylist = useLocalSettings(
		(state) => state.toggleShuffledPlaylist,
	);

	const onShuffleToggle = useCallback(() => {
		if (queueIdentifier) {
			toggleShuffledPlaylist(queueIdentifier);
		}

		setShuffle(!isShuffled);
	}, [isShuffled, queueIdentifier, setShuffle, toggleShuffledPlaylist]);

	useHotkeys(
		'space',
		(event) => {
			if (currentSong) {
				event.preventDefault();
				setIsPlaying(!isPlaying);
			}
		},
		{
			enableOnFormTags: false,
		},
	);

	return (
		<footer className='-translate-x-1/2 fixed bottom-4 left-1/2 z-40 max-w-[90%] bg-transparent'>
			<div className='relative mx-auto flex flex-col items-center gap-3 rounded border border-surface-700 bg-surface-400/20 px-3 py-2 text-white shadow-xl backdrop-blur-md md:flex-row md:gap-4 md:rounded-full md:px-6'>
				{/* Left: Album Art + Track Info */}
				<div className='flex items-center gap-3'>
					<div className='flex shrink-0 items-center'>
						{currentSong ? (
							<img
								src={currentSong.albumCoverUrl || '/cover-placeholder.png'}
								width={40}
								height={40}
								alt=''
								className='size-10 rounded-md object-cover'
							/>
						) : null}
					</div>
					<div className='flex w-36 min-w-0 flex-col justify-center'>
						<TextAutoScroll
							className='truncate font-medium text-gray-100 text-sm'
							text={currentSong?.title || ''}
						/>
						<div className='truncate text-xs text-zinc-300'>
							{splitArtist(currentSong?.artist || '').map(
								(artist, index, artists) => (
									<Fragment key={artist}>
										<span className='hover:underline'>{artist.trim()}</span>
										{index < artists.length - 1 ? ',\u00a0' : ''}
									</Fragment>
								),
							)}
						</div>
					</div>
				</div>

				<div className='flex flex-col flex-wrap-reverse justify-center gap-1 md:flex-row'>
					{/* Center: Progress Bar + Time */}
					<div className='flex w-full items-center gap-3 px-2 md:w-58 md:flex-1'>
						<RangeSlider
							max={100}
							min={0}
							disabled={!currentSong}
							value={progress.played * 100}
							onValueCommit={onSeek}
							className='min-w-28 flex-1'
							dragToChange={false}
							minLabel={formatSeconds(progress.playedSeconds)}
							maxLabel={formatSeconds(duration)}
						/>
					</div>
					{/* Right: Controls */}
					<div className='flex items-center gap-1 md:gap-2'>
						<Button
							variant='ghost'
							className='p-1'
							title='Shuffle'
							onClick={onShuffleToggle}
						>
							<Icon
								icon='mdi:shuffle'
								className={`size-6 ${isShuffled ? 'text-blue-400' : 'text-white/60'}`}
							/>
						</Button>
						<Button
							variant='ghost'
							className='p-1'
							disabled={!currentSong}
							title='Previous'
							onClick={() => {
								if (!currentSong) return;
								playPrevious();
							}}
						>
							<Icon icon='mdi:skip-previous' className='size-8' />
						</Button>
						<Button
							variant='ghost'
							className='p-1'
							disabled={!currentSong}
							title='Play/Pause'
							onClick={() => {
								if (!currentSong) return;
								setIsPlaying(!isPlaying);
							}}
						>
							{isPlaying ? (
								<Icon icon='mdi:pause' className='size-10 text-primary' />
							) : (
								<Icon icon='mdi:play' className='size-10' />
							)}
						</Button>
						<Button
							variant='ghost'
							className='p-1'
							title='Next'
							disabled={!currentSong}
							onClick={() => {
								if (!currentSong) return;
								playNext();
							}}
						>
							<Icon icon='mdi:skip-next' className='size-8' />
						</Button>
						<Button
							onClick={() => {
								setRepeatMode(
									repeatMode === 'none'
										? 'all'
										: repeatMode === 'all'
											? 'one'
											: 'none',
								);
							}}
							variant='ghost'
							title='Repeat'
							className='p-1'
						>
							{repeatMode === 'none' ? (
								<Icon icon='mdi:repeat' className='size-5 text-white/60' />
							) : repeatMode === 'all' ? (
								<Icon icon='mdi:repeat' className='size-5 text-blue-400' />
							) : (
								<Icon icon='mdi:repeat-one' className='size-5 text-blue-400' />
							)}
						</Button>

						{/* Volume Control */}
						<HoverCard openDelay={200} closeDelay={100}>
							<HoverCardTrigger asChild>
								<Button
									className='p-1'
									title='Volume'
									variant='ghost'
									onClick={toggleMute}
								>
									<Icon
										icon={
											volume === 0
												? 'mdi:volume-off'
												: volume < 0.3
													? 'mdi:volume-low'
													: volume < 0.7
														? 'mdi:volume-medium'
														: 'mdi:volume-high'
										}
										className='size-6 text-gray-200'
									/>
								</Button>
							</HoverCardTrigger>
							<HoverCardContent className='w-auto p-3' side='top'>
								<div className='flex flex-col items-center space-y-2'>
									<span className='text-gray-300 text-sm'>Volume</span>
									<RangeSlider
										max={100}
										min={0}
										value={volume * 100}
										onValueCommit={onVolumeChange}
										className='h-32 w-6'
										orientation='vertical'
										dragToChange={false}
									/>
									<span className='text-gray-400 text-xs'>
										{Math.round(volume * 100)}%
									</span>
								</div>
							</HoverCardContent>
						</HoverCard>
					</div>
				</div>
			</div>
		</footer>
	);
};
