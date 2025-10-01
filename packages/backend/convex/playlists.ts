import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { authComponent } from './auth';

export const savePlaylist = mutation({
	args: {
		userId: v.string(), // User ID passed from scheduler
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
			userId: args.userId,
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
			userId: v.optional(v.string()),
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
			copiedFrom: v.optional(v.id('playlists')),
		}),
	),
	handler: async (ctx, args) => {
		// Check if user is authenticated
		const user = await authComponent.safeGetAuthUser(ctx);
		if (!user) {
			throw new Error('User must be authenticated to access playlists');
		}

		const limit = args.limit || 50;

		const playlists = await ctx.db
			.query('playlists')
			.filter((q) => q.eq(q.field('userId'), user._id))
			.order('desc')
			.take(limit);

		return playlists;
	},
});

export const getAllPlaylists = query({
	args: {
		limit: v.optional(v.number()),
	},
	returns: v.array(
		v.object({
			_id: v.id('playlists'),
			_creationTime: v.number(),
			userId: v.optional(v.string()),
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
			copiedFrom: v.optional(v.id('playlists')),
		}),
	),
	handler: async (ctx, args) => {
		const limit = args.limit || 50;

		// Get current user (if authenticated)
		const user = await authComponent.safeGetAuthUser(ctx);

		// Get all public playlists, excluding copied ones and user's own playlists
		let query = ctx.db
			.query('playlists')
			.filter((q) => q.eq(q.field('copiedFrom'), undefined));

		// If user is authenticated, exclude their own playlists
		if (user) {
			query = query.filter((q) => q.neq(q.field('userId'), user._id));
		}

		const playlists = await query.order('desc').take(limit);

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
			userId: v.optional(v.string()),
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
			copiedFrom: v.optional(v.id('playlists')),
		}),
		v.null(),
	),
	handler: async (ctx, args) => {
		const playlist = await ctx.db.get(args.playlistId);
		if (!playlist) {
			return null;
		}

		// All playlists are public by default
		return playlist;
	},
});

export const copyPlaylist = mutation({
	args: {
		playlistId: v.id('playlists'),
	},
	returns: v.id('playlists'),
	handler: async (ctx, args) => {
		// Check if user is authenticated
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error('User must be authenticated to copy playlists');
		}

		const originalPlaylist = await ctx.db.get(args.playlistId);
		if (!originalPlaylist) {
			throw new Error('Playlist not found');
		}

		// Create a copy of the playlist for the user
		const copiedPlaylistId = await ctx.db.insert('playlists', {
			userId: user._id,
			title: `${originalPlaylist.title} (Copy)`,
			songs: originalPlaylist.songs,
			searchQuery: originalPlaylist.searchQuery,
			sourceUrl: originalPlaylist.sourceUrl,
			createdAt: Date.now(),
			copiedFrom: args.playlistId, // Reference to the original playlist
		});

		return copiedPlaylistId;
	},
});

export const removeSongFromPlaylist = mutation({
	args: {
		playlistId: v.id('playlists'),
		songIndex: v.number(),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		// Check if user is authenticated
		const user = await authComponent.safeGetAuthUser(ctx);
		if (!user) {
			throw new Error('User must be authenticated to modify playlists');
		}

		const playlist = await ctx.db.get(args.playlistId);

		// Ensure the playlist belongs to the authenticated user
		if (!playlist || playlist.userId !== user._id) {
			throw new Error('Playlist not found or access denied');
		}

		// Check if song index is valid
		if (args.songIndex < 0 || args.songIndex >= playlist.songs.length) {
			throw new Error('Invalid song index');
		}

		// Remove the song at the specified index
		const updatedSongs = playlist.songs.filter(
			(_, index) => index !== args.songIndex,
		);

		// Update the playlist with the new songs array
		await ctx.db.patch(args.playlistId, {
			songs: updatedSongs,
		});

		return null;
	},
});

export const deletePlaylist = mutation({
	args: {
		playlistId: v.id('playlists'),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		// Check if user is authenticated
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error('User must be authenticated to delete playlists');
		}

		const playlist = await ctx.db.get(args.playlistId);

		// Ensure the playlist belongs to the authenticated user
		if (!playlist || playlist.userId !== user._id) {
			throw new Error('Playlist not found or access denied');
		}

		await ctx.db.delete(args.playlistId);
		return null;
	},
});
