'use client';

import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import {
  RadioButtonChecked as OnlineIcon,
  RadioButtonUnchecked as OfflineIcon,
  Refresh as RefreshIcon,
  HourglassEmpty as CheckingIcon
} from '@mui/icons-material';
import { ChatbotStatus } from '../../../hooks/useChatbotStatus';

interface StatusIndicatorProps {
  status: ChatbotStatus;
  onRefresh?: () => void;
  compact?: boolean;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  onRefresh,
  compact = false
}) => {
  const theme = useTheme();

  const getStatusColor = () => {
    switch (status.status) {
      case 'online':
        return '#4caf50'; // Green
      case 'offline':
        return '#f44336'; // Red
      case 'checking':
        return '#ff9800'; // Orange
      default:
        return theme.palette.text.secondary;
    }
  };

  const getStatusIcon = () => {
    switch (status.status) {
      case 'online':
        return <OnlineIcon sx={{ fontSize: compact ? 12 : 14, color: getStatusColor() }} />;
      case 'offline':
        return <OfflineIcon sx={{ fontSize: compact ? 12 : 14, color: getStatusColor() }} />;
      case 'checking':
        return <CheckingIcon sx={{
          fontSize: compact ? 12 : 14,
          color: getStatusColor(),
          animation: 'rotate 2s linear infinite'
        }} />;
      default:
        return <OfflineIcon sx={{ fontSize: compact ? 12 : 14, color: getStatusColor() }} />;
    }
  };

  const getStatusText = () => {
    switch (status.status) {
      case 'online':
        return 'Online';
      case 'offline':
        return 'Offline';
      case 'checking':
        return 'Checking...';
      default:
        return 'Unknown';
    }
  };

  if (compact) {
    return (
      <Tooltip
        title={
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Chatbot Status: {getStatusText()}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
              {status.message}
            </Typography>
            {status.lastChecked && (
              <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.8 }}>
                Last checked: {status.lastChecked.toLocaleTimeString()}
              </Typography>
            )}
          </Box>
        }
        placement="left"
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            cursor: 'default'
          }}
        >
          {getStatusIcon()}
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.75rem',
              color: getStatusColor(),
              fontWeight: 500
            }}
          >
            {getStatusText()}
          </Typography>
        </Box>
      </Tooltip>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 1,
        borderRadius: 1,
        backgroundColor: alpha(getStatusColor(), 0.1),
        border: `1px solid ${alpha(getStatusColor(), 0.3)}`
      }}
    >
      {getStatusIcon()}
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            color: getStatusColor(),
            fontWeight: 600,
            lineHeight: 1.2
          }}
        >
          {getStatusText()}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            color: theme.palette.text.secondary,
            fontSize: '0.7rem',
            lineHeight: 1.2
          }}
        >
          {status.message}
        </Typography>
      </Box>
      {onRefresh && (
        <IconButton
          onClick={onRefresh}
          size="small"
          disabled={status.status === 'checking'}
          sx={{
            color: getStatusColor(),
            '&:hover': {
              backgroundColor: alpha(getStatusColor(), 0.1)
            }
          }}
        >
          <RefreshIcon sx={{ fontSize: 16 }} />
        </IconButton>
      )}

      <style jsx>{`
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </Box>
  );
};

export default StatusIndicator;