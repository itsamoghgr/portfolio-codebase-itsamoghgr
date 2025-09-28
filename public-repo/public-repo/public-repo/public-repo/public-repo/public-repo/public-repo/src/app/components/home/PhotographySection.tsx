'use client';

import React from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardMedia,
  Button
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

const PhotographySection = () => {
  // Sample photography data - you can replace with actual photos
  const photos = [
    '/images/portfolio/app-1.jpg',
    '/images/portfolio/app-2.jpg', 
    '/images/portfolio/app-3.jpg',
    '/images/portfolio/books-1.jpg',
    '/images/portfolio/books-2.jpg',
    '/images/portfolio/books-3.jpg',
    '/images/portfolio/branding-1.jpg',
    '/images/portfolio/branding-2.jpg',
    '/images/portfolio/branding-3.jpg'
  ];

  return (
    <Box id="photos" sx={{ py: 8, backgroundColor: '#f8f9fa' }}>
      <Container maxWidth="lg">
        {/* Section Title */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontFamily: 'Raleway, sans-serif',
              fontWeight: 'bold',
              color: '#0a090f',
              mb: 4
            }}
          >
            Photography
          </Typography>
        </Box>

        {/* Photo Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 4 }}>
          {photos.map((photo, index) => (
            <Box key={index}>
              <Card 
                sx={{ 
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="300"
                  image={photo}
                  alt={`Photography ${index + 1}`}
                  sx={{
                    objectFit: 'cover',
                    width: '100%'
                  }}
                />
              </Card>
            </Box>
          ))}
        </Box>

        {/* Instagram Link */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            href="https://www.instagram.com/amoghr.shots"
            target="_blank"
            sx={{
              backgroundColor: '#0078ff',
              color: 'white',
              fontWeight: 600,
              fontSize: '1rem',
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#0056cc',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,120,255,0.3)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            View My Instagram
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default PhotographySection;