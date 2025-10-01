import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
	todos: defineTable({
		text: v.string(),
		completed: v.boolean(),
	}),
	playlists: defineTable({
		userId: v.optional(v.string()), // Better Auth user ID - optional for backward compatibility
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
		copiedFrom: v.optional(v.id('playlists')), // Reference to original playlist if this is a copy
	})
		.index('by_created_at', ['createdAt'])
		.index('by_user_id', ['userId'])
		.index('by_user_id_and_created_at', ['userId', 'createdAt']),
});
