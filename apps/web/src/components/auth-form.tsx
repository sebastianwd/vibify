/** biome-ignore-all lint/correctness/useUniqueElementIds: <explanation> */
'use client';

import { Icon } from '@iconify/react';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

type AuthFormProps = {
	mode: 'signin' | 'signup';
	onSuccess?: () => void;
	onSwitchMode?: () => void;
	onClose?: () => void;
};

export function AuthForm({
	mode,
	onSuccess,
	onSwitchMode,
	onClose,
}: AuthFormProps) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		try {
			if (mode === 'signin') {
				await authClient.signIn.email({ email, password });
			} else {
				await authClient.signUp.email({ email, password, name });
			}
			onSuccess?.();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='mx-auto w-full max-w-md'>
			<div className='relative rounded-2xl bg-white/5 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.35)] ring-1 ring-white/10 backdrop-blur'>
				{/* Close button */}
				{onClose && (
					<button
						type='button'
						onClick={onClose}
						className='absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:outline-hidden'
					>
						<Icon icon='lucide:x' className='h-4 w-4 text-white' />
						<span className='sr-only'>Close</span>
					</button>
				)}

				<div className='mb-6 text-center'>
					<div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/80 to-cyan-400/80 shadow-[0_8px_30px_rgba(16,185,129,0.25)] ring-1 ring-white/20'>
						<Icon icon='lucide:music' className='h-6 w-6 text-white' />
					</div>
					<h2
						className='font-geist text-white text-xl tracking-tight'
						style={{ fontWeight: 600 }}
					>
						{mode === 'signin' ? 'Welcome back' : 'Join Vibify'}
					</h2>
					<p className='mt-2 font-geist text-sm text-white/70'>
						{mode === 'signin'
							? 'Sign in to access your playlists'
							: 'Create your account to save playlists'}
					</p>
				</div>

				<form onSubmit={handleSubmit} className='space-y-4'>
					{/* GitHub OAuth Button */}
					<Button
						type='button'
						variant='outline'
						className='w-full border-white/20 bg-white/5 text-white hover:bg-white/10'
						onClick={() => authClient.signIn.social({ provider: 'github' })}
						disabled={isLoading}
					>
						<Icon icon='lucide:github' className='mr-2 h-4 w-4' />
						Continue with GitHub
					</Button>

					{/* Divider */}
					<div className='relative'>
						<div className='absolute inset-0 flex items-center'>
							<span className='w-full border-white/20 border-t' />
						</div>
						<div className='relative flex justify-center text-xs uppercase'>
							<span className='bg-transparent px-2 text-white/60'>
								Or continue with email
							</span>
						</div>
					</div>
					{mode === 'signup' && (
						<div className='space-y-2'>
							<Label htmlFor='name' className='text-sm text-white/80'>
								Name
							</Label>
							<Input
								id='name'
								type='text'
								placeholder='Your name'
								value={name}
								onChange={(e) => setName(e.target.value)}
								required={mode === 'signup'}
								variant='auth'
							/>
						</div>
					)}

					<div className='space-y-2'>
						<Label htmlFor='email' className='text-sm text-white/80'>
							Email
						</Label>
						<Input
							id='email'
							type='email'
							placeholder='you@example.com'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							variant='auth'
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='password' className='text-sm text-white/80'>
							Password
						</Label>
						<Input
							id='password'
							type='password'
							placeholder='Your password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							variant='auth'
						/>
					</div>

					{error && (
						<div className='rounded-lg border border-red-500/20 bg-red-500/10 p-3'>
							<p className='text-red-400 text-sm'>{error}</p>
						</div>
					)}

					<Button
						type='submit'
						disabled={isLoading}
						className='w-full bg-emerald-500/90 hover:bg-emerald-400'
					>
						{isLoading ? (
							<>
								<Icon
									icon='lucide:loader'
									className='mr-2 h-4 w-4 animate-spin'
								/>
								{mode === 'signin' ? 'Signing in...' : 'Creating account...'}
							</>
						) : mode === 'signin' ? (
							'Sign In'
						) : (
							'Create Account'
						)}
					</Button>
				</form>

				<div className='mt-6 text-center'>
					<p className='text-sm text-white/60'>
						{mode === 'signin'
							? "Don't have an account?"
							: 'Already have an account?'}
					</p>
					<Button
						variant='ghost'
						size='sm'
						onClick={onSwitchMode}
						className='mt-2 text-emerald-400 hover:text-emerald-300'
					>
						{mode === 'signin' ? 'Sign up' : 'Sign in'}
					</Button>
				</div>
			</div>
		</div>
	);
}
