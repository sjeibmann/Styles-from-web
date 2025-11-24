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
  Grid,
  IconButton
} from '@mui/material';
import { 
  Add as AddIcon,
  Palette as PaletteIcon,
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
    shape: {
      borderRadius: 12,
    },
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

  // Load projects from localStorage on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem('styleProjects');
    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects));
      } catch (err) {
        console.error('Failed to load projects:', err);
        localStorage.removeItem('styleProjects');
      }
    }
  }, []);

  // Save projects to localStorage whenever they change
  const saveProjects = (projectsToSave) => {
    try {
      localStorage.setItem('styleProjects', JSON.stringify(projectsToSave));
      setProjects(projectsToSave);
    } catch (err) {
      console.error('Failed to save projects:', err);
      setError('Failed to save projects to local storage');
      setSnackbarOpen(true);
    }
  };

  const handleCreateProject = async (url) => {
    setIsLoading(true);
    setError('');
    
    try {
      const styles = await extractStylesFromUrl(url);
      
      const newProject = {
        ...styles,
        createdAt: new Date().toISOString()
      };
      
      const updatedProjects = [newProject, ...projects];
      saveProjects(updatedProjects);
      setShowNewForm(false);
      
      // Automatically navigate to the newly created project
      setSelectedProject(newProject);
      setCurrentView('project');
    } catch (err) {
      setError('Failed to create project: ' + err.message);
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
    setSelectedProject(null);
    setCurrentView('collections');
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

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert severity="error" onClose={handleSnackbarClose}>
          {error}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
