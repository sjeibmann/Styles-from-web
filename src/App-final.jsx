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
      main: '#102E50', // Deep navy blue
      light: '#1a4a73',
      dark: '#0a1f35',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#F5C45E', // Warm golden yellow
      light: '#f7d184',
      dark: '#e6b343',
      contrastText: '#102E50',
    },
    error: {
      main: '#BE3D2A', // Warm coral red
      light: '#d45542',
      dark: '#a63220',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#E78B48', // Warm orange
      light: '#f1a268',
      dark: '#d67a39',
      contrastText: '#ffffff',
    },
    info: {
      main: '#F5C45E', // Use secondary as info
      light: '#f7d184',
      dark: '#e6b343',
    },
    success: {
      main: '#4caf50', // Keep green for success states
      light: '#66bb6a',
      dark: '#388e3c',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: '#102E50',
      secondary: '#666666',
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
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* Left Sidebar Navigation */}
        <Box sx={{
          width: 320,
          backgroundColor: '#102E50',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          p: 3,
        }}>
          {/* Site Title */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Box sx={{ 
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: 2,
              background: 'linear-gradient(45deg, #FFB300 30%, #FF6B35 90%)',
              mb: 2
            }}>
              <PaletteIcon sx={{ fontSize: 24, color: 'white' }} />
            </Box>
            <Typography variant="h5" component="h1" sx={{ color: '#F5F5F5', fontWeight: 600 }}>
              Style Extractor
            </Typography>
            <Typography variant="body2" sx={{ color: '#B0B0B0', mt: 1 }}>
              Extract design styles from any website
            </Typography>
          </Box>

          {/* Create New Project Button */}
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => setShowNewForm(true)}
            sx={{
              mb: 4,
              background: 'linear-gradient(45deg, #FFB300 30%, #FF6B35 90%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #FFA000 30%, #FF5722 90%)',
              }
            }}
          >
            Create New Style Project
          </Button>

          {/* Project List */}
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            <Typography variant="subtitle2" sx={{ color: '#B0B0B0', mb: 2, textTransform: 'uppercase' }}>
              Your Projects ({projects.length})
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {projects.map((project, index) => (
                <Button
                  key={index}
                  variant="text"
                  onClick={() => handleProjectClick(project)}
                  sx={{
                    justifyContent: 'flex-start',
                    color: selectedProject?.createdAt === project.createdAt ? '#FFB300' : '#F5F5F5',
                    backgroundColor: selectedProject?.createdAt === project.createdAt ? 'rgba(255, 179, 0, 0.1)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: '#FFB300',
                    },
                    py: 1.5,
                    px: 2,
                    borderRadius: 2,
                    textTransform: 'none',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    {project.favicon ? (
                      <Box
                        component="img"
                        src={project.favicon}
                        alt="Favicon"
                        sx={{
                          width: 20,
                          height: 20,
                          mr: 2,
                          borderRadius: 1,
                          objectFit: 'contain'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <LanguageIcon sx={{ fontSize: 20, mr: 2, color: 'inherit' }} />
                    )}
                    <Box sx={{ textAlign: 'left', flexGrow: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {project.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#B0B0B0' }}>
                        {project.url}
                      </Typography>
                    </Box>
                  </Box>
                </Button>
              ))}
            </Box>
          </Box>

          {/* Empty State */}
          {projects.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" sx={{ color: '#B0B0B0' }}>
                No projects yet. Create your first style project to get started.
              </Typography>
            </Box>
          )}
        </Box>

        {/* Right Preview Pane */}
        <Box sx={{ 
          flexGrow: 1, 
          background: 'linear-gradient(135deg, #FFF9E6 0%, #FFE4CC 100%)',
          minHeight: '100vh'
        }}>
          {showNewForm ? (
            <Container maxWidth="md" sx={{ py: 4 }}>
              <NewProjectForm
                onSubmit={handleCreateProject}
                onCancel={() => setShowNewForm(false)}
                isLoading={isLoading}
              />
            </Container>
          ) : selectedProject ? (
            <ProjectView 
              project={selectedProject} 
              onBack={handleBackToCollections}
              onDelete={handleDeleteProject}
            />
          ) : (
            <Container maxWidth="lg" sx={{ py: 4 }}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h4" sx={{ color: '#102E50', mb: 2 }}>
                  Select a project to view styles
                </Typography>
                <Typography variant="body1" sx={{ color: '#666666', mb: 4 }}>
                  Choose a project from the sidebar or create a new one to get started
                </Typography>
                
                {/* Project Grid */}
                <Grid container spacing={3} sx={{ mt: 4 }}>
                  {projects.map((project, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <ProjectCard 
                        project={project} 
                        onClick={() => handleProjectClick(project)}
                      />
                    </Grid>
                  ))}
                </Grid>

                {projects.length === 0 && (
                  <Box sx={{ mt: 6 }}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<AddIcon />}
                      onClick={() => setShowNewForm(true)}
                      sx={{
                        background: 'linear-gradient(45deg, #FFB300 30%, #FF6B35 90%)',
                        color: 'white',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #FFA000 30%, #FF5722 90%)',
                        }
                      }}
                    >
                      Create Your First Style Project
                    </Button>
                  </Box>
                )}
              </Box>
            </Container>
          )}
        </Box>
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
