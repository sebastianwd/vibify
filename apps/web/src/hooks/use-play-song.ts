import { api } from '@my-better-t-app/backend/convex/_generated/api';
import { head } from 'es-toolkit';
import { isNil } from 'es-toolkit/compat';
import { useCallback } from 'react';
import { convex } from '@/components/providers';
import { useLocalSettings } from '@/store/use-local-settings';
import { usePlayerState } from '@/store/use-player';
import type { PlayableSong } from '@/types';
import { getMainArtist } from '@/utils/song-title-utils';

interface UsePlaySongOptions {
	songs: PlayableSong[];
	songsIdentifier: string;
}

export const usePlaySong = (options: UsePlaySongOptions) => {
	const { songs, songsIdentifier: identifier } = options;

	const isShuffled = useLocalSettings((state) =>
		state.shuffledPlaylists.includes(identifier || ''),
	);

	const setQueueIdentifier = usePlayerState(
		(state) => state.setQueueIdentifier,
	);
	const setShuffle = usePlayerState((state) => state.setShuffle);

	const { setIsPlaying, setCurrentSong, setQueue, setLoadingSongId } =
		usePlayerState();

	const onPlaySong = useCallback(
		async (song: PlayableSong) => {
			const { artist, title, songUrl } = song;
			const songId = `${artist}-${title}`;

			// Set loading state for this specific song
			setLoadingSongId(songId);

			try {
				if (identifier) {
					if (!isNil(isShuffled)) {
						setShuffle(isShuffled);
					}
					setQueueIdentifier(identifier || '');
				}

				if (!songUrl) {
					const videoSearchQuery = `${getMainArtist(artist)} - ${title}`;

					const data = await convex.action(api.songs.videoInfo, {
						query: videoSearchQuery,
					});

					const urls = data.map((video) => video.videoUrl);

					await setCurrentSong({
						artist,
						title,
						urls,
						videoThumbnailUrl: head(data)?.thumbnailUrl,
						albumCoverUrl: song.albumCoverUrl || undefined,
					});
				} else {
					await setCurrentSong({
						artist,
						title,
						urls: [songUrl],
					});
				}

				if (identifier) {
					setQueue(
						songs.map((song) => ({
							artist: song.artist,
							title: song.title,
							urls: song.songUrl ? [song.songUrl] : undefined,
						})),
					);
				}

				setIsPlaying(true);
			} catch (error) {
				console.error('Error playing song:', error);
			}
			setLoadingSongId(null);
		},
		[
			identifier,
			isShuffled,
			setCurrentSong,
			setIsPlaying,
			setLoadingSongId,
			setQueue,
			setQueueIdentifier,
			setShuffle,
			songs,
		],
	);

	return {
		onPlaySong,
	};
};
