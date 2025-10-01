'use client';

import { Icon } from '@iconify/react';
import { api } from '@my-better-t-app/backend/convex/_generated/api';
import {
	Authenticated,
	AuthLoading,
	Unauthenticated,
	useQuery,
} from 'convex/react';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { AuthModal } from './auth-modal';
import { Button } from './ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from './ui/dropdown-menu';

const LoadingState = () => {
	return (
		<div className='flex items-center gap-2'>
			<div className='h-8 w-8 animate-pulse rounded-full bg-white/10' />
			<div className='hidden h-4 w-16 animate-pulse rounded bg-white/10 lg:block' />
		</div>
	);
};

const UnauthenticatedState = () => {
	const [authModalOpen, setAuthModalOpen] = useState(false);
	const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

	const openAuthModal = (mode: 'signin' | 'signup') => {
		setAuthMode(mode);
		setAuthModalOpen(true);
	};

	return (
		<>
			<div className='flex items-center gap-2'>
				<Button
					variant='ghost'
					size='sm'
					onClick={() => openAuthModal('signin')}
					className='text-white/70 hover:text-white'
				>
					Sign In
				</Button>
				<Button
					variant='default'
					size='sm'
					onClick={() => openAuthModal('signup')}
					className='bg-emerald-500/90 hover:bg-emerald-400'
				>
					Sign Up
				</Button>
			</div>
			<AuthModal
				isOpen={authModalOpen}
				onClose={() => setAuthModalOpen(false)}
				initialMode={authMode}
			/>
		</>
	);
};

const AuthenticatedState = () => {
	const user = useQuery(api.auth.getCurrentUser);

	const handleSignOut = async () => {
		await authClient.signOut();
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='ghost'
					className='group flex items-center gap-3 rounded-full px-2 py-1 transition-colors hover:bg-white/5'
				>
					<div className='flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-cyan-400 ring-1 ring-white/20'>
						<span className='font-geist font-medium text-sm text-white'>
							{user?.name?.charAt(0).toUpperCase() ||
								user?.email?.charAt(0).toUpperCase() ||
								'U'}
						</span>
					</div>
					<span className='hidden font-geist text-sm text-white/70 transition-colors group-hover:text-white lg:block'>
						{user?.name || user?.email}
					</span>
					<Icon icon='lucide:chevron-down' className='h-4 w-4 text-white/60' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align='end'
				className='w-56 border-white/20 bg-black/80 backdrop-blur-md'
			>
				<DropdownMenuLabel className='text-white'>
					<div className='flex flex-col space-y-1'>
						<p className='font-medium text-sm leading-none'>
							{user?.name || 'User'}
						</p>
						<p className='text-white/60 text-xs leading-none'>{user?.email}</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator className='bg-white/20' />
				<DropdownMenuItem
					className='text-white hover:bg-white/10'
					onClick={handleSignOut}
				>
					<Icon icon='lucide:log-out' className='mr-2 h-4 w-4' />
					Sign Out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export function UserMenu() {
	return (
		<>
			<AuthLoading>
				<LoadingState />
			</AuthLoading>
			<Unauthenticated>
				<UnauthenticatedState />
			</Unauthenticated>
			<Authenticated>
				<AuthenticatedState />
			</Authenticated>
		</>
	);
}
