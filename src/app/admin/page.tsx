'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Stack
} from '@mui/material';
import { Work, School, Code, Analytics } from '@mui/icons-material';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalExperiences: 0,
    completedProjects: 0,
    inProgressProjects: 0
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/projects').then(res => res.json()),
      fetch('/api/experience').then(res => res.json())
    ]).then(([projectsData, experiencesData]) => {
      const projects = projectsData.projects || [];
      const experiences = experiencesData.experiences || [];
      
      setStats({
        totalProjects: projects.length,
        totalExperiences: experiences.length,
        completedProjects: projects.filter((p: { status?: string }) => p.status === 'completed').length,
        inProgressProjects: projects.filter((p: { status?: string }) => p.status === 'in-progress').length
      });
    });
  }, []);

  const dashboardCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: <Code />,
      color: '#1976d2'
    },
    {
      title: 'Experiences',
      value: stats.totalExperiences,
      icon: <Work />,
      color: '#388e3c'
    },
    {
      title: 'Completed Projects',
      value: stats.completedProjects,
      icon: <Analytics />,
      color: '#f57c00'
    },
    {
      title: 'In Progress',
      value: stats.inProgressProjects,
      icon: <School />,
      color: '#7b1fa2'
    }
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Portfolio Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your portfolio content and track your progress
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
        {dashboardCards.map((card, index) => (
          <Card key={index}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: card.color, width: 50, height: 50 }}>
                  {card.icon}
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {card.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.title}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Use the sidebar navigation to manage different sections of your portfolio:
        </Typography>
        <ul>
          <li>Projects - Add, edit, or remove your portfolio projects</li>
          <li>Experience - Manage your work experience and education</li>
          <li>About Me - Update your personal information and bio</li>
          <li>Contact - Modify your contact information</li>
        </ul>
      </Box>
    </Box>
  );
}