import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../index.css';
import Header from '@/components/header';
import Providers from '@/components/providers';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'my-better-t-app',
	description: 'my-better-t-app',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} min-h-svh bg-[#0b0f14] text-white/85 antialiased selection:bg-purple-500/20 selection:text-white/90`}
			>
				<Providers>
					<Header />
					<main className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
						{children}
					</main>
				</Providers>
			</body>
		</html>
	);
}
