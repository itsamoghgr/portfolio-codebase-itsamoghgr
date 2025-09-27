'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Stack, 
  IconButton, 
  Link
} from '@mui/material';
import { 
  GitHub, 
  LinkedIn, 
  Twitter,
  Instagram
} from '@mui/icons-material';

const Footer = () => {
  const socialLinks = [
    {
      icon: <GitHub />,
      label: 'GitHub',
      href: 'https://github.com/itsamoghgr',
      color: '#333'
    },
    {
      icon: <LinkedIn />,
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/amoghgr',
      color: '#0077b5'
    },
    {
      icon: <Twitter />,
      label: 'Twitter',
      href: 'https://www.x.com/theamoghgr',
      color: '#1da1f2'
    },
    {
      icon: <Instagram />,
      label: 'Instagram',
      href: 'https://www.instagram.com/amoghr.shots',
      color: '#e4405f'
    }
  ];

  return (
    <Box
      sx={{
        backgroundColor: '#000000',
        color: '#ffffff',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 3
          }}
        >
          {/* Copyright */}
          <Typography 
            variant="body2" 
            sx={{ 
              textAlign: { xs: 'center', md: 'left' },
              color: '#ffffff'
            }}
          >
            © {new Date().getFullYear()} Amogh Ramagiri. All rights reserved.
          </Typography>
          
          {/* Social Links */}
          <Stack 
            direction="row" 
            spacing={2}
            sx={{ 
              justifyContent: { xs: 'center', md: 'flex-end' },
              alignItems: 'center'
            }}
          >
            {socialLinks.map((social) => (
              <IconButton
                key={social.label}
                component={Link}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                sx={{
                  color: '#ffffff',
                  fontSize: '20px',
                  '&:hover': {
                    color: social.color,
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {social.icon}
              </IconButton>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;