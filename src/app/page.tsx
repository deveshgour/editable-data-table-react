/**
 * Main page — Server Component shell for the data table application.
 */

import { Box, Typography } from '@mui/material';
import DataTableContainer from '@/components/table/DataTableContainer';

export default function Home() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        px: { xs: 2, sm: 3, md: 4 },
        py: 3,
        bgcolor: 'background.default',
      }}
    >
      {/* Page header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #818cf8 0%, #f472b6 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 0.5,
          }}
        >
          Employee Directory
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage, filter, and export employee data with inline editing and real-time validation.
        </Typography>
      </Box>

      {/* Data table */}
      <DataTableContainer />
    </Box>
  );
}
