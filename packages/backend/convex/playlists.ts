import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const savePlaylist = mutation({
	args: {
		title: v.string(),
		songs: v.array(
			v.object({
				artist: v.string(),
				title: v.string(),
			}),
		),
		searchQuery: v.string(),
		sourceUrl: v.optional(v.string()),
	},
	returns: v.id('playlists'),
	handler: async (ctx, args) => {
		const playlistId = await ctx.db.insert('playlists', {
			title: args.title,
			songs: args.songs,
			searchQuery: args.searchQuery,
			sourceUrl: args.sourceUrl,
			createdAt: Date.now(),
		});

		return playlistId;
	},
});

export const getPlaylists = query({
	args: {
		limit: v.optional(v.number()),
	},
	returns: v.array(
		v.object({
			_id: v.id('playlists'),
			_creationTime: v.number(),
			title: v.string(),
			songs: v.array(
				v.object({
					artist: v.string(),
					title: v.string(),
				}),
			),
			searchQuery: v.string(),
			sourceUrl: v.optional(v.string()),
			createdAt: v.number(),
		}),
	),
	handler: async (ctx, args) => {
		const limit = args.limit || 50;

		const playlists = await ctx.db
			.query('playlists')
			.withIndex('by_created_at')
			.order('desc')
			.take(limit);

		return playlists;
	},
});

export const getPlaylist = query({
	args: {
		playlistId: v.id('playlists'),
	},
	returns: v.union(
		v.object({
			_id: v.id('playlists'),
			_creationTime: v.number(),
			title: v.string(),
			songs: v.array(
				v.object({
					artist: v.string(),
					title: v.string(),
				}),
			),
			searchQuery: v.string(),
			sourceUrl: v.optional(v.string()),
			createdAt: v.number(),
		}),
		v.null(),
	),
	handler: async (ctx, args) => {
		const playlist = await ctx.db.get(args.playlistId);
		return playlist;
	},
});

export const deletePlaylist = mutation({
	args: {
		playlistId: v.id('playlists'),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		await ctx.db.delete(args.playlistId);
		return null;
	},
});
