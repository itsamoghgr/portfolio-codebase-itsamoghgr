'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Container,
  IconButton,
  Stack,
  useTheme,
  alpha
} from '@mui/material';
import { Twitter, Instagram, GitHub, LinkedIn } from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../../../contexts/ThemeContext';

const HeroSection = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const typedItems = useMemo(() => ['Student', 'Data Scientist', 'Developer', 'Photographer', 'Traveller'], []);
  
  const { isDarkMode } = useCustomTheme();
  const theme = useTheme();

  useEffect(() => {
    const currentText = typedItems[currentIndex];
    let charIndex = 0;
    let isDeleting = false;

    const typeInterval = setInterval(() => {
      if (!isDeleting && charIndex <= currentText.length) {
        setDisplayedText(currentText.slice(0, charIndex));
        charIndex++;
      } else if (!isDeleting && charIndex > currentText.length) {
        setTimeout(() => {
          isDeleting = true;
        }, 2000);
      } else if (isDeleting && charIndex > 0) {
        setDisplayedText(currentText.slice(0, charIndex - 1));
        charIndex--;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        setCurrentIndex((prev) => (prev + 1) % typedItems.length);
        clearInterval(typeInterval);
      }
    }, isDeleting ? 50 : 100);

    return () => clearInterval(typeInterval);
  }, [currentIndex, typedItems]);

  return (
    <Box
      id="home"
      sx={{
        height: '100vh',
        background: isDarkMode 
          ? 'radial-gradient(ellipse at center, rgba(0, 120, 255, 0.15) 0%, rgba(10, 10, 10, 1) 70%)'
          : 'radial-gradient(ellipse at center, rgba(0, 120, 255, 0.05) 0%, rgba(248, 249, 250, 1) 70%)',
        color: theme.palette.text.primary,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        paddingTop: '92px',
        overflow: 'hidden'
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          filter: 'blur(40px)',
          animation: 'float 6s ease-in-out infinite',
          zIndex: 1
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
          filter: 'blur(30px)',
          animation: 'float 4s ease-in-out infinite reverse',
          zIndex: 1
        }}
      />

      <Container 
        maxWidth="lg" 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          textAlign: 'center',
          position: 'relative',
          zIndex: 3
        }}
      >
        <Box
          sx={{
            mb: 4,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '-20px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',
              height: '4px',
              background: 'linear-gradient(135deg, #0078ff 0%, #64ffda 100%)',
              borderRadius: '2px'
            }
          }}
        >
          <Typography 
            variant="body2"
            sx={{ 
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: theme.palette.primary.main,
              mb: 2
            }}
          >
            Hello, I&apos;m
          </Typography>
          
          <Typography 
            variant="h1"
            sx={{ 
              fontSize: { xs: '40px', md: '72px' },
              fontWeight: 800,
              margin: 0,
              mb: 2,
              fontFamily: 'Raleway, sans-serif',
              background: isDarkMode
                ? 'linear-gradient(135deg, #ffffff 0%, #b3b3b3 100%)'
                : 'linear-gradient(135deg, #0a090f 0%, #4e4e4e 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
              lineHeight: 1.2
            }}
          >
            Amogh Ramagiri
          </Typography>
          
          <Typography 
            variant="h2"
            sx={{ 
              fontSize: { xs: '24px', md: '42px' },
              fontWeight: 600,
              margin: '10px 0 0 0',
              fontFamily: 'Raleway, sans-serif',
              color: theme.palette.primary.main,
              minHeight: { xs: '32px', md: '50px' },
              lineHeight: 1.2
            }}
          >
            <span style={{ letterSpacing: '1px' }}>
              {displayedText}
              <span 
                style={{ 
                  borderRight: `3px solid ${theme.palette.primary.main}`,
                  animation: 'blink 1s infinite',
                  marginLeft: '2px'
                }}
              />
            </span>
          </Typography>

          <Typography 
            variant="body1"
            sx={{ 
              fontSize: { xs: '16px', md: '20px' },
              fontWeight: 400,
              mt: 4,
              maxWidth: '600px',
              lineHeight: 1.7,
              color: theme.palette.text.secondary
            }}
          >
            Passionate about transforming data into insights and building innovative solutions 
            that make a difference.
          </Typography>
        </Box>
      </Container>

      {/* Modern Social Links */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000
        }}
      >
        <Stack direction="row" spacing={1}>
          {[
            { Icon: Twitter, href: 'https://www.x.com/theamoghgr', color: '#1da1f2' },
            { Icon: Instagram, href: 'https://www.instagram.com/amoghr.shots', color: '#e4405f' },
            { Icon: GitHub, href: 'https://www.github.com/itsamoghgr', color: isDarkMode ? '#ffffff' : '#333' },
            { Icon: LinkedIn, href: 'https://www.linkedin.com/in/amoghgr', color: '#0077b5' }
          ].map(({ Icon, href, color }, index) => (
            <IconButton
              key={index}
              href={href}
              target="_blank"
              sx={{
                color: theme.palette.text.secondary,
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                width: 48,
                height: 48,
                '&:hover': {
                  color: color,
                  backgroundColor: alpha(color, 0.1),
                  transform: 'translateY(-4px) scale(1.05)',
                  boxShadow: `0 10px 30px ${alpha(color, 0.3)}`
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <Icon sx={{ fontSize: 20 }} />
            </IconButton>
          ))}
        </Stack>
      </Box>

      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </Box>
  );
};

export default HeroSection;