'use client';

import { invidiousUrls } from '@my-better-t-app/backend/convex/_integrations/invidious/invidious';
import { sample } from 'es-toolkit';
import { isEmpty } from 'es-toolkit/compat';
import dynamic from 'next/dynamic';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type ReactPlayer from 'react-player';
import {
	usePlayerInstance,
	usePlayerProgressState,
	usePlayerState,
} from '@/store/use-player';
import { ytGetId } from '@/utils/yt-get-id';

const DynamicReactPlayer = dynamic(() => import('react-player/lazy'), {
	ssr: false,
});

const VideoPlayer = memo(() => {
	const {
		isPlaying,
		setIsPlaying,
		currentSong,
		setDuration,
		playNext,
		volume,
	} = usePlayerState();

	const { instance } = usePlayerInstance();

	const playedProgress = usePlayerProgressState(
		(state) => state.progress.played,
	);

	const setPlayerProgress = usePlayerProgressState(
		(state) => state.setProgress,
	);

	const [videoChoice, setVideoChoice] = useState(0);

	const onPlayerPlay = useCallback(() => {
		if (!currentSong) {
			return;
		}

		setIsPlaying(true);
	}, [currentSong, setIsPlaying]);

	const onPlayerEnd = useCallback(() => {
		playNext({ isUserAction: false });
	}, [playNext]);

	const onPlayerPause = useCallback(() => {
		setIsPlaying(false);
	}, [setIsPlaying]);

	const updatePlayerProgress = useCallback(
		(node: Omit<ReactPlayer, 'refs'>) => {
			if (playedProgress !== 0) {
				node.seekTo(playedProgress, 'fraction');
			}
		},
		[playedProgress],
	);

	const url = useMemo(() => {
		if (isEmpty(currentSong?.urls)) return undefined;

		const isSoundCloud =
			currentSong?.urls?.length === 1 &&
			currentSong.urls[0]?.includes('soundcloud.com');

		if (isSoundCloud) {
			return currentSong.urls![0];
		}

		const videoUrl = currentSong?.urls?.[videoChoice];

		const isVideoUrlBlocked = !videoUrl;

		if (isVideoUrlBlocked) {
			return `${sample(invidiousUrls)}/latest_version?id=${ytGetId(currentSong?.urls?.[0] ?? '')?.id}&itag=18`;
		}

		return videoUrl;
	}, [currentSong?.urls, videoChoice]);

	useEffect(() => {
		setVideoChoice(0);
	}, [currentSong?.title, currentSong?.artist]);

	const resetProgressRef = useRef(false);
	const previousUrlRef = useRef(url);
	useEffect(() => {
		if (resetProgressRef.current || previousUrlRef.current === url) {
			return;
		}
		resetProgressRef.current = true;
		previousUrlRef.current = url;
	}, [url, setPlayerProgress]);

	const onPlayerProgress = useCallback(
		(options: { playedSeconds: number; played: number }) => {
			if (resetProgressRef.current) {
				return;
			}
			setPlayerProgress({
				playedSeconds: options.playedSeconds,
				played: options.played,
			});
		},
		[setPlayerProgress],
	);

	// Only render when there's a current song
	if (!currentSong) {
		return null;
	}

	return (
		<div className='relative aspect-video w-full overflow-hidden rounded-lg border border-white/10 bg-black/20 backdrop-blur-sm'>
			<DynamicReactPlayer
				width='100%'
				height='100%'
				playing={isPlaying}
				url={url}
				controls
				volume={volume}
				onPlay={onPlayerPlay}
				onPause={onPlayerPause}
				onEnded={onPlayerEnd}
				stopOnUnmount={false}
				progressInterval={500}
				onProgress={onPlayerProgress}
				onError={async (error) => {
					console.log(error);
					// Fallback to next video choice
					if (error) {
						setVideoChoice((prev) => prev + 1);
					}
				}}
				onDuration={(duration) => {
					if (!currentSong) {
						return;
					}
					setDuration(duration);
				}}
				onReady={(node: Omit<ReactPlayer, 'refs'>) => {
					// @ts-expect-error - hide from redux devtools for performance
					node.toJSON = () => ({ hidden: 'to help redux devtools :)' });

					instance.current = node;

					if (resetProgressRef.current) {
						setPlayerProgress({
							playedSeconds: 0,
							played: 0,
						});
						resetProgressRef.current = false;
						return;
					}

					// handles theater mode switching
					updatePlayerProgress(instance.current);
				}}
			/>
		</div>
	);
});

VideoPlayer.displayName = 'VideoPlayer';

export { VideoPlayer };
