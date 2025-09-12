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
import { Candidate } from '../../types';

interface CandidateFormProps {
  candidate?: Candidate | null;
  onSave: () => void;
  onCancel: () => void;
}

const CandidateForm: React.FC<CandidateFormProps> = ({ candidate, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'active' as 'active' | 'inactive',
    stage: 'screening' as 'screening' | 'interview' | 'offer' | 'hired' | 'rejected',
    experience: '',
    skills: [] as string[],
    appliedJobs: [] as number[],
  });
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (candidate) {
      setFormData({
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone,
        status: candidate.status,
        stage: candidate.stage,
        experience: candidate.experience,
        skills: [...candidate.skills],
        appliedJobs: [...candidate.appliedJobs],
      });
    }
  }, [candidate]);

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

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      const url = candidate ? `/api/candidates/${candidate.id}` : '/api/candidates';
      const method = candidate ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSave();
      }
    } catch (error) {
      console.error('Error saving candidate:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2 }}>
      <Stack spacing={3}>
        <TextField
          required
          fullWidth
          label="Full Name"
          value={formData.name}
          onChange={handleInputChange('name')}
        />
        
        <TextField
          required
          fullWidth
          type="email"
          label="Email"
          value={formData.email}
          onChange={handleInputChange('email')}
        />
        
        <TextField
          required
          fullWidth
          label="Phone"
          value={formData.phone}
          onChange={handleInputChange('phone')}
        />
        
        <TextField
          required
          fullWidth
          label="Experience"
          value={formData.experience}
          onChange={handleInputChange('experience')}
          placeholder="e.g., 3 years, 5+ years"
        />
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ flex: 1 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label="Status"
              onChange={handleSelectChange('status')}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl sx={{ flex: 1 }}>
            <InputLabel>Stage</InputLabel>
            <Select
              value={formData.stage}
              label="Stage"
              onChange={handleSelectChange('stage')}
            >
              <MenuItem value="screening">Screening</MenuItem>
              <MenuItem value="interview">Interview</MenuItem>
              <MenuItem value="offer">Offer</MenuItem>
              <MenuItem value="hired">Hired</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        {/* Skills Section */}
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Skills
          </Typography>
          <Box mb={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                label="Add skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                size="small"
                sx={{ flexGrow: 1 }}
              />
              <IconButton 
                color="primary" 
                onClick={handleAddSkill}
                disabled={!newSkill.trim()}
              >
                <AddIcon />
              </IconButton>
            </Stack>
          </Box>
          
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {formData.skills.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                onDelete={() => handleRemoveSkill(index)}
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
            disabled={!formData.name || !formData.email || !formData.phone}
          >
            {candidate ? 'Update' : 'Add'} Candidate
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default CandidateForm;
