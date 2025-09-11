'use client';

import React from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  useTheme,
  alpha,
  Card,
  CardContent
} from '@mui/material';
import { CloudDownload } from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../../../contexts/ThemeContext';

const ExperienceSection = () => {
  const { isDarkMode } = useCustomTheme();
  const theme = useTheme();
  
  const educationData = [
    {
      title: 'Master of Science in Data Science',
      duration: 'Aug 2024 - Present',
      institution: 'The George Washington University, DC',
      description: 'Currently in my third semester studying NLP for Data Science, Cloud Computing, and Ethics for Data Science'
    },
    {
      title: 'Bachelor of Technology',
      duration: 'Sept, 2020 - May, 2024',
      institution: 'Presidency University, Bangalore, India',
      description: 'Pursued B.Tech in Computer Science and Engineering (Specialized in Artificial Intelligence and Machine Learning)'
    }
  ];

  const publicationsData = [
    {
      title: 'Image Classification for Optimized Prediction of Leukemia Cancer Cells using Machine Learning and Deep Learning Techniques',
      description: '2023 International Conference on Innovative Data Communication Technologies and Application (ICIDCA), 2023',
      citations: '6'
    },
    {
      title: 'Artificial Intelligence in Space-Limitations and its Solutions to Interplanetary CubeSats',
      description: '2023 International Conference on Innovative Data Communication Technologies and Application (ICIDCA), 2023',
      citations: '4'
    },
    {
      title: 'Intelligent Traffic Monitoring, Prioritizing and Controlling Model based on GPS',
      description: '2023 International Conference on Innovative Data Communication Technologies and Application (ICIDCA), 2023',
      citations: '3'
    }
  ];

  const organizationData = [
    {
      name: 'Institute of Electrical and Electronics Engineers (IEEE)',
      role: 'Student Member',
      duration: 'April 2025 - Present',
      description: 'Active member contributing to research and development in electrical engineering, computer science, and related fields.'
    },
    {
      name: 'Data Science for Sustainable Development (DSSD)',
      role: 'Head of Data Science Research Team',
      duration: 'Oct 2024 - Present',
      description: 'Leading the Data Science Research Team, spearheading sustainable development initiatives through advanced data science applications and research in energy efficiency and environmental impact analysis.'
    }
  ];

  const experienceData = [
    {
      company: 'Fulton Bank',
      role: 'Data Scientist Intern',
      duration: 'May 2025 - Present | East Petersburg, PA',
      responsibilities: [
        'Developed forecasting models for the internal Credit Risk team to predict interest rates and loan approval rates, enabling data-driven decisions while maintaining a low delinquency rate.',
        'Collaborated with the Lending and Risk teams to perform data profiling and mining using SQL, Python, and SSAS, improving data quality for credit risk analytics across business lines.',
        'Contributed to a large-scale data modernization project by migrating on-premises data infrastructure to Azure cloud, resulting in 43% improvement in system performance and 50%+ reduction in downtime.',
        'Rebuilt and optimized 15+ Power BI dashboards for key business lines using Microsoft Fabric and MS Power BI Azure, enabling real-time, cloud-native reporting and enhanced decision-making capabilities.'
      ]
    },
    {
      company: 'Data Science for Sustainable Development',
      role: 'Data Scientist Consultant',
      duration: 'Oct 2024 - Present | Washington DC',
      responsibilities: [
        'Designed strategy to reduce overall energy waste across 10 university buildings by 16%+ annually. Researched energy consumption patterns using Random Forest algorithm to identify peak usage times.',
        'Analyzed energy benchmarking data from 50+ university buildings, identifying critical factors impacting resource efficiency and sustainability trends to guide further research initiatives.',
        'Crafted a user-friendly interface in an interactive app hosted on the Streamlit Community Cloud; this resource facilitated real-time exploration of energy metrics across university buildings with enhanced latency.'
      ]
    },
    {
      company: 'Factocart, Velabh Technologies Pvt. Ltd.',
      role: 'Data Scientist',
      duration: 'Mar 2024 - Aug 2024 | Bangalore, India',
      responsibilities: [
        'Enabled strategic decisions about client acquisition and sales that drove 11% boost in overall sales within 6 months by analyzing 10GB+ datasets fetched from AWS RDS.',
        'Predicted customer demand with 92% accuracy, leading to 13% reduction in stockouts and optimizing inventory management across 10+ product categories using machine learning models.',
        'Performed hypothesis and A/B testing to evaluate the effectiveness of marketing campaigns, identifying high-performing strategies that led to a 15% increase in conversion rates.',
        'Created 20 detailed analytics reports using Power BI that provided actionable insights for decision-making; this initiative enhanced data visibility and led to a more efficient sales strategy implementation.'
      ]
    },
    {
      company: 'National Changhua University of Education',
      role: 'Research Assistant',
      duration: 'Sept 2023 - Mar 2024 | Changhua, Taiwan',
      responsibilities: [
        'Implemented dual-layer biometric authentication system integrating DeepFace for facial recognition and MFCC features for voice recognition, enhancing overall accuracy by 30% over traditional single-modal systems.',
        'Analyzed biometric authentication performance across diverse datasets, leveraging statistical techniques to validate system reliability and effectiveness.',
        'Architected an interactive solution via Flask and Python to access 1,200+ individual authentication records stored within NAS servers linked to Raspberry Pi units; attained meaningful gains in speed without sacrificing accuracy.'
      ]
    }
  ];

  return (
    <Box id="resume" sx={{ py: 4, backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
      <Container maxWidth="lg">
        {/* Centered Section Title with Download Button */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: { xs: 'center', sm: 'center' },
          mb: { xs: 4, sm: 6 },
          position: 'relative',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 3, sm: 0 },
          width: '100%'
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontFamily: 'Raleway, sans-serif',
                fontWeight: 'bold',
                color: theme.palette.text.primary,
                fontSize: { xs: '1.5rem', sm: '2rem' },
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '64px',
                  height: '3px',
                  backgroundColor: theme.palette.primary.main
                }
              }}
            >
              Experience
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<CloudDownload />}
            href="/static/downloads/amogh_ramagiri_resume.pdf"
            download
            sx={{
              position: { xs: 'static', sm: 'absolute' },
              right: { xs: 'auto', sm: 0 },
              alignSelf: { xs: 'center', sm: 'auto' },
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              fontWeight: 600,
              px: { xs: 2.5, sm: 3 },
              py: { xs: 1.2, sm: 1.5 },
              fontSize: { xs: '14px', sm: '16px' },
              borderRadius: 2,
              textTransform: 'none',
              minHeight: { xs: '44px', sm: 'auto' },
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
                transform: 'translateY(-2px)',
                boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`
              },
              transition: 'all 0.3s ease'
            }}
          >
            Resume
          </Button>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          gap: { xs: 3, sm: 4, md: 6 }, 
          flexDirection: { xs: 'column', lg: 'row' }
        }}>
          {/* Left Column - Education & Publications */}
          <Box sx={{ flex: { xs: '1', lg: '0 0 50%' } }}>
            {/* Education Card */}
            <Card sx={{
              backgroundColor: theme.palette.background.paper,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              borderRadius: 3,
              boxShadow: isDarkMode 
                ? '0 8px 32px rgba(0,0,0,0.3)' 
                : '0 8px 32px rgba(0,0,0,0.1)',
              mb: 4
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontFamily: 'Raleway, sans-serif',
                    color: theme.palette.text.primary,
                    fontSize: { xs: '20px', sm: '24px', md: '26px' },
                    fontWeight: 700,
                    mb: 3,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: '-8px',
                      left: 0,
                      width: '40px',
                      height: '3px',
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: '2px'
                    }
                  }}
                >
                  Education
                </Typography>

                {educationData.map((item, index) => (
                  <Box key={index} sx={{ 
                    position: 'relative',
                    padding: { xs: '0 0 24px 24px', sm: '0 0 30px 30px' },
                    marginTop: index === 0 ? 2 : 0,
                    borderLeft: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      width: { xs: '10px', sm: '12px' },
                      height: { xs: '10px', sm: '12px' },
                      borderRadius: '50%',
                      left: { xs: '-5px', sm: '-7px' },
                      top: '8px',
                      backgroundColor: theme.palette.primary.main,
                      border: `3px solid ${theme.palette.background.paper}`,
                      boxShadow: `0 0 0 1px ${theme.palette.primary.main}`
                    },
                    '&:last-child': {
                      paddingBottom: 0
                    }
                  }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontSize: { xs: '18px', sm: '18px' },
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        mb: { xs: 1.5, sm: 1 },
                        lineHeight: 1.3
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontSize: { xs: '14px', sm: '14px' },
                        fontWeight: 600,
                        mb: { xs: 1.5, sm: 1 },
                        color: theme.palette.primary.main,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {item.duration}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontStyle: 'italic',
                        mb: { xs: 2.5, sm: 2 },
                        color: theme.palette.text.secondary,
                        fontSize: { xs: '16px', sm: '15px' },
                        fontWeight: 500
                      }}
                    >
                      {item.institution}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        lineHeight: 1.6,
                        color: theme.palette.text.secondary,
                        fontSize: { xs: '15px', sm: '14px' }
                      }}
                    >
                      {item.description}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>

            {/* Publications Card */}
            <Card sx={{
              backgroundColor: theme.palette.background.paper,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              borderRadius: 3,
              boxShadow: isDarkMode 
                ? '0 8px 32px rgba(0,0,0,0.3)' 
                : '0 8px 32px rgba(0,0,0,0.1)',
              mb: 4
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontFamily: 'Raleway, sans-serif',
                    color: theme.palette.text.primary,
                    fontSize: { xs: '20px', sm: '24px', md: '26px' },
                    fontWeight: 700,
                    mb: 3,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: '-8px',
                      left: 0,
                      width: '40px',
                      height: '3px',
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: '2px'
                    }
                  }}
                >
                  Publications
                </Typography>

                {publicationsData.map((item, index) => (
                  <Box key={index} sx={{ 
                    position: 'relative',
                    padding: { xs: '0 0 20px 20px', sm: '0 0 30px 30px' },
                    marginTop: index === 0 ? 2 : 0,
                    borderLeft: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      width: { xs: '10px', sm: '12px' },
                      height: { xs: '10px', sm: '12px' },
                      borderRadius: '50%',
                      left: { xs: '-5px', sm: '-7px' },
                      top: '8px',
                      backgroundColor: theme.palette.primary.main,
                      border: `3px solid ${theme.palette.background.paper}`,
                      boxShadow: `0 0 0 1px ${theme.palette.primary.main}`
                    },
                    '&:last-child': {
                      paddingBottom: 0
                    }
                  }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontSize: { xs: '15px', sm: '16px' },
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        lineHeight: 1.3,
                        mb: 1
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        lineHeight: 1.6,
                        color: theme.palette.text.secondary,
                        fontSize: '14px'
                      }}
                    >
                      {item.description}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>

            {/* Organizations Card */}
            <Card sx={{
              backgroundColor: theme.palette.background.paper,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              borderRadius: 3,
              boxShadow: isDarkMode 
                ? '0 8px 32px rgba(0,0,0,0.3)' 
                : '0 8px 32px rgba(0,0,0,0.1)'
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontFamily: 'Raleway, sans-serif',
                    color: theme.palette.text.primary,
                    fontSize: { xs: '20px', sm: '24px', md: '26px' },
                    fontWeight: 700,
                    mb: 3,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: '-8px',
                      left: 0,
                      width: '40px',
                      height: '3px',
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: '2px'
                    }
                  }}
                >
                  Organizations
                </Typography>

                {organizationData.map((item, index) => (
                  <Box key={index} sx={{ 
                    position: 'relative',
                    padding: { xs: '0 0 20px 20px', sm: '0 0 30px 30px' },
                    marginTop: index === 0 ? 2 : 0,
                    borderLeft: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      width: { xs: '10px', sm: '12px' },
                      height: { xs: '10px', sm: '12px' },
                      borderRadius: '50%',
                      left: { xs: '-5px', sm: '-7px' },
                      top: '8px',
                      backgroundColor: theme.palette.primary.main,
                      border: `3px solid ${theme.palette.background.paper}`,
                      boxShadow: `0 0 0 1px ${theme.palette.primary.main}`
                    },
                    '&:last-child': {
                      paddingBottom: 0
                    }
                  }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontSize: { xs: '16px', sm: '18px' },
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        mb: 1,
                        lineHeight: 1.3
                      }}
                    >
                      {item.name}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontSize: { xs: '15px', sm: '16px' },
                        fontStyle: 'italic',
                        fontWeight: 500,
                        mb: 1,
                        color: theme.palette.primary.main
                      }}
                    >
                      {item.role}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontSize: { xs: '12px', sm: '14px' },
                        fontWeight: 600,
                        mb: 2,
                        color: theme.palette.text.secondary,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {item.duration}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        lineHeight: 1.6,
                        color: theme.palette.text.secondary,
                        fontSize: '14px'
                      }}
                    >
                      {item.description}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Box>

          {/* Right Column - Professional Experience */}
          <Box sx={{ flex: '1' }}>
            <Card sx={{
              backgroundColor: theme.palette.background.paper,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              borderRadius: 3,
              boxShadow: isDarkMode 
                ? '0 8px 32px rgba(0,0,0,0.3)' 
                : '0 8px 32px rgba(0,0,0,0.1)'
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontFamily: 'Raleway, sans-serif',
                    color: theme.palette.text.primary,
                    fontSize: { xs: '20px', sm: '24px', md: '26px' },
                    fontWeight: 700,
                    mb: 3,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: '-8px',
                      left: 0,
                      width: '40px',
                      height: '3px',
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: '2px'
                    }
                  }}
                >
                  Professional Experience
                </Typography>

                {experienceData.map((item, index) => (
                  <Box key={index} sx={{ 
                    position: 'relative',
                    padding: { xs: '0 0 24px 20px', sm: '0 0 40px 30px' },
                    marginTop: index === 0 ? 2 : 0,
                    borderLeft: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      width: { xs: '10px', sm: '12px' },
                      height: { xs: '10px', sm: '12px' },
                      borderRadius: '50%',
                      left: { xs: '-5px', sm: '-7px' },
                      top: '8px',
                      backgroundColor: theme.palette.primary.main,
                      border: `3px solid ${theme.palette.background.paper}`,
                      boxShadow: `0 0 0 1px ${theme.palette.primary.main}`
                    },
                    '&:last-child': {
                      paddingBottom: 0
                    }
                  }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontSize: { xs: '16px', sm: '18px' },
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        mb: 1,
                        lineHeight: 1.3
                      }}
                    >
                      {item.company}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontSize: { xs: '15px', sm: '16px' },
                        fontStyle: 'italic',
                        fontWeight: 500,
                        mb: 1,
                        color: theme.palette.primary.main
                      }}
                    >
                      {item.role}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontSize: { xs: '12px', sm: '14px' },
                        fontWeight: 600,
                        mb: 3,
                        color: theme.palette.text.secondary,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {item.duration}
                    </Typography>
                    
                    <Box component="ul" sx={{ pl: 0, m: 0, listStyle: 'none' }}>
                      {item.responsibilities.map((responsibility, respIndex) => (
                        <Typography 
                          key={respIndex}
                          component="li" 
                          variant="body2" 
                          sx={{ 
                            mb: 2,
                            lineHeight: 1.6,
                            color: theme.palette.text.secondary,
                            fontSize: { xs: '12px', sm: '14px' },
                            position: 'relative',
                            paddingLeft: { xs: '16px', sm: '20px' },
                            '&::before': {
                              content: '"•"',
                              color: theme.palette.primary.main,
                              fontWeight: 600,
                              position: 'absolute',
                              left: 0
                            }
                          }}
                        >
                          {responsibility}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ExperienceSection;