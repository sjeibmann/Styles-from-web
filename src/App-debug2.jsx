import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Typography, Box, Button, Container, Grid } from '@mui/material';
import { Add as AddIcon, Palette as PaletteIcon } from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
    },
  },
  shape: {
    borderRadius: 12,
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

  return children;
}

function App() {
  const [projects, setProjects] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log('App mounting...');
    try {
      // Test localStorage functionality
      const savedProjects = localStorage.getItem('styleProjects');
      console.log('Saved projects found:', savedProjects);
      
      if (savedProjects) {
        const parsed = JSON.parse(savedProjects);
        console.log('Parsed projects:', parsed);
        setProjects(parsed);
      } else {
        console.log('No saved projects, adding sample');
        // Add sample project for testing
        const sampleProject = {
          title: "Example Website",
          url: "https://example.com",
          colors: ['#1e40af', '#3b82f6', '#60a5fa'],
          typeStyles: [
            {
              tag: 'h1',
              text: 'Main Heading Example',
              fontSize: '32px',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: '700',
              lineHeight: '1.2',
              color: '#1e293b'
            }
          ],
          createdAt: new Date().toISOString()
        };
        setProjects([sampleProject]);
        localStorage.setItem('styleProjects', JSON.stringify([sampleProject]));
      }
      
      setMounted(true);
    } catch (error) {
      console.error('Error in useEffect:', error);
      setMounted(true); // Still mount even if localStorage fails
    }
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ 
          minHeight: '100vh', 
          background: 'linear-gradient(135deg, #f5f5f5 0%, #e3f2fd 100%)'
        }}>
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                <PaletteIcon sx={{ fontSize: 48, color: 'primary.main' }} />
              </Box>
              <Typography variant="h3" component="h1" gutterBottom>
                Style Extractor
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Extract and save design styles from any website
              </Typography>
            </Box>

            <Typography variant="h5" gutterBottom>
              Your Projects ({projects.length})
            </Typography>

            <Grid container spacing={3}>
              {projects.map((project, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box sx={{ 
                    p: 3, 
                    border: '1px solid #ddd', 
                    borderRadius: 2,
                    '&:hover': { boxShadow: 2 }
                  }}>
                    <Typography variant="h6">{project.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {project.url}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Colors: {project.colors?.length || 0}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {projects.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  No projects yet
                </Typography>
              </Box>
            )}
          </Container>
        </Box>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
