import React, { useState, useEffect } from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  Container, 
  Typography, 
  Box, 
  Button, 
  Alert, 
  Snackbar,
  CssBaseline,
  Paper,
  Grid
} from '@mui/material';
import { 
  Add as AddIcon,
  Palette as PaletteIcon,
  Error as ErrorIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import ProjectCard from './components/ProjectCard';
import NewProjectForm from './components/NewProjectForm';
import ProjectView from './components/ProjectView';
import { extractStylesFromUrl } from './utils/styleExtractor';

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
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontWeight: 700,
      background: 'linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
  },
  shape: {
    borderRadius: 12,
  },
});

function App() {
  const [projects, setProjects] = useState([]);
  const [currentView, setCurrentView] = useState('collections');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const savedProjects = localStorage.getItem('styleProjects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      // Add sample project for testing
      const sampleProject = {
        title: "Example Website",
        url: "https://example.com",
        colors: ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe', '#f1f5f9', '#1e293b', '#475569'],
        typeStyles: [
          {
            tag: 'h1',
            text: 'Main Heading Example',
            fontSize: '32px',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: '700',
            lineHeight: '1.2',
            color: '#1e293b'
          },
          {
            tag: 'h2',
            text: 'Secondary Heading Example',
            fontSize: '24px',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: '600',
            lineHeight: '1.3',
            color: '#334155'
          },
          {
            tag: 'p',
            text: 'This is a paragraph example showing how body text appears with proper styling and formatting.',
            fontSize: '16px',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: '400',
            lineHeight: '1.6',
            color: '#475569'
          }
        ],
        buttonStyles: [
          {
            text: 'Primary Button',
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 20px',
            fontSize: '14px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: '500',
            textTransform: 'none',
            boxShadow: 'none',
            letterSpacing: 'normal',
            cursor: 'pointer'
          },
          {
            text: 'Secondary Button',
            backgroundColor: '#f1f5f9',
            color: '#1e293b',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            padding: '10px 20px',
            fontSize: '14px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: '500',
            textTransform: 'none',
            boxShadow: 'none',
            letterSpacing: 'normal',
            cursor: 'pointer'
          }
        ],
        linkStyles: [
          {
            text: 'Example link text',
            color: '#3b82f6',
            textDecoration: 'underline',
            fontSize: '14px',
            fontWeight: '500'
          }
        ],
        createdAt: new Date().toISOString()
      };
      setProjects([sampleProject]);
    }
  }, []);

  const saveProjects = (updatedProjects) => {
    setProjects(updatedProjects);
    localStorage.setItem('styleProjects', JSON.stringify(updatedProjects));
  };

  const handleCreateProject = async (url) => {
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Attempting to extract styles from:', url);
      const projectData = await extractStylesFromUrl(url);
      console.log('Successfully extracted project data:', projectData);
      
      const updatedProjects = [projectData, ...projects];
      saveProjects(updatedProjects);
      setShowNewForm(false);
      setSelectedProject(projectData);
      setCurrentView('project');
    } catch (err) {
      console.error('Detailed error:', err);
      let errorMessage = 'Failed to extract styles from the URL.';
      
      if (err.message.includes('Invalid URL format')) {
        errorMessage = 'Please enter a valid domain (like apple.com) or full URL (like https://example.com)';
      } else if (err.message.includes('CORS')) {
        errorMessage = 'CORS error: The website does not allow cross-origin requests. Try a different website.';
      } else if (err.message.includes('Failed to fetch')) {
        errorMessage = 'Could not fetch the website. Please check if the URL is correct and accessible.';
      } else if (err.message.includes('Network')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else {
        errorMessage = `Error: ${err.message}`;
      }
      
      setError(errorMessage);
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setCurrentView('project');
  };

  const handleBackToCollections = () => {
    setCurrentView('collections');
    setSelectedProject(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleDeleteProject = (projectId) => {
    const updatedProjects = projects.filter(p => p.createdAt !== projectId);
    saveProjects(updatedProjects);
    
    // If we're currently viewing the deleted project, go back to collections
    if (selectedProject && selectedProject.createdAt === projectId) {
      setSelectedProject(null);
      setCurrentView('collections');
    }
  };

  if (currentView === 'project' && selectedProject) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ProjectView 
          project={selectedProject} 
          onBack={handleBackToCollections}
          onDelete={handleDeleteProject}
        />
      </ThemeProvider>
    );
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
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
              <Paper
                elevation={4}
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 3,
                  background: 'linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PaletteIcon sx={{ fontSize: 32, color: 'white' }} />
              </Paper>
            </Box>
            <Typography variant="h3" component="h1" gutterBottom>
              Style Collections
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Extract and organize beautiful design systems from websites around the web
            </Typography>
          </Box>

          <Snackbar 
            open={snackbarOpen} 
            autoHideDuration={6000} 
            onClose={handleSnackbarClose}
          >
            <Alert 
              onClose={handleSnackbarClose} 
              severity="error" 
              sx={{ width: '100%' }}
              icon={<ErrorIcon fontSize="inherit" />}
            >
              {error}
            </Alert>
          </Snackbar>

          {!showNewForm ? (
            <Box sx={{ mb: 6, textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={() => setShowNewForm(true)}
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0 30%, #7b1fa2 90%)',
                  }
                }}
              >
                Create New Style Project
              </Button>
            </Box>
          ) : (
            <Box sx={{ mb: 6 }}>
              <NewProjectForm
                onSubmit={handleCreateProject}
                onCancel={() => setShowNewForm(false)}
                isLoading={isLoading}
              />
            </Box>
          )}

          <Grid container spacing={3}>
            {projects.map((project, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box 
                  sx={{ 
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    const deleteBtn = e.currentTarget.querySelector('.delete-button');
                    if (deleteBtn) {
                      deleteBtn.style.opacity = '1';
                    }
                  }}
                  onMouseLeave={(e) => {
                    const deleteBtn = e.currentTarget.querySelector('.delete-button');
                    if (deleteBtn) {
                      deleteBtn.style.opacity = '0';
                    }
                  }}
                >
                  <ProjectCard 
                    project={project} 
                    onClick={() => handleProjectClick(project)}
                  />
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.createdAt);
                    }}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'error.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'error.dark',
                      },
                      opacity: 0,
                      transition: 'opacity 0.2s ease',
                    }}
                    className="delete-button"
                  >
                    <DeleteIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>

          {projects.length === 0 && !showNewForm && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No style projects yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create your first style project to get started
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
