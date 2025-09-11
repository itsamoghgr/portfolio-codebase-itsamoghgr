'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  useTheme,
  alpha,
  Fade
} from '@mui/material';
import { LocationOn, LinkedIn, Email, Send } from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../../../contexts/ThemeContext';

const ContactSection = () => {
  const { isDarkMode } = useCustomTheme();
  const theme = useTheme();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

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
      value: 'amoghgr64@gmail.com',
      href: 'mailto:amoghgr64@gmail.com'
    }
  ];

  return (
    <Box id="contact" sx={{ py: 8, backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
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
          <Box sx={{ mb: 8 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 4, justifyContent: 'center' }}>
              {contactInfo.map((info, index) => (
                <Box key={index}>
                  <Card
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
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: isDarkMode 
                          ? `0 12px 40px ${alpha(theme.palette.primary.main, 0.2)}` 
                          : `0 12px 40px ${alpha(theme.palette.primary.main, 0.15)}`
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <Box 
                        sx={{ 
                          mb: 3,
                          width: '80px',
                          height: '80px',
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
                          mb: 1,
                          fontSize: '1.3rem'
                        }}
                      >
                        {info.title}
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: theme.palette.text.secondary,
                          fontSize: '1rem',
                          fontWeight: 500
                        }}
                      >
                        {info.value}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          </Box>
        </Fade>

        {/* Contact Form */}
        <Fade in timeout={1000}>
          <Card
            sx={{
              maxWidth: '800px',
              mx: 'auto',
              backgroundColor: theme.palette.background.paper,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              borderRadius: 3,
              boxShadow: isDarkMode 
                ? '0 8px 32px rgba(0,0,0,0.3)' 
                : '0 8px 32px rgba(0,0,0,0.1)'
            }}
          >
            <CardContent sx={{ p: { xs: 4, md: 6 } }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontFamily: 'Raleway, sans-serif',
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  mb: 1,
                  textAlign: 'center',
                  fontSize: '1.8rem'
                }}
              >
                Send Me a Message
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: theme.palette.text.secondary,
                  textAlign: 'center',
                  mb: 4,
                  fontSize: '0.95rem'
                }}
              >
                I&apos;ll get back to you as soon as possible
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                {/* First Row: Name and Email */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  mb: 3,
                  '@media (max-width: 768px)': { flexDirection: 'column' } 
                }}>
                  <TextField
                    fullWidth
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: alpha(theme.palette.background.default, 0.5),
                        backdropFilter: 'blur(10px)',
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '& fieldset': {
                          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`
                        },
                        '&:hover fieldset': {
                          borderColor: alpha(theme.palette.primary.main, 0.5)
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: theme.palette.primary.main,
                          boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                        },
                        '&.Mui-focused': {
                          backgroundColor: alpha(theme.palette.background.default, 0.8)
                        }
                      },
                      '& .MuiOutlinedInput-input': {
                        padding: '16px',
                        fontSize: '1rem',
                        color: theme.palette.text.primary
                      }
                    }}
                  />
                  <TextField
                    fullWidth
                    name="email"
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: alpha(theme.palette.background.default, 0.5),
                        backdropFilter: 'blur(10px)',
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '& fieldset': {
                          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`
                        },
                        '&:hover fieldset': {
                          borderColor: alpha(theme.palette.primary.main, 0.5)
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: theme.palette.primary.main,
                          boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                        },
                        '&.Mui-focused': {
                          backgroundColor: alpha(theme.palette.background.default, 0.8)
                        }
                      },
                      '& .MuiOutlinedInput-input': {
                        padding: '16px',
                        fontSize: '1rem',
                        color: theme.palette.text.primary
                      }
                    }}
                  />
                </Box>

                {/* Subject Row */}
                <TextField
                  fullWidth
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: alpha(theme.palette.background.default, 0.5),
                      backdropFilter: 'blur(10px)',
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '& fieldset': {
                        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`
                      },
                      '&:hover fieldset': {
                        borderColor: alpha(theme.palette.primary.main, 0.5)
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                      },
                      '&.Mui-focused': {
                        backgroundColor: alpha(theme.palette.background.default, 0.8)
                      }
                    },
                    '& .MuiOutlinedInput-input': {
                      padding: '16px',
                      fontSize: '1rem',
                      color: theme.palette.text.primary
                    }
                  }}
                />

                {/* Message Row */}
                <TextField
                  fullWidth
                  name="message"
                  placeholder="Your Message"
                  multiline
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  sx={{
                    mb: 4,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: alpha(theme.palette.background.default, 0.5),
                      backdropFilter: 'blur(10px)',
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '& fieldset': {
                        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`
                      },
                      '&:hover fieldset': {
                        borderColor: alpha(theme.palette.primary.main, 0.5)
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                      },
                      '&.Mui-focused': {
                        backgroundColor: alpha(theme.palette.background.default, 0.8)
                      }
                    },
                    '& .MuiInputBase-input': {
                      padding: '16px',
                      fontSize: '1rem',
                      color: theme.palette.text.primary,
                      lineHeight: 1.6
                    }
                  }}
                />

                {/* Submit Button */}
                <Box sx={{ textAlign: 'center' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    startIcon={<Send />}
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      fontWeight: 600,
                      px: 6,
                      py: 2,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontFamily: 'Inter, sans-serif',
                      boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 30px ${alpha(theme.palette.primary.main, 0.4)}`
                      },
                      '&:disabled': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.6),
                        transform: 'none',
                        boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.2)}`
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};

export default ContactSection;