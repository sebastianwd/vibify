'use client';

import { useEffect, useState } from 'react';
import { AuthForm } from './auth-form';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { VisuallyHidden } from './ui/visually-hidden';

type AuthModalProps = {
	isOpen: boolean;
	onClose: () => void;
	initialMode?: 'signin' | 'signup';
};

export function AuthModal({
	isOpen,
	onClose,
	initialMode = 'signin',
}: AuthModalProps) {
	const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

	// Update mode when initialMode prop changes
	useEffect(() => {
		setMode(initialMode);
	}, [initialMode]);

	const handleSuccess = () => {
		onClose();
	};

	const handleSwitchMode = () => {
		setMode(mode === 'signin' ? 'signup' : 'signin');
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent
				className='max-w-md border-0 bg-transparent p-0 shadow-none'
				showCloseButton={false}
				overlayClassName='data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 backdrop-blur-sm'
			>
				<VisuallyHidden>
					<DialogTitle>{mode === 'signin' ? 'Sign In' : 'Sign Up'}</DialogTitle>
				</VisuallyHidden>
				<AuthForm
					mode={mode}
					onSuccess={handleSuccess}
					onSwitchMode={handleSwitchMode}
					onClose={onClose}
				/>
			</DialogContent>
		</Dialog>
	);
}
