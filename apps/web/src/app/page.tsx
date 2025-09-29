'use client';
import { api } from '@my-better-t-app/backend/convex/_generated/api';
import type { SearchResponse } from '@my-better-t-app/backend/convex/search';
import { useQuery } from 'convex/react';
import { useState } from 'react';
import DjSection from '@/components/dj-section';
import { PlaylistsSection } from '@/components/playlists-section';

export default function Home() {
	const healthCheck = useQuery(api.healthCheck.get);
	const [searchResults, setSearchResults] = useState<SearchResponse | null>(
		null,
	);

	const handleSearchResults = (results: SearchResponse | null) => {
		setSearchResults(results);
	};

	return (
		<>
			<div
				className='-z-10 fixed inset-0'
				style={{
					backgroundImage:
						'radial-gradient(1200px 600px at 10% -10%, rgba(99,102,241,0.12), rgba(0,0,0,0)), radial-gradient(1200px 600px at 90% -10%, rgba(56,189,248,0.10), rgba(0,0,0,0))',
				}}
			/>
			<DjSection setDj={() => {}} onSearchResults={handleSearchResults} />
			<PlaylistsSection searchResults={searchResults} />
		</>
	);
}
