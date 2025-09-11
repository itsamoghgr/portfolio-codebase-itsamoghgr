'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
  Container,
  Collapse,
  useTheme,
  alpha,
  IconButton,
  Fade
} from '@mui/material';
import { GitHub, Launch, ExpandMore, ExpandLess } from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../../../contexts/ThemeContext';
import { projectsData } from '../../../data/projects';

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  repoUrl?: string;
  liveDemoUrl?: string;
  imageUrl?: string;
  date: string;
}

// Month name to number mapping for Safari compatibility
const MONTH_MAP: Record<string, number> = {
  'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
  'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12,
  'January': 1, 'February': 2, 'March': 3, 'April': 4, 'June': 6,
  'July': 7, 'August': 8, 'September': 9, 'October': 10, 'November': 11, 'December': 12
};

// Safari-compatible date parsing with manual year/month extraction
// Supports both past and future dates (2022-2030+ range)
const parseProjectDate = (dateString: string): { year: number; month: number; originalDate: string; isValid: boolean } => {
  const parts = dateString.trim().split(' ');
  
  if (parts.length !== 2) {
    console.warn(`Invalid date format: "${dateString}". Expected format: "Mon YYYY"`);
    return { year: 1970, month: 1, originalDate: dateString, isValid: false };
  }
  
  const [monthStr, yearStr] = parts;
  const year = parseInt(yearStr, 10);
  const month = MONTH_MAP[monthStr] || MONTH_MAP[monthStr.toLowerCase()] || 1;
  
  // Validate year range (reasonable range for projects: 2000-2050)
  const isValidYear = !isNaN(year) && year >= 2000 && year <= 2050;
  const isValidMonth = month >= 1 && month <= 12;
  
  if (!isValidYear) {
    console.warn(`Invalid year in date: "${dateString}". Year: ${year}`);
  }
  
  if (!MONTH_MAP[monthStr] && !MONTH_MAP[monthStr.toLowerCase()]) {
    console.warn(`Unrecognized month in date: "${dateString}". Month: ${monthStr}`);
  }
  
  return {
    year: isValidYear ? year : 1970,
    month: isValidMonth ? month : 1,
    originalDate: dateString,
    isValid: isValidYear && isValidMonth
  };
};

// Production-ready sorting with year-wise then month-wise comparison
// Handles past and future dates consistently across all browsers
const sortProjectsByDate = (projects: Project[], ascending = true): Project[] => {
  return [...projects].sort((a, b) => {
    const dateA = parseProjectDate(a.date);
    const dateB = parseProjectDate(b.date);
    
    // Put invalid dates at the end
    if (!dateA.isValid && !dateB.isValid) {
      return a.id.localeCompare(b.id);
    }
    if (!dateA.isValid) return 1;
    if (!dateB.isValid) return -1;
    
    // First compare by year (handles future dates like 2025)
    const yearComparison = ascending 
      ? dateA.year - dateB.year
      : dateB.year - dateA.year;
    
    if (yearComparison !== 0) {
      return yearComparison;
    }
    
    // If years are equal, compare by month
    const monthComparison = ascending 
      ? dateA.month - dateB.month
      : dateB.month - dateA.month;
    
    if (monthComparison !== 0) {
      return monthComparison;
    }
    
    // If dates are identical, use ID as tiebreaker for consistent ordering
    return a.id.localeCompare(b.id);
  });
};

