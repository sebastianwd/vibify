# Vibify

Vibify combines AI assistance with music discovery, allowing you to find and enjoy music through playlist generation and community sharing.

## Features

### AI-Powered Music Discovery

- **Voice Search**: Talk to your AI DJ to find music based on mood, genre, or preferences
- **Smart Playlists**: Automatically generated playlists based on your search queries

### Music Player

- **YouTube Integration**: Stream music directly from YouTube
- **Full Playback Controls**: Play, pause, skip, shuffle, and repeat modes
- **Queue Management**: Build and manage your listening queue

### Playlist Management

- **Create & Save**: Build custom playlists from your searches
- **Your Playlists**: Access all your saved playlists in one place
- **Share Playlists**: Share your playlists with others via URL

### Community Features

- **Community Playlists**: Discover playlists created by other users
- **Copy Playlists**: Add community playlists to your own collection

## Tech Stack

### Frontend

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations and transitions
- **Zustand**: Lightweight state management

### Backend

- **Vapi**: Voice AI agents
- **Convex**: Real-time backend-as-a-service
- **Better Auth**: Secure authentication system
- **AI SDK**
- **Last.fm API**: Album artwork and metadata
- **Invidious API**: YouTube video information

## Development

### Prerequisites

- Node.js 22+
- pnpm 10+
- Convex account ([convex.dev](https://convex.dev))
- OpenAI API key
- Last.fm API key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/sebastianwd/vibify.git
   cd vibify
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   pnpm dev:setup
   ```

   `.env.local` in `apps/web/`

   `.env.local` in `packages/backend/convex/`

4. **Start the development server**

   ```bash
   pnpm dev
   ```

   The app will be available at:

   - http://localhost:3001

## Usage

### Creating Your First Playlist

1. **Sign Up/Sign In**: Create an account or sign in to get started
2. **Talk to the AI**: Click the voice search button and describe what you want to listen to
   - Example: "Give me energetic workout music"
3. **Review Results**: The AI will generate a playlist based on your request
4. **Save & Play**: Save the playlist to your collection and start listening!

### Managing Playlists

- **View Playlists**: Click on any playlist in "Your Playlists" to see its songs
- **Remove Songs**: Hover over a song and click the three dots to remove it
- **Delete Playlists**: Click the trash icon next to the share button in the playlist header
- **Share Playlists**: Click the share button to copy a shareable link

### Exploring Community

- Browse the **Community Playlists** section to discover music from other users
- Click the **play button** to view a community playlist
- Click the **plus button** to add it to your own collection
- Click the **share button** to get a link to share with others

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0).
