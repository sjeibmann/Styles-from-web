import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Typography, Box, Button } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  if (hasError) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" color="error" gutterBottom>
          Something went wrong
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Error: {error?.message || 'Unknown error'}
        </Typography>
        <Button onClick={() => setHasError(false)} variant="contained">
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <div
      onError={(e) => {
        console.error('Error boundary caught:', e);
        setHasError(true);
        setError(e);
      }}
    >
      {children}
    </div>
  );
}

function App() {
  const [mounted, setMounted] = useState(false);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    console.log('App mounting...');
    try {
      setMounted(true);
      // Test localStorage
      const test = localStorage.getItem('test');
      console.log('LocalStorage test:', test);
    } catch (error) {
      console.error('Error in useEffect:', error);
    }
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ p: 4 }}>
          <Typography variant="h4">Style Extractor App</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Debug mode - checking components
          </Typography>
          <Typography variant="body2">
            Projects loaded: {projects.length}
          </Typography>
        </Box>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
