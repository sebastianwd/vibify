'use node';

import { openai } from '@ai-sdk/openai';
import { Agent } from '@convex-dev/agent';
import FirecrawlApp from '@mendable/firecrawl-js';
import { v } from 'convex/values';
import { api, components, internal } from './_generated/api';
import { action } from './_generated/server';
import { authComponent } from './auth';

// Types - using implicit typing and derived types
export type SearchResult = {
	extractResult: {
		data: {
			urls: string[];
		};
	};
	searchUrl: string;
};

type ScrapeResult = {
	scrapeResult: any;
	selectedUrl: string;
};

type SearchData = {
	allUrls: any;
	filteredUrls: string[];
	relevantUrls: string[];
	selectedUrl: string;
	scrapedContent: any;
	songs: Array<{ artist: string; title: string }>;
	playlistTitle: string;
	playlistId?: string;
};

export type SearchResponse = {
	success: boolean;
	data?: SearchData;
	originalQuery?: string;
	optimizedQuery?: string;
	searchUrl?: string;
	threadId?: string;
	error?: string;
};

// Initialize Firecrawl client
const firecrawl = new FirecrawlApp({
	apiKey: process.env.FIRECRAWL_API_KEY,
});

// Utility functions - implicit typing
const getSearchUrls = () => {
	if (!process.env.WEB_SEARCH_URLS) {
		throw new Error('WEB_SEARCH_URLS environment variable is not set');
	}
	return process.env.WEB_SEARCH_URLS.split(',').map((url) => url.trim());
};

const buildSearchUrl = (baseUrl: string, query: string) =>
	`${baseUrl}search?q=${encodeURIComponent(query)}&language=auto&time_range=&safesearch=0&categories=general`;

const filterSearchResultUrls = (urls: string[]) =>
	urls.filter(
		(url) => !url.includes('stackexchange') && !url.includes('stackoverflow'),
	);

const trySearchUrls = async (optimizedQuery: string): Promise<SearchResult> => {
	const searchUrls = getSearchUrls();
	const errors: Error[] = [];

	for (const [index, baseUrl] of searchUrls.entries()) {
		try {
			const searchUrl = buildSearchUrl(baseUrl, optimizedQuery);
			console.log(
				`Trying search URL ${index + 1}/${searchUrls.length}:`,
				searchUrl,
			);

			const extractResult = (await firecrawl.extract({
				urls: [searchUrl],
				prompt: 'Extract all urls',
			})) as { data: { urls: string[] } };

			console.log(`Success with URL ${index + 1}`);
			return { extractResult, searchUrl };
		} catch (error) {
			const err = error instanceof Error ? error : new Error(String(error));
			errors.push(err);
			console.error(`Failed with URL ${index + 1}:`, err.message);
		}
	}

	throw new Error(
		`All search URLs failed. Last error: ${errors[errors.length - 1]?.message}`,
	);
};

const tryScrapeUrls = async (urls: string[]): Promise<ScrapeResult> => {
	const errors: Error[] = [];

	for (const [index, url] of urls.entries()) {
		try {
			console.log(`Trying to scrape URL ${index + 1}/${urls.length}:`, url);
			const scrapeResult = await firecrawl.scrape(url, {
				formats: ['markdown'],
				onlyMainContent: true,
				removeBase64Images: true,
				storeInCache: true,
			});
			console.log(`Successfully scraped URL ${index + 1}`);
			return { scrapeResult, selectedUrl: url };
		} catch (error) {
			const err = error instanceof Error ? error : new Error(String(error));
			errors.push(err);
			console.error(`Failed to scrape URL ${index + 1}:`, err.message);
		}
	}

	throw new Error(
		`All URLs failed to scrape. Last error: ${errors[errors.length - 1]?.message}`,
	);
};

const extractSongsFromContent = async (
	thread: any,
	markdown: string,
	originalQuery?: string,
): Promise<{ songs: string[]; title: string }> => {
	const extractResult = await thread.generateText({
		prompt: `Extract songs from this text in the format "Artist - Song Title" and generate a creative playlist title. Be very strict - only return actual songs with both artist and song name, if you find album names, put them in the Song Title field. The title should be catchy, descriptive, and capture the mood/vibe of the playlist.

Text: ${markdown}
${originalQuery ? `Original request: ${originalQuery}` : ''}

Return as a JSON object with this exact format:
{
  "songs": ["Artist Name - Song Title", "Another Artist - Another Song"],
  "title": "Creative Playlist Title"
}`,
	});

	return JSON.parse(extractResult.text.trim());
};

// Create search optimization agent
const searchAgent = new Agent(components.agent, {
	name: 'Search Optimizer',
	languageModel: openai.chat('gpt-4o-mini'),
	instructions: `You are a query optimizer that takes casual, natural language music requests
and rewrites them into short, concise, search-friendly queries that work well
for finding music lists results.

Rules:
- Output only the rewritten query, no explanations.
- Make it sound like a music search query a user would type on Google.
- Keep it concise (5–10 words max).
- Include important mood, vibe, genre, or activity keywords.
- Remove polite words like "please", "can you", etc.
- If the user asks for a playlist, format the search query to not include the word "playlist".

Examples:
Input: "give me a chill playlist for study"
Output: "best songs for chill and study"

Input: "I want to hear upbeat pop for working out"
Output: "upbeat pop workout songs"

Input: "play relaxing lo-fi beats"
Output: "relaxing lo-fi beats songs"

Input: "make a 2000s throwback punk playlist"
Output: "2000s throwback punk songs"

Input: "create a hype playlist for running"
Output: "hype running songs"`,
});

