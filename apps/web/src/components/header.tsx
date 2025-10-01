/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */
'use client';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import Link from 'next/link';
import { ModeToggle } from './mode-toggle';
import { UserMenu } from './user-menu';

export default function Header({ className }: { className?: string }) {
	const links = [
		{ to: '/', label: 'Home' },
		{ to: '/dashboard', label: 'Dashboard' },
		{ to: '/todos', label: 'Todos' },
	] as const;

	return (
		<header className='sticky top-0 z-40 mx-auto max-w-7xl border-white/10 border-b backdrop-blur supports-[backdrop-filter]:bg-[#0b0f14]/60'>
			<div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
				{/* Logo */}
				<div className='flex items-center gap-3'>
					<div className='flex h-8 w-8 items-center justify-center overflow-hidden rounded-md'>
						<Image
							src='/logo.png'
							alt='Vibify Logo'
							width={32}
							height={32}
							className='h-full w-full object-cover'
						/>
					</div>
					<div className='flex items-baseline gap-2'>
						<span
							className='font-geist text-lg text-white tracking-tight'
							style={{ fontWeight: 600 }}
						>
							Vibify
						</span>
						<span className='rounded-full px-2 py-0.5 font-geist text-sm text-white/40 ring-1 ring-white/10'>
							Beta
						</span>
					</div>
				</div>
				{/* Profile */}
				<div className='flex items-center gap-6'>
					<UserMenu />
				</div>
			</div>
		</header>
	);
}
