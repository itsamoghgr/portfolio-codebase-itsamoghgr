import { useState, useEffect, useCallback } from 'react';

export interface ChatbotStatus {
  status: 'online' | 'offline' | 'checking';
  message: string;
  lastChecked: Date | null;
  error?: string;
}

export const useChatbotStatus = (enableAutoCheck: boolean = false) => {
  const [chatbotStatus, setChatbotStatus] = useState<ChatbotStatus>({
    status: 'offline', // Default to offline, will check when user clicks
    message: 'Click to check chatbot status',
    lastChecked: null
  });

  const checkStatus = useCallback(async () => {
    try {
      setChatbotStatus(prev => ({ ...prev, status: 'checking', message: 'Checking chatbot status...' }));

      const response = await fetch('/api/chat-status', {
        method: 'GET',
        cache: 'no-cache'
      });

      const data = await response.json();

      setChatbotStatus({
        status: data.status,
        message: data.message,
        lastChecked: new Date(),
        error: data.error
      });

    } catch (error) {
      console.error('Failed to check chatbot status:', error);
      setChatbotStatus({
        status: 'offline',
        message: 'Unable to check chatbot status. Please try again later.',
        lastChecked: new Date(),
        error: 'Network error'
      });
    }
  }, []);

  // Only check status on mount if auto-check is enabled
  useEffect(() => {
    if (enableAutoCheck) {
      checkStatus();
    }
  }, [checkStatus, enableAutoCheck]);

  // Manual refresh function
  const refreshStatus = useCallback(async () => {
    await checkStatus();
  }, [checkStatus]);

  return {
    chatbotStatus,
    refreshStatus,
    isOnline: chatbotStatus.status === 'online',
    isOffline: chatbotStatus.status === 'offline',
    isChecking: chatbotStatus.status === 'checking'
  };
};