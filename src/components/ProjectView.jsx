import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Palette as PaletteIcon,
  TextFields as TextFieldsIcon,
  ColorLens as ColorLensIcon,
  SmartButton as SmartButtonIcon,
  Link as LinkIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const ProjectView = ({ project, onBack, onDelete }) => {
  const renderTypeStyle = (style, index) => {
    const Tag = style.tag;
    
    return (
      <Box key={index} sx={{ 
        width: '100%', 
        mb: 3,
        pb: 3,
        borderBottom: index < (project.typeStyles?.length - 1) ? '1px solid #e0e0e0' : 'none'
      }}>
        {/* Display the actual styled text like MUI demo */}
        <Typography 
          variant={style.tag === 'h1' ? 'h1' : 
                   style.tag === 'h2' ? 'h2' : 
                   style.tag === 'h3' ? 'h3' : 
                   style.tag === 'h4' ? 'h4' : 
                   style.tag === 'h5' ? 'h5' : 
                   style.tag === 'h6' ? 'h6' : 
                   style.tag === 'p' ? 'body1' : 'body1'}
          gutterBottom
          sx={{
            fontSize: style.fontSize,
            fontFamily: style.fontFamily,
            fontWeight: style.fontWeight,
            lineHeight: style.lineHeight,
            color: style.color,
            margin: 0,
            textTransform: style.textTransform,
            letterSpacing: style.letterSpacing,
            textDecoration: style.textDecoration
          }}
        >
          {style.tag}. {style.actualText || style.text || 'Sample text'}
        </Typography>
        
        {/* Style details below the text like MUI's approach */}
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          <Typography variant="caption" sx={{ 
            fontFamily: 'monospace', 
            color: 'text.secondary',
            backgroundColor: 'grey.100',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: '11px'
          }}>
            {style.tag.toUpperCase()}
          </Typography>
          <Typography variant="caption" sx={{ 
            fontFamily: 'monospace', 
            color: 'text.secondary',
            backgroundColor: 'grey.100',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: '11px'
          }}>
            {style.fontSize}
          </Typography>
          <Typography variant="caption" sx={{ 
            fontFamily: 'monospace', 
            color: 'text.secondary',
            backgroundColor: 'grey.100',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: '11px'
          }}>
            {style.fontWeight}
          </Typography>
          <Typography variant="caption" sx={{ 
            fontFamily: 'monospace', 
            color: 'text.secondary',
            backgroundColor: 'grey.100',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: '11px'
          }}>
            {style.color}
          </Typography>
          {style.fontFamily && (
            <Typography variant="caption" sx={{ 
              fontFamily: 'monospace', 
              color: 'text.secondary',
              backgroundColor: 'grey.100',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: '11px',
              maxWidth: '200px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {style.fontFamily}
            </Typography>
          )}
        </Box>
      </Box>
    );
  };

  const renderColor = (color, index) => (
    <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          backgroundColor: color,
          border: '2px solid',
          borderColor: 'divider',
          boxShadow: 1,
          mb: 1,
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: 2,
            transform: 'scale(1.05)'
          }
        }}
      />
      <Chip
        label={color}
        size="small"
        variant="filled"
        sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}
      />
    </Box>
  );

  const renderButton = (button, index) => (
    <Paper key={index} sx={{ p: 3 }}>
      <Button
        variant="contained"
        style={{
          backgroundColor: button.backgroundColor,
          color: button.color,
          border: button.border,
          borderRadius: button.borderRadius,
          padding: button.padding,
          fontSize: button.fontSize,
          fontFamily: button.fontFamily,
          fontWeight: button.fontWeight,
          textTransform: button.textTransform,
          boxShadow: button.boxShadow,
          letterSpacing: button.letterSpacing,
          cursor: button.cursor
        }}
      >
        {button.text}
      </Button>
    </Paper>
  );

  const renderLink = (link, index) => (
    <Paper key={index} sx={{ p: 3 }}>
      <Box
        component="a"
        href="#"
        onClick={(e) => e.preventDefault()}
        sx={{
          color: link.color,
          textDecoration: link.textDecoration,
          fontSize: link.fontSize,
          fontWeight: link.fontWeight,
          '&:hover': {
            textDecoration: 'underline'
          }
        }}
      >
        {link.text}
      </Box>
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
          >
            Back to Collections
          </Button>
          
          <Tooltip title="Delete Project">
            <IconButton
              onClick={() => onDelete && onDelete(project.createdAt)}
              sx={{ 
                color: 'error.main',
                '&:hover': {
                  backgroundColor: 'error.light',
                  color: 'error.contrastText'
                }
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            {/* Favicon or default icon */}
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: 2,
              background: 'linear-gradient(45deg, #FFB300 30%, #FF6B35 90%)',
              mr: 2,
              overflow: 'hidden',
              border: '2px solid white',
              boxShadow: 1
            }}>
              {project.favicon ? (
                <img 
                  src={project.favicon} 
                  alt="Favicon"
                  style={{ 
                    width: '32px', 
                    height: '32px',
                    objectFit: 'contain',
                    borderRadius: '4px'
                  }}
                  onError={(e) => {
                    // Fallback to default icon if favicon fails to load
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : null}
              <PaletteIcon 
                sx={{ 
                  fontSize: 24, 
                  color: 'white',
                  display: project.favicon ? 'none' : 'block'
                }} 
              />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {project.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {project.url}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', ml: 2 }}>
              {project.colors?.slice(0, 5).map((color, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: color,
                    border: '2px solid white',
                    boxShadow: 1,
                    ml: index > 0 ? -1 : 0,
                  }}
                />
              ))}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ mr: 1 }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {new Date(project.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <Box sx={{ mr: 1 }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {project.typeStyles?.length || 0} styles extracted
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Typography Styles */}
        {project.typeStyles && project.typeStyles.length > 0 && (
          <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextFieldsIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h5">Typography</Typography>
              </Box>
              <Chip
                label={`${project.typeStyles?.length || 0} styles extracted`}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Typography styles extracted from the website, displayed in hierarchical order
            </Typography>
            
            {/* Single column layout like MUI demo */}
            <Box sx={{ width: '100%', maxWidth: 800 }}>
              {project.typeStyles?.map((style, index) => (
                renderTypeStyle(style, index)
              ))}
            </Box>
          </Paper>
        )}

        {/* Color Palette */}
        <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <ColorLensIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h5">Color Palette</Typography>
          </Box>
          <Grid container spacing={2}>
            {project.colors?.map((color, index) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
                {renderColor(color, index)}
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Button Styles */}
        {project.buttonStyles && project.buttonStyles.length > 0 && (
          <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <SmartButtonIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h5">Buttons</Typography>
            </Box>
            <Grid container spacing={3}>
              {project.buttonStyles.map((button, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  {renderButton(button, index)}
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}

        {/* Link Styles */}
        {project.linkStyles && project.linkStyles.length > 0 && (
          <Paper elevation={2} sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <LinkIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h5">Links</Typography>
            </Box>
            <Grid container spacing={3}>
              {project.linkStyles.map((link, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  {renderLink(link, index)}
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}
      </Container>
  );
};

export default ProjectView;
