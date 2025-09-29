/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */
'use client';
import { Icon } from '@iconify/react';
import Vapi from '@vapi-ai/web';
import Image from 'next/image';
import Link from 'next/link';
import { ModeToggle } from './mode-toggle';

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
					<div className='flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-emerald-500 to-cyan-400 ring-1 ring-white/20'>
						<span
							className='font-geist font-medium text-white tracking-tight'
							style={{ fontWeight: 500 }}
						>
							V
						</span>
					</div>
					<div className='flex items-baseline gap-2'>
						<span
							className='font-geist text-lg text-white tracking-tight'
							style={{ fontWeight: 600 }}
						>
							VYB
						</span>
						<span className='rounded-full px-2 py-0.5 font-geist text-sm text-white/40 ring-1 ring-white/10'>
							Beta
						</span>
					</div>
				</div>
				{/* Profile */}
				<div className='flex items-center gap-6'>
					<button
						className='group flex items-center gap-3 rounded-full px-2 py-1 transition-colors hover:bg-white/5'
						type='button'
					>
						<img
							src='https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=100&auto=format&fit=crop'
							alt='Avatar'
							className='h-8 w-8 rounded-full object-cover ring-1 ring-white/20'
						/>
						<span className='hidden font-geist text-sm text-white/70 transition-colors group-hover:text-white lg:block'>
							you@vyb
						</span>
						<Icon
							icon='lucide:chevron-down'
							className='h-4 w-4 text-white/60'
						/>
					</button>
				</div>
			</div>
		</header>
	);
}