// Main search function
export const searchGoogle = action({
	args: {
		query: v.string(),
	},
	handler: async (ctx, args): Promise<SearchResponse> => {
		try {
			// Validate environment variables
			if (!process.env.FIRECRAWL_API_KEY) {
				throw new Error('FIRECRAWL_API_KEY environment variable is not set');
			}
			if (!process.env.OPENAI_API_KEY) {
				throw new Error('OPENAI_API_KEY environment variable is not set');
			}

			const user = await authComponent.safeGetAuthUser(ctx);

			// Step 1: Optimize the search query using the agent
			const { threadId, thread } = await searchAgent.createThread(ctx);
			const optimizationResult = await thread.generateText({
				prompt: args.query,
			});

			const optimizedQuery = optimizationResult.text.trim();
			console.log(`Original query: "${args.query}"`);
			console.log(`Optimized query: "${optimizedQuery}"`);

			// Step 2: Try multiple search URLs with retry logic
			const { extractResult, searchUrl } = await trySearchUrls(optimizedQuery);

			console.log('Extract result:', extractResult);

			// Step 3: Filter out StackExchange URLs and get relevant URLs
			const allUrls = extractResult.data.urls;
			const filteredUrls = filterSearchResultUrls(allUrls);

			console.log('Filtered URLs (no StackExchange):', filteredUrls);

			const urlFilterResult = await thread.generateText({
				prompt: `Given the original user request "${args.query}" and these extracted URLs from search results, select the 4 most relevant URLs for finding music/playlists that are not from music streaming sites or reddit. Return only the URLs as a JSON array.
Extracted URLs: ${JSON.stringify(filteredUrls)}
Return format: ["url1", "url2", "url3", "url4"]`,
			});

			const relevantUrls = JSON.parse(urlFilterResult.text.trim());

			console.log('Relevant URLs:', relevantUrls);

			// Step 4: Try scraping each URL until one succeeds
			const { scrapeResult, selectedUrl } = await tryScrapeUrls(relevantUrls);

			console.log('Scrape result:', scrapeResult);

			// Step 5: Extract song names and generate title from scraped content using OpenAI
			const { songs: songNames, title: playlistTitle } =
				await extractSongsFromContent(
					thread,
					scrapeResult.markdown,
					args.query,
				);
			console.log('Extracted song names:', songNames);
			console.log('Generated playlist title:', playlistTitle);

			const uniqueSongNames = [...new Set(songNames)];

			// Check if we have less than 10 tracks and retry if needed
			if (uniqueSongNames.length < 10) {
				console.log(
					`Only found ${uniqueSongNames.length} tracks, retrying search...`,
				);

				// Try scraping the other relevant URLs to get more songs
				for (const url of relevantUrls) {
					if (url === selectedUrl) continue; // Skip the one we already used

					try {
						console.log(`Trying additional URL: ${url}`);
						const additionalScrapeResult = await firecrawl.scrape(url, {
							formats: ['markdown'],
							onlyMainContent: true,
						});

						const { songs: additionalSongNames } =
							await extractSongsFromContent(
								thread,
								additionalScrapeResult.markdown || '',
								args.query,
							);
						console.log(
							`Additional songs found: ${additionalSongNames.length}`,
						);

						// Combine songs and remove duplicates
						const combinedSongStrings = [
							...new Set([...uniqueSongNames, ...additionalSongNames]),
						];

						// Transform to structured format
						const combinedSongs = combinedSongStrings.map((songString) => {
							const [artist, title] = songString.includes(' - ')
								? songString.split(' - ', 2)
								: ['Unknown Artist', songString];
							return {
								artist: artist.trim(),
								title: title.trim(),
							};
						});

						console.log(`Total unique songs: ${combinedSongs.length}`);

						if (combinedSongs.length >= 1) {
							// Generate new title for combined songs

							return {
								success: true,
								data: {
									allUrls: extractResult.data,
									filteredUrls,
									relevantUrls,
									selectedUrl: url, // Update to the URL that gave us more results
									scrapedContent: additionalScrapeResult,
									songs: combinedSongs,
									playlistTitle,
								},
								originalQuery: args.query,
								optimizedQuery,
								searchUrl,
								threadId,
							};
						}
					} catch (error) {
						console.error(`Failed to scrape additional URL ${url}:`, error);
					}
				}
			}

			// Parse songs into structured format for saving
			const structuredSongs = uniqueSongNames.map((songName) => {
				const [artist, songTitle] = songName.includes(' - ')
					? songName.split(' - ', 2)
					: ['Unknown Artist', songName];

				return {
					artist: artist.trim(),
					title: songTitle.trim(),
				};
			});

			console.log('Structured user?._id:', user?._id);
			let playlistId: string | undefined;
			if (user?._id) {
				// Save playlist immediately to get the ID
				playlistId = await ctx.runMutation(api.playlists.savePlaylist, {
					userId: user._id,
					title: playlistTitle,
					songs: structuredSongs,
					searchQuery: optimizedQuery,
					sourceUrl: selectedUrl,
				});
			}

			return {
				success: true,
				data: {
					allUrls: extractResult.data,
					filteredUrls,
					relevantUrls,
					selectedUrl,
					scrapedContent: scrapeResult,
					songs: structuredSongs,
					playlistTitle,
					playlistId,
				},
				originalQuery: args.query,
				optimizedQuery,
				searchUrl,
				threadId,
			};
		} catch (error) {
			console.error('Search error:', error);
			return {
				success: false,
				error:
					error instanceof Error ? error.message : 'Unknown error occurred',
				originalQuery: args.query,
			};
		}
	},
});
