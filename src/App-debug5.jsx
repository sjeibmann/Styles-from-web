import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Typography, Box, Container, Grid, Button, Snackbar, Alert } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import ProjectCard from './components/ProjectCard';
import NewProjectForm from './components/NewProjectForm';

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
  const [showNewForm, setShowNewForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    console.log('Testing with form and view switching...');
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
  }, []);

  const handleCreateProject = async (url) => {
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Testing form submission...');
      // Mock successful creation for now
      const newProject = {
        title: "New Test Project",
        url: url,
        colors: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
        createdAt: new Date().toISOString()
      };
      
      const updatedProjects = [newProject, ...projects];
      setProjects(updatedProjects);
      localStorage.setItem('styleProjects', JSON.stringify(updatedProjects));
      setShowNewForm(false);
    } catch (err) {
      setError('Failed to create project: ' + err.message);
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

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
              onClick={() => setShowNewForm(true)}
              sx={{ mt: 3 }}
            >
              Create New Style Project
            </Button>
          </Box>

          {showNewForm && (
            <Box sx={{ mb: 4 }}>
              <NewProjectForm
                onSubmit={handleCreateProject}
                onCancel={() => setShowNewForm(false)}
                isLoading={isLoading}
              />
            </Box>
          )}

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

          {projects.length === 0 && !showNewForm && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No style projects yet
              </Typography>
            </Box>
          )}
        </Container>
      </Box>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="error" onClose={() => setSnackbarOpen(false)}>
          {error}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
