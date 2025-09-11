'use client';

import React, { useState } from 'react';
import {
  Box,
  Fab,
  useTheme,
  Badge
} from '@mui/material';
import { Chat as ChatIcon } from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../../../contexts/ThemeContext';
import ChatModal from './ChatModal';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const { isDarkMode } = useCustomTheme();
  const theme = useTheme();

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasUnreadMessages(false);
    }
  };

  return (
    <>
      {/* Chat Modal */}
      <ChatModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        onNewMessage={() => setHasUnreadMessages(true)}
      />

      {/* Floating Chat Button - Only show when chat is closed */}
      {!isOpen && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000
          }}
        >
          <Badge
            color="primary"
            variant="dot"
            invisible={!hasUnreadMessages}
            sx={{
              '& .MuiBadge-badge': {
                animation: 'pulse 2s infinite'
              }
            }}
          >
            <Fab
              color="primary"
              onClick={toggleChat}
              sx={{
                width: 64,
                height: 64,
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                boxShadow: isDarkMode 
                  ? '0 8px 32px rgba(0, 120, 255, 0.4)' 
                  : '0 8px 32px rgba(0, 120, 255, 0.3)',
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                  transform: 'scale(1.05)',
                  boxShadow: isDarkMode 
                    ? '0 12px 40px rgba(0, 120, 255, 0.5)' 
                    : '0 12px 40px rgba(0, 120, 255, 0.4)'
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <ChatIcon />
            </Fab>
          </Badge>
        </Box>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }
      `}</style>
    </>
  );
};

export default ChatWidget;