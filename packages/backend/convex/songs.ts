import { v } from 'convex/values';
import { groupBy } from 'es-toolkit';
import { isEmpty } from 'es-toolkit/compat';
import { action, query } from './_generated/server';
import { invidious } from './_integrations/invidious/invidious';
import { lastFM } from './_integrations/lastfm/lastfm';

export function coalesce<T>(
	obj: { [key: string]: T | undefined },
	keys: string[],
	defaultValue: T,
): T {
	for (const key of keys) {
		if (obj[key] !== undefined) {
			return obj[key]!;
		}
	}
	return defaultValue;
}

const getLastFMCoverImage = (
	images: Array<{
		'#text': string;
		size: string;
	}>,
) => {
	const coverImages = groupBy(images, (item) => item.size);

	const imageSizes = ['extralarge', 'large', 'medium'];

	const defaultValue = [{ '#text': '' }];

	const [coverImage] = coalesce(coverImages, imageSizes, defaultValue);

	return coverImage?.['#text'];
};

export const album = query({
	args: {
		artist: v.string(),
		song: v.string(),
	},
	returns: v.object({
		artist: v.string(),
		coverUrl: v.string(),
		title: v.string(),
	}),
	handler: async (ctx, args) => {
		try {
			const { data } = await lastFM.getSong({
				artist: args.artist,
				track: args.song,
			});

			if (isEmpty(data?.track?.album)) {
				return {
					artist: args.artist ?? '',
					coverUrl: '',
					title: '',
				};
			}

			const coverImage = getLastFMCoverImage(data?.track?.album.image ?? []);

			return {
				artist: data?.track?.artist.name ?? '',
				coverUrl: coverImage,
				title: data?.track?.album.title ?? '',
			};
		} catch (error) {
			console.error('Error fetching album info:', error);
			return {
				artist: args.artist,
				coverUrl: '',
				title: '',
			};
		}
	},
});

export const videoInfo = action({
	args: {
		query: v.string(),
	},
	returns: v.array(
		v.object({
			title: v.string(),
			artist: v.string(),
			videoId: v.string(),
			videoUrl: v.string(),
			thumbnailUrl: v.string(),
		}),
	),
	handler: async (ctx, args) => {
		try {
			const { data } = await invidious.getVideos({
				query: args.query,
			});

			const video = data.map((video) => ({
				title: video.title,
				artist: video.author,
				videoId: video.videoId,
				videoUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
				thumbnailUrl:
					video.videoThumbnails.find((vt) => vt.quality === 'default')?.url ??
					'',
			}));

			if (isEmpty(video)) {
				throw new Error(`Video not found for query: ${args.query}`);
			}

			return video.slice(0, 5);
		} catch (error) {
			console.error('Error fetching video info:', error);
			throw error;
		}
	},
});
