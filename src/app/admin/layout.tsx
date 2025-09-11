// src/app/admin/layout.tsx
import React from 'react';
import Sidebar from '../components/admin/sidebar';
import { Box, Toolbar } from '@mui/material';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> {/* spacing below AppBar if you use one */}
        {children}
      </Box>
    </Box>
  );
}