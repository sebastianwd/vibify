import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
	todos: defineTable({
		text: v.string(),
		completed: v.boolean(),
	}),
	playlists: defineTable({
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
	}).index('by_created_at', ['createdAt']),
});
