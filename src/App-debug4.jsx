import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Typography, Box, Container, Grid, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import ProjectCard from './components/ProjectCard';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    shape: {
      borderRadius: 12,
    },
  },
});

function App() {
  const [projects, setProjects] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log('Testing with ProjectCard import...');
    try {
      const savedProjects = localStorage.getItem('styleProjects');
      
      if (savedProjects) {
        const parsed = JSON.parse(savedProjects);
        setProjects(parsed);
      } else {
        const sampleProject = {
          title: "Example Website",
          url: "https://example.com",
          colors: ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'],
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
    } catch (error) {
      console.error('Error:', error);
    }
    
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f5f5f5 0%, #e3f2fd 100%)'
      }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" component="h1" gutterBottom>
              Style Extractor
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Extract and save design styles from any website
            </Typography>
            <Button 
              variant="contained" 
              size="large" 
              startIcon={<AddIcon />}
              sx={{ mt: 3 }}
            >
              Create New Style Project
            </Button>
          </Box>

          <Typography variant="h5" gutterBottom>
            Your Projects ({projects.length})
          </Typography>

          <Grid container spacing={3}>
            {projects.map((project, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <ProjectCard 
                  project={project} 
                  onClick={() => console.log('Clicked project:', project.title)}
                />
              </Grid>
            ))}
          </Grid>

          {projects.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No style projects yet
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
