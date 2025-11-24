import React, { useState, useEffect, useRef } from 'react';
import { 
  Paper, 
  Typography, 
  TextField, 
  Box, 
  Button, 
  CircularProgress,
  Stack
} from '@mui/material';
import { 
  Language as LanguageIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const NewProjectForm = ({ onSubmit, onCancel, isLoading }) => {
  const [url, setUrl] = useState('');
  const inputRef = useRef(null);

  // Auto-focus the input field when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Box sx={{ 
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 48,
          height: 48,
          borderRadius: 2,
          background: 'linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)',
          mb: 2
        }}>
          <LanguageIcon sx={{ fontSize: 24, color: 'white' }} />
        </Box>
        <Typography variant="h5" component="h2" gutterBottom>
          Create New Style Project
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Extract design styles from any website
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            label="Website URL"
            variant="outlined"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="apple.com or www.google.com"
            helperText="Enter domain name (apple.com) or full URL (https://example.com)"
            required
            disabled={isLoading}
            inputRef={inputRef}
            InputProps={{
              startAdornment: <LanguageIcon sx={{ color: 'action.active', mr: 1 }} />,
            }}
          />
        </Box>
        
        <Stack direction="row" spacing={2}>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{ flexGrow: 1 }}
            size="large"
          >
            {isLoading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Collecting Styles...
              </>
            ) : (
              <>
                <LanguageIcon sx={{ fontSize: 20, mr: 1 }} />
                Collect Styles
              </>
            )}
          </Button>
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={isLoading}
            size="large"
            startIcon={<CloseIcon />}
          >
            Cancel
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default NewProjectForm;