// Production-ready Project Card Component
interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { isDarkMode } = useCustomTheme();
  const theme = useTheme();

  return (
    <Fade in timeout={600}>
      <Card 
        sx={{ 
          width: '100%',
          maxWidth: '400px',
          minHeight: '500px',
          height: 'auto',
          borderRadius: 3,
          overflow: 'hidden',
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: isDarkMode 
            ? '0 20px 60px rgba(0,0,0,0.4)' 
            : '0 20px 60px rgba(0,0,0,0.12)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: isDarkMode 
              ? '0 25px 80px rgba(0,120,255,0.3)' 
              : '0 25px 80px rgba(0,120,255,0.2)'
          }
        }}
      >
        {/* Project Image */}
        <Box
          sx={{
            height: 220,
            backgroundImage: project.imageUrl ? `url(${project.imageUrl})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            background: !project.imageUrl 
              ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
              : undefined,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: project.imageUrl 
                ? 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)'
                : 'none',
              transition: 'all 0.3s ease',
              zIndex: 1
            },
            '&:hover::before': {
              background: project.imageUrl 
                ? 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 100%)'
                : 'none'
            },
            // Animated geometric pattern for projects without images
            ...(!project.imageUrl && {
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '20%',
                left: '20%',
                width: '60%',
                height: '60%',
                background: `radial-gradient(circle at center, ${alpha('#ffffff', 0.2)} 0%, transparent 70%)`,
                borderRadius: '50%',
                animation: 'pulse 3s ease-in-out infinite',
                zIndex: 0
              }
            })
          }}
        >
          {!project.imageUrl && (
            <>
              {/* Animated geometric shapes for default design */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '30%',
                  left: '30%',
                  width: '40px',
                  height: '40px',
                  border: `3px solid ${alpha('#ffffff', 0.3)}`,
                  borderRadius: '8px',
                  transform: 'rotate(45deg)',
                  animation: 'float 4s ease-in-out infinite',
                  zIndex: 2
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: '25%',
                  width: '30px',
                  height: '30px',
                  backgroundColor: alpha('#ffffff', 0.2),
                  borderRadius: '50%',
                  animation: 'float 4s ease-in-out infinite 1s',
                  zIndex: 2
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '35%',
                  left: '25%',
                  width: '35px',
                  height: '35px',
                  border: `2px solid ${alpha('#ffffff', 0.25)}`,
                  borderRadius: '50%',
                  animation: 'float 4s ease-in-out infinite 2s',
                  zIndex: 2
                }}
              />
              {/* Project icon/symbol */}
              <Box
                sx={{
                  color: 'white',
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  opacity: 0.8,
                  zIndex: 3,
                  textAlign: 'center',
                  fontFamily: 'Raleway, sans-serif'
                }}
              >
                {'</>'}
              </Box>
            </>
          )}
          {/* Date Badge */}
          <Chip
            label={project.date}
            size="small"
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 2,
              backgroundColor: alpha(theme.palette.background.paper, 0.9),
              color: theme.palette.primary.main,
              fontWeight: 600,
              fontSize: '0.75rem',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
            }}
          />

          {/* Action Buttons */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              display: 'flex',
              gap: 1,
              zIndex: 2,
              opacity: 0,
              transform: 'translateY(10px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                opacity: 1,
                transform: 'translateY(0)'
              }
            }}
            className="project-actions"
          >
            {project.repoUrl && (
              <IconButton
                component="a"
                href={project.repoUrl}
                target="_blank"
                sx={{
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                  color: theme.palette.text.primary,
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    transform: 'scale(1.1)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <GitHub sx={{ fontSize: 20 }} />
              </IconButton>
            )}
            {project.liveDemoUrl && (
              <IconButton
                component="a"
                href={project.liveDemoUrl}
                target="_blank"
                sx={{
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                  color: theme.palette.secondary.main,
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    backgroundColor: theme.palette.secondary.main,
                    color: 'white',
                    transform: 'scale(1.1)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <Launch sx={{ fontSize: 20 }} />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Card Content */}
        <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* Title */}
          <Typography 
            variant="h5" 
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 700,
              mb: 2,
              fontSize: '1.3rem',
              lineHeight: 1.3,
              fontFamily: 'Raleway, sans-serif',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: 'calc(1.3em * 2)' // 2 lines minimum height
            }}
          >
            {project.title}
          </Typography>

          {/* Description with 6 line limit and minimum height */}
          <Box sx={{ mb: 3, flex: 1 }}>
            <Typography 
              variant="body2" 
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '0.9rem',
                lineHeight: 1.6,
                mb: 2,
                display: '-webkit-box',
                WebkitLineClamp: 6,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textAlign: 'justify',
                minHeight: 'calc(1.6em * 6)' // 6 lines minimum height
              }}
            >
              {project.description}
            </Typography>
          </Box>

          {/* Tech Stack */}
          <Box sx={{ mt: 'auto' }}>
            <Box 
              sx={{ 
                display: 'flex', 
                gap: 0.5, 
                flexWrap: 'wrap', 
                justifyContent: 'flex-start',
                minHeight: 'calc(24px * 3 + 4px)', // 3 rows of chips with gaps
                alignContent: 'flex-start'
              }}
            >
              {project.techStack?.map((tech, techIndex) => (
                <Chip 
                  key={techIndex}
                  label={tech} 
                  size="small"
                  sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    fontSize: '0.7rem',
                    height: '24px',
                    fontWeight: 500,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.2)
                    },
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
};

// Production-ready Projects Container Component
interface ProjectsContainerProps {
  projects: Project[];
  showAnimation?: boolean;
}

const ProjectsContainer: React.FC<ProjectsContainerProps> = ({ 
  projects, 
  showAnimation = false 
}) => {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: 'repeat(auto-fit, minmax(350px, 1fr))',
          lg: 'repeat(3, 1fr)'
        },
        gap: { xs: 3, sm: 4 },
        justifyItems: 'center',
        maxWidth: '1200px',
        mx: 'auto',
        mb: 4,
        // Ensure consistent grid behavior across browsers
        gridAutoRows: 'min-content',
        gridAutoFlow: 'row',
        // Safari-specific grid fixes
        WebkitGridTemplateColumns: {
          xs: '1fr',
          md: 'repeat(auto-fit, minmax(350px, 1fr))',
          lg: 'repeat(3, 1fr)'
        }
      }}
    >
      {projects.map((project, index) => (
        <Box
          key={`project-${project.id}`}
          sx={{
            width: '100%',
            maxWidth: '400px',
            // Explicit positioning for consistent ordering
            gridRow: 'auto',
            gridColumn: 'auto',
            // Animation delay for collapsible projects
            ...(showAnimation && {
              animation: `fadeInUp 0.6s ease-out ${index * 100}ms both`
            })
          }}
        >
          <ProjectCard project={project} />
        </Box>
      ))}
    </Box>
  );
};

const ProjectsSection = () => {
  const theme = useTheme();
  const [showAllProjects, setShowAllProjects] = useState(false);

  // Memoize sorted projects for performance
  const sortedProjects = useMemo(() => {
    return sortProjectsByDate(projectsData.projects, false); // false for descending (latest to oldest)
  }, []);

  const { initialProjects, additionalProjects } = useMemo(() => {
    const initial = sortedProjects.slice(0, projectsData.settings.initialProjectsCount);
    const additional = sortedProjects.slice(projectsData.settings.initialProjectsCount);
    return { initialProjects: initial, additionalProjects: additional };
  }, [sortedProjects]);

  const handleToggleProjects = useCallback(() => {
    setShowAllProjects(prev => !prev);
  }, []);


  return (
    <Box 
      id="projects" 
      sx={{ 
        py: 8, 
        backgroundColor: theme.palette.background.default, 
        minHeight: '100vh'
      }}
    >
      <Container maxWidth="lg">
        {/* Section Title */}
        <Box sx={{ 
          textAlign: 'center',
          mb: 6
        }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontFamily: 'Raleway, sans-serif',
              fontWeight: 'bold',
              color: theme.palette.text.primary,
              fontSize: '2rem',
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
            Projects
          </Typography>
        </Box>

        {/* Projects Container - Clean, Production-Ready Layout */}
        <ProjectsContainer projects={initialProjects} />

        {/* Additional Projects (Collapsible) */}
        {additionalProjects.length > 0 && (
          <Collapse in={showAllProjects} timeout={600}>
            <Box sx={{ mt: 4 }}>
              <ProjectsContainer 
                projects={additionalProjects} 
                showAnimation={showAllProjects}
              />
            </Box>
          </Collapse>
        )}

        {/* Show More/Less Button - Only show if there are additional projects */}
        {additionalProjects.length > 0 && (
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              variant="contained"
              onClick={handleToggleProjects}
              endIcon={showAllProjects ? <ExpandLess /> : <ExpandMore />}
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
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              aria-label={showAllProjects ? 'Show fewer projects' : 'Show more projects'}
            >
              {showAllProjects 
                ? projectsData.settings.showMoreButtonText.showLess 
                : projectsData.settings.showMoreButtonText.showMore}
            </Button>
          </Box>
        )}
      </Container>

      {/* CSS for hover effects and animations - Production Ready */}
      <style jsx global>{`
        .MuiCard-root:hover .project-actions {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(45deg);
          }
          50% {
            transform: translateY(-10px) rotate(45deg);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Safari-specific CSS Grid fixes */
        @supports (-webkit-appearance: none) {
          .projects-grid {
            display: -webkit-grid;
            -webkit-grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            -webkit-grid-gap: 32px;
          }
        }
      `}</style>
    </Box>
  );
};

export default ProjectsSection;