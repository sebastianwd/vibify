'use client';
import { Icon } from '@iconify/react';
import { api } from '@my-better-t-app/backend/convex/_generated/api';
import type { Id } from '@my-better-t-app/backend/convex/_generated/dataModel';
import type { SearchResponse } from '@my-better-t-app/backend/convex/search';
import { useQuery } from 'convex/react';
import { Suspense, useState } from 'react';
import DjSection from '@/components/dj-section';
import { PlaylistsSection } from '@/components/playlists-section';
import { VideoPlayer } from '@/components/video-player';

export default function Home() {
	const healthCheck = useQuery(api.healthCheck.get);
	const [searchResults, setSearchResults] = useState<SearchResponse | null>(
		null,
	);
	const [selectedPlaylistId, setSelectedPlaylistId] =
		useState<Id<'playlists'> | null>(null);

	const handleSearchResults = (results: SearchResponse | null) => {
		setSearchResults(results);
		// If search was successful and created a playlist, select it
		if (results?.success && results.data?.playlistId) {
			setSelectedPlaylistId(results.data.playlistId as Id<'playlists'>);
		} else {
			setSelectedPlaylistId(null); // Clear selected playlist when search is performed
		}
	};

	// Get current playlist to display
	const currentPlaylist =
		searchResults?.success && searchResults.data
			? {
					title:
						searchResults.data.playlistTitle ||
						searchResults.originalQuery ||
						'',
					songs: searchResults.data.songs,
				}
			: null;

	return (
		<>
			<div
				className='-z-10 fixed inset-0'
				style={{
					backgroundImage:
						'radial-gradient(1200px 600px at 10% -10%, rgba(99,102,241,0.12), rgba(0,0,0,0)), radial-gradient(1200px 600px at 90% -10%, rgba(56,189,248,0.10), rgba(0,0,0,0))',
				}}
			/>
			<div className='flex flex-col gap-8 md:flex-row'>
				<div className='flex-1'>
					<DjSection setDj={() => {}} onSearchResults={handleSearchResults} />
				</div>
				<div className='my-auto flex basis-1/3 items-center justify-center md:pt-16'>
					<VideoPlayer />
				</div>
			</div>
			<Suspense>
				<PlaylistsSection
					selectedPlaylistId={selectedPlaylistId}
					setSelectedPlaylistId={setSelectedPlaylistId}
					currentPlaylist={currentPlaylist}
				/>
			</Suspense>
		</>
	);
}
