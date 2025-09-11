'use client';

import React from 'react';
import {
  Box,
  Typography,
  Container,
  useTheme,
  alpha,
  Card
} from '@mui/material';
import { useTheme as useCustomTheme } from '../../../contexts/ThemeContext';

const AboutSection = () => {
  const { isDarkMode } = useCustomTheme();
  const theme = useTheme();
  
  const skillCategories = [
    {
      category: 'Languages',
      skills: [
        { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
        { name: 'R', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg' },
        { name: 'SQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
        { name: 'C', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' }
      ]
    },
    {
      category: 'Data Analysis',
      skills: [
        { name: 'Pandas', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg' },
        { name: 'NumPy', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg' },
        { name: 'Scikit-learn', icon: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg' },
        { name: 'TensorFlow', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg' },
        { name: 'Power BI', icon: 'https://logos-world.net/wp-content/uploads/2022/02/Microsoft-Power-BI-Symbol.png' }
      ]
    },
    {
      category: 'Tools',
      skills: [
        { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
        { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
        { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
        { name: 'AWS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' },
        { name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' },
        { name: 'Supabase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg' }
      ]
    }
  ];

  const competencies = [
    'Python Programming',
    'Data Analysis',
    'Machine Learning', 
    'Natural Language Processing',
    'Web Development'
  ];


  return (
    <Box 
      id="about" 
      sx={{ 
        py: 4, 
        backgroundColor: theme.palette.background.default,
        minHeight: '100vh'
      }}
    >
      <Container maxWidth="lg">

        <Card
          sx={{
            backgroundColor: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            borderRadius: 4,
            boxShadow: isDarkMode 
              ? '0 20px 60px rgba(0,0,0,0.4)' 
              : '0 20px 60px rgba(0,0,0,0.12)',
            p: 5
          }}
        >
          {/* Main Two Column Layout */}
          <Box 
            sx={{ 
              display: 'flex',
              gap: 4,
              '@media (max-width: 959px)': {
                flexDirection: 'column'
              }
            }}
          >
            {/* Left Column - Image, Info and Skills */}
            <Box sx={{ flex: '0 0 50%' }}>
              {/* Profile Section */}
              <Box sx={{ display: 'flex', gap: 3, mb: 4, alignItems: 'flex-start' }}>
                {/* Profile Image */}
                <Box sx={{ flex: '0 0 200px' }}>
                  <Box
                    component="img"
                    src="/images/Professional_pic.JPG"
                    alt="Amogh Ramagiri"
                    loading="eager"
                    sx={{
                      width: 200,
                      height: 250,
                      borderRadius: '24px',
                      objectFit: 'cover',
                      objectPosition: 'center top',
                      imageRendering: 'auto',
                      filter: 'none',
                      boxShadow: isDarkMode 
                        ? '0 15px 40px rgba(0,0,0,0.4)' 
                        : '0 15px 40px rgba(0,0,0,0.12)',
                      border: `2px solid ${alpha(theme.palette.divider, 0.1)}`,
                      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: isDarkMode 
                          ? `0 20px 50px ${alpha(theme.palette.primary.main, 0.3)}` 
                          : `0 20px 50px ${alpha(theme.palette.primary.main, 0.2)}`
                      }
                    }}
                  />
                </Box>
                
                {/* Profile Info Card */}
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      backgroundColor: alpha(theme.palette.background.paper, 0.6),
                      backdropFilter: 'blur(20px)',
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      boxShadow: isDarkMode 
                        ? '0 8px 32px rgba(0,0,0,0.3)' 
                        : '0 8px 32px rgba(0,0,0,0.1)',
                      height: 'fit-content'
                    }}
                  >
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontSize: '28px',
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                        mb: 2,
                        fontFamily: 'Raleway, sans-serif'
                      }}
                    >
                      Amogh Ramagiri
                    </Typography>
                    
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontSize: '18px',
                        fontWeight: 600,
                        color: theme.palette.primary.main,
                        mb: 3,
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      Data Scientist Intern
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontSize: '15px',
                          color: theme.palette.text.secondary,
                          fontFamily: 'Inter, sans-serif',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        <span style={{ fontSize: '16px' }}>📧</span>
                        amoghr@gwu.edu
                      </Typography>
                      
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontSize: '15px',
                          color: theme.palette.text.secondary,
                          fontFamily: 'Inter, sans-serif',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        <span style={{ fontSize: '16px' }}>📍</span>
                        Arlington, VA
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Skills Section */}
              <Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontSize: '18px',
                    fontWeight: 700,
                    margin: '30px 0 20px 0',
                    fontFamily: 'Raleway, sans-serif',
                    color: theme.palette.text.primary
                  }}
                >
                  Technical Skills
                </Typography>
                
                {skillCategories.map((category) => (
                  <Box key={category.category} sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                        mb: 1.5,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      {category.category}:
                    </Typography>
                    
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1.5,
                        mb: 2
                      }}
                    >
                      {category.skills.map((skill) => (
                        <Box
                          key={skill.name}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            p: 1.5,
                            borderRadius: 2,
                            backgroundColor: alpha(theme.palette.background.default, 0.5),
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'pointer',
                            minWidth: 'fit-content',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              borderColor: alpha(theme.palette.primary.main, 0.3),
                              boxShadow: isDarkMode 
                                ? `0 6px 20px ${alpha(theme.palette.primary.main, 0.2)}` 
                                : `0 6px 20px ${alpha(theme.palette.primary.main, 0.15)}`
                            }
                          }}
                        >
                          <Box
                            component="img"
                            src={skill.icon}
                            alt={skill.name}
                            sx={{
                              width: 24,
                              height: 24,
                              filter: isDarkMode ? 'brightness(1.1)' : 'brightness(0.9)',
                              transition: 'all 0.3s ease'
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: '12px',
                              fontWeight: 600,
                              color: theme.palette.text.primary,
                              fontFamily: 'Inter, sans-serif',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {skill.name}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Right Column - About Me */}
            <Box sx={{ flex: '1' }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontSize: '28px',
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  fontFamily: 'Raleway, sans-serif',
                  position: 'relative',
                  paddingBottom: '10px',
                  marginBottom: '30px',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    display: 'block',
                    width: '64px',
                    height: '3px',
                    backgroundColor: theme.palette.primary.main,
                    left: 0,
                    bottom: 0
                  }
                }}
              >
                About me
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  fontSize: '18px',
                  lineHeight: 1.6,
                  textAlign: 'justify',
                  color: theme.palette.text.secondary,
                  mb: 3
                }}
              >
                I&apos;m a data enthusiast and problem solver with a strong interest in applying data science to the finance and banking industry. Currently, I&apos;m working as a Data Scientist Intern at Fulton Bank, where I focus on creating dashboards, building reports, and developing KPIs that help teams make smarter business decisions.
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  fontSize: '18px',
                  lineHeight: 1.6,
                  textAlign: 'justify',
                  color: theme.palette.text.secondary,
                  mb: 3
                }}
              >
                Day to day, I work with SQL and Python to handle large datasets, perform data analysis, and engineer meaningful features that bring clarity to complex problems. I enjoy turning raw data into stories that people can act on — whether it&apos;s identifying trends, improving processes, or supporting strategic goals.
              </Typography>

              <Typography 
                variant="body1" 
                sx={{ 
                  fontSize: '18px',
                  lineHeight: 1.6,
                  textAlign: 'justify',
                  color: theme.palette.text.secondary,
                  mb: 4
                }}
              >
                With a background in computer science and experience across India, Taiwan, and the U.S., I bring a well-rounded, global perspective to my work. I&apos;m passionate about making data useful, understandable, and impactful.
              </Typography>

              <Typography 
                variant="h4" 
                sx={{ 
                  fontSize: '28px',
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  fontFamily: 'Raleway, sans-serif',
                  position: 'relative',
                  paddingBottom: '10px',
                  marginBottom: '20px',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    display: 'block',
                    width: '64px',
                    height: '3px',
                    backgroundColor: theme.palette.primary.main,
                    left: 0,
                    bottom: 0
                  }
                }}
              >
                Competencies:
              </Typography>
              
              <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                {competencies.map((competency, index) => (
                  <Typography 
                    key={index}
                    component="li" 
                    variant="body1" 
                    sx={{ 
                      mb: 1,
                      fontSize: '18px',
                      color: theme.palette.text.secondary
                    }}
                  >
                    {competency}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default AboutSection;