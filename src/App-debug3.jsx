import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Typography, Box, Container, Grid } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

function App() {
  const [projects, setProjects] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log('Testing localStorage...');
    try {
      const savedProjects = localStorage.getItem('styleProjects');
      console.log('Found saved projects:', savedProjects);
      
      if (savedProjects) {
        const parsed = JSON.parse(savedProjects);
        console.log('Parsed projects:', parsed);
        setProjects(parsed);
      } else {
        console.log('No saved projects, creating sample');
        const sampleProject = {
          title: "Example Website",
          url: "https://example.com",
          colors: ['#1e40af', '#3b82f6', '#60a5fa'],
          createdAt: new Date().toISOString()
        };
        setProjects([sampleProject]);
        localStorage.setItem('styleProjects', JSON.stringify([sampleProject]));
      }
    } catch (error) {
      console.error('localStorage error:', error);
    }
    
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Style Extractor App
        </Typography>
        <Typography variant="body1" gutterBottom>
          Testing localStorage functionality
        </Typography>
        
        <Typography variant="h6" gutterBottom>
          Projects ({projects.length})
        </Typography>

        <Grid container spacing={2}>
          {projects.map((project, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box sx={{ 
                p: 2, 
                border: '1px solid #ddd', 
                borderRadius: 1
              }}>
                <Typography variant="h6">{project.title}</Typography>
                <Typography variant="body2">{project.url}</Typography>
                <Typography variant="body2">
                  Colors: {project.colors?.length || 0}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
