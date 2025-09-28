'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Fab,
  useTheme,
  Badge,
  Paper,
  Typography,
  IconButton
} from '@mui/material';
import { Chat as ChatIcon, Close as CloseIcon } from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../../../contexts/ThemeContext';
import { useChatbotStatus } from '../../../hooks/useChatbotStatus';
import StatusIndicator from './StatusIndicator';
import ChatModal from './ChatModal';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const { isDarkMode } = useCustomTheme();
  const theme = useTheme();
  const { chatbotStatus, refreshStatus, isOnline, isOffline } = useChatbotStatus(false);

  useEffect(() => {
    // Show popup after component mounts
    const showTimer = setTimeout(() => {
      setShowPopup(true);
    }, 1000);

    return () => {
      clearTimeout(showTimer);
    };
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const toggleChat = async () => {
    // Check status when user clicks the chatbot (only if chat is closed)
    if (!isOpen) {
      await refreshStatus();
      // Give a small delay to allow status to update
      setTimeout(() => {
        setIsOpen(true);
        setHasUnreadMessages(false);
        setShowPopup(false);
      }, 100);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Chat Modal */}
      <ChatModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onNewMessage={() => setHasUnreadMessages(true)}
        chatbotStatus={chatbotStatus}
        onRefreshStatus={refreshStatus}
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
          {/* Popup Message */}
          {showPopup && (
            <Paper
              elevation={8}
              onClick={toggleChat}
              sx={{
                position: 'absolute',
                bottom: 10,
                right: 80,
                minWidth: 220,
                maxWidth: 300,
                p: 2.5,
                borderRadius: 3,
                backgroundColor: isDarkMode ? '#2d3748' : '#ffffff',
                color: isDarkMode ? '#ffffff' : '#333333',
                boxShadow: isDarkMode
                  ? '0 8px 32px rgba(0, 0, 0, 0.5)'
                  : '0 8px 32px rgba(0, 0, 0, 0.15)',
                animation: 'slideUpAndFloat 0.5s ease-out, smoothFloat 6s ease-in-out infinite 1s',
                zIndex: 999,
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.05) translateY(-2px)',
                  boxShadow: isDarkMode
                    ? '0 16px 48px rgba(0, 0, 0, 0.7)'
                    : '0 16px 48px rgba(0, 0, 0, 0.25)',
                  animation: 'none'
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  right: -8,
                  transform: 'translateY(-50%)',
                  width: 0,
                  height: 0,
                  borderTop: '8px solid transparent',
                  borderBottom: '8px solid transparent',
                  borderLeft: `8px solid ${isDarkMode ? '#2d3748' : '#ffffff'}`
                }
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: isDarkMode ? '#e2e8f0' : '#4a5568',
                  textAlign: 'center'
                }}
              >
                How can I help you today?
              </Typography>
            </Paper>
          )}


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

        @keyframes slideUpAndFloat {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes smoothFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-2px);
          }
        }
      `}</style>
    </>
  );
};

export default ChatWidget;