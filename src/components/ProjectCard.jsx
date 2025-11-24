import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Language as LanguageIcon,
  Schedule as ScheduleIcon,
  Style as StyleIcon
} from '@mui/icons-material';

const ProjectCard = ({ project, onClick }) => {
  return (
    <Card 
      sx={{ 
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      onClick={onClick}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography 
              variant="h6" 
              component="h3" 
              sx={{ 
                fontWeight: 600, 
                mb: 1,
                color: 'text.primary',
                '&:hover': {
                  color: 'primary.main',
                }
              }}
            >
              {project.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
              <LanguageIcon sx={{ fontSize: 16, mr: 1 }} />
              <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                {project.url}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', ml: 1 }}>
            {project.favicon ? (
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  border: '2px solid white',
                  boxShadow: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}
              >
                <img 
                  src={project.favicon} 
                  alt="Favicon"
                  style={{ 
                    width: '20px', 
                    height: '20px',
                    objectFit: 'contain'
                  }}
                  onError={(e) => {
                    // Hide favicon and show colors if it fails to load
                    e.target.parentElement.style.display = 'none';
                    const colorBoxes = e.target.parentElement.parentElement.querySelectorAll('[data-color-box]');
                    colorBoxes.forEach(box => box.style.display = 'flex');
                  }}
                />
              </Box>
            ) : null}
            {project.colors?.slice(0, project.favicon ? 2 : 3).map((color, index) => (
              <Box
                key={index}
                data-color-box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: color,
                  border: '2px solid white',
                  boxShadow: 1,
                  ml: index > 0 || (project.favicon && index === 0) ? -1 : 0,
                  display: project.favicon ? 'none' : 'flex'
                }}
              />
            ))}
          </Box>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          pt: 2,
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
            <ScheduleIcon sx={{ fontSize: 14, mr: 1 }} />
            <Typography variant="caption">
              {new Date(project.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
          <Chip
            icon={<StyleIcon sx={{ fontSize: 14 }} />}
            label={`${project.typeStyles?.length || 0} styles`}
            size="small"
            variant="outlined"
            color="primary"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
