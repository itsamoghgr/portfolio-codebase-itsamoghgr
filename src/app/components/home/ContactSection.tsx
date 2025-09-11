'use client';

import React from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  useTheme,
  alpha,
  Fade
} from '@mui/material';
import { LocationOn, LinkedIn, Email } from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../../../contexts/ThemeContext';

const ContactSection = () => {
  const { isDarkMode } = useCustomTheme();
  const theme = useTheme();

  const contactInfo = [
    {
      icon: <LocationOn sx={{ fontSize: '1.8rem', color: theme.palette.primary.main }} />,
      title: 'Address',
      value: 'Arlington, VA, USA',
      href: 'https://maps.google.com/?q=Arlington,VA,USA'
    },
    {
      icon: <LinkedIn sx={{ fontSize: '1.8rem', color: theme.palette.primary.main }} />,
      title: 'LinkedIn',
      value: 'amoghgr',
      href: 'https://www.linkedin.com/in/amoghgr'
    },
    {
      icon: <Email sx={{ fontSize: '1.8rem', color: theme.palette.primary.main }} />,
      title: 'Email',
      value: 'amoghr@gwu.edu',
      href: 'mailto:amoghr@gwu.edu'
    }
  ];

  return (
    <Box id="contact" sx={{ py: 6, backgroundColor: theme.palette.background.default }}>
      <Container maxWidth="lg">
        {/* Section Title */}
        <Fade in timeout={600}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontFamily: 'Raleway, sans-serif',
                fontWeight: 'bold',
                color: theme.palette.text.primary,
                fontSize: '2rem',
                position: 'relative',
                display: 'inline-block',
                mb: 2,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '64px',
                  height: '3px',
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: '2px'
                }
              }}
            >
              Get In Touch
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: theme.palette.text.secondary,
                fontSize: '1.1rem',
                maxWidth: '600px',
                mx: 'auto',
                mt: 3,
                lineHeight: 1.6
              }}
            >
              I&apos;m always open to discussing new opportunities, interesting projects, or just having a conversation about data science and technology. Feel free to reach out!
            </Typography>
          </Box>
        </Fade>

        {/* Contact Info Cards */}
        <Fade in timeout={800}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { 
                xs: 'repeat(auto-fit, minmax(280px, 1fr))', 
                sm: 'repeat(2, 1fr)', 
                lg: 'repeat(3, 1fr)' 
              }, 
              gap: { xs: 3, sm: 4 }, 
              justifyContent: 'center',
              justifyItems: 'center',
              maxWidth: '1000px',
              mx: 'auto'
            }}>
              {contactInfo.map((info, index) => (
                <Card
                  key={index}
                  component={info.href ? "a" : "div"}
                  href={info.href}
                  target={info.href ? "_blank" : undefined}
                  rel={info.href ? "noopener noreferrer" : undefined}
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    borderRadius: 3,
                    boxShadow: isDarkMode 
                      ? '0 8px 32px rgba(0,0,0,0.3)' 
                      : '0 8px 32px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    textDecoration: 'none',
                    cursor: info.href ? 'pointer' : 'default',
                    width: '100%',
                    maxWidth: { xs: '320px', sm: 'none' },
                    height: { xs: 'auto', sm: '200px' },
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: isDarkMode 
                        ? `0 12px 40px ${alpha(theme.palette.primary.main, 0.2)}` 
                        : `0 12px 40px ${alpha(theme.palette.primary.main, 0.15)}`
                    }
                  }}
                >
                    <CardContent sx={{ 
                      p: { xs: 3, sm: 4 }, 
                      textAlign: 'center',
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <Box 
                        sx={{ 
                          mb: { xs: 2, sm: 3 },
                          width: { xs: '70px', sm: '80px' },
                          height: { xs: '70px', sm: '80px' },
                          borderRadius: '50%',
                          border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          mx: 'auto',
                          transition: 'all 0.3s ease',
                          '.MuiCard-root:hover &': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.2),
                            borderColor: alpha(theme.palette.primary.main, 0.4),
                            transform: 'scale(1.1)'
                          }
                        }}
                      >
                        {info.icon}
                      </Box>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontFamily: 'Raleway, sans-serif',
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          mb: { xs: 0.5, sm: 1 },
                          fontSize: { xs: '1.2rem', sm: '1.3rem' }
                        }}
                      >
                        {info.title}
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: theme.palette.text.secondary,
                          fontSize: { xs: '0.95rem', sm: '1rem' },
                          fontWeight: 500
                        }}
                      >
                        {info.value}
                      </Typography>
                    </CardContent>
                  </Card>
              ))}
            </Box>
          </Box>
        </Fade>

      </Container>
    </Box>
  );
};

export default ContactSection;