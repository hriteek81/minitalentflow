import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Typography,
  Stack,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Job } from '../../types';

interface JobFormProps {
  job?: Job | null;
  onSave: () => void;
  onCancel: () => void;
}

const SimpleJobForm: React.FC<JobFormProps> = ({ job, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    status: 'active' as 'active' | 'inactive' | 'closed',
    description: '',
    location: '',
    requirements: [] as string[],
  });
  const [newRequirement, setNewRequirement] = useState('');

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        department: job.department,
        status: job.status,
        description: job.description,
        location: job.location,
        requirements: [...job.requirements],
      });
    }
  }, [job]);

  const handleInputChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSelectChange = (field: string) => (event: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()],
      }));
      setNewRequirement('');
    }
  };

  const handleRemoveRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      const url = job ? `/api/jobs/${job.id}` : '/api/jobs';
      const method = job ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSave();
      }
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2 }}>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            required
            fullWidth
            label="Job Title"
            value={formData.title}
            onChange={handleInputChange('title')}
          />
          <TextField
            required
            fullWidth
            label="Department"
            value={formData.department}
            onChange={handleInputChange('department')}
          />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FormControl fullWidth required>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label="Status"
              onChange={handleSelectChange('status')}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            required
            fullWidth
            label="Location"
            value={formData.location}
            onChange={handleInputChange('location')}
          />
        </Stack>

        <TextField
          required
          fullWidth
          multiline
          rows={4}
          label="Description"
          value={formData.description}
          onChange={handleInputChange('description')}
        />
        
        {/* Requirements Section */}
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Requirements
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" mb={2}>
            <TextField
              label="Add requirement"
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddRequirement();
                }
              }}
              size="small"
              sx={{ flexGrow: 1 }}
            />
            <IconButton 
              color="primary" 
              onClick={handleAddRequirement}
              disabled={!newRequirement.trim()}
            >
              <AddIcon />
            </IconButton>
          </Stack>
          
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {formData.requirements.map((req, index) => (
              <Chip
                key={index}
                label={req}
                onDelete={() => handleRemoveRequirement(index)}
                deleteIcon={<DeleteIcon />}
                color="primary"
                variant="outlined"
              />
            ))}
          </Stack>
        </Box>
        
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={!formData.title || !formData.department || !formData.location}
          >
            {job ? 'Update' : 'Create'} Job
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default SimpleJobForm;
