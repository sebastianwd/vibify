'use client';
import Vapi from '@vapi-ai/web';
import { type RefObject, useEffect, useRef, useState } from 'react';

type VapiWidgetProps = {
	apiKey: string;
	assistantId: string;
	onCallStart?: () => void;
	onCallEnd?: () => void;
	onFunctionCall?: (functionCall: any, vapiRef: RefObject<Vapi | null>) => void;
	onError?: (error: any) => void;
	onTranscript?: (transcript: string, role: 'user' | 'assistant') => void;
};

export function VapiWidget({
	apiKey,
	assistantId,
	onCallStart,
	onCallEnd,
	onFunctionCall,
	onError,
	onTranscript,
}: VapiWidgetProps) {
	const vapiRef = useRef<Vapi | null>(null);
	const [isCallActive, setIsCallActive] = useState(false);
	const [isInitialized, setIsInitialized] = useState(false);

	const initializeVapi = () => {
		if (!apiKey || !assistantId) {
			console.warn('Vapi API key or assistant ID missing');
			return false;
		}

		if (vapiRef.current) return true; // Already initialized

		try {
			const vapi = new Vapi(apiKey);
			vapiRef.current = vapi;

			// Call lifecycle events
			vapi.on('call-start', () => {
				console.log('Voice conversation started');
				setIsCallActive(true);
				onCallStart?.();
			});

			vapi.on('call-end', () => {
				console.log('Voice conversation ended');
				setIsCallActive(false);
				onCallEnd?.();
			});

			// Real-time conversation events
			vapi.on('speech-start', () => {
				console.log('User started speaking');
			});

			vapi.on('speech-end', () => {
				console.log('User stopped speaking');
			});

			vapi.on('message', (message) => {
				console.log('Message:', message);
				if (message.type === 'transcript') {
					console.log(`${message.role}: ${message.transcript}`);
					onTranscript?.(message.transcript, message.role);
				} else if (message.type === 'tool-calls') {
					console.log('Function called:', message.toolCalls[0]);

					onFunctionCall?.(message.toolCalls[0], vapiRef);
				}
			});

			// Error handling
			vapi.on('error', (error) => {
				console.error('Voice widget error:', error);
				setIsCallActive(false);
				onError?.(error);
			});

			setIsInitialized(true);
			return true;
		} catch (error) {
			console.error('Failed to initialize Vapi:', error);
			onError?.(error);
			return false;
		}
	};

	const startCall = () => {
		if (isCallActive) return;

		// Initialize if not already done
		if (!initializeVapi()) return;

		try {
			vapiRef.current?.start(assistantId);
		} catch (error) {
			console.error('Failed to start call:', error);
			onError?.(error);
		}
	};

	const stopCall = () => {
		if (!vapiRef.current || !isCallActive) return;

		try {
			vapiRef.current.stop();
		} catch (error) {
			console.error('Failed to stop call:', error);
			onError?.(error);
		}
	};

	const sendMessage = (message: string) => {
		if (!vapiRef.current) return;

		try {
			vapiRef.current.send({
				type: 'add-message',
				message: {
					role: 'user',
					content: message,
				},
			});
		} catch (error) {
			console.error('Failed to send message:', error);
			onError?.(error);
		}
	};

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (vapiRef.current && isCallActive) {
				vapiRef.current.stop();
			}
		};
	}, [isCallActive]);

	return {
		startCall,
		stopCall,
		sendMessage,
		isCallActive,
		isInitialized,
	};
}

// Hook for easier usage
export function useVapiWidget(config: {
	apiKey: string;
	assistantId: string;
	onCallStart?: () => void;
	onCallEnd?: () => void;
	onFunctionCall?: (functionCall: any, vapiRef: RefObject<Vapi | null>) => void;
	onError?: (error: any) => void;
	onTranscript?: (transcript: string, role: 'user' | 'assistant') => void;
}) {
	return VapiWidget(config);
}
