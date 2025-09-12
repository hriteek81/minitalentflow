import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Archive as ArchiveIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { Job } from '../../types';
import JobForm from './SimpleJobForm';

const JobsBoard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [departments, setDepartments] = useState<string[]>([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm, statusFilter, departmentFilter]);

  const fetchJobs = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (departmentFilter !== 'all') params.append('department', departmentFilter);

      const response = await fetch(`/api/jobs?${params.toString()}`);
      const jobsData = await response.json();
      setJobs(jobsData);
      
      // Extract unique departments
      const uniqueDepts = Array.from(new Set(jobsData.map((job: Job) => job.department))) as string[];
      setDepartments(uniqueDepts);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const filterJobs = () => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(job => job.status === statusFilter);
    }

    if (departmentFilter !== 'all') {
      filtered = filtered.filter(job => job.department === departmentFilter);
    }

    setFilteredJobs(filtered);
  };

  const handleCreateJob = () => {
    setEditingJob(null);
    setIsFormOpen(true);
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setIsFormOpen(true);
  };

  const handleArchiveJob = async (jobId: number) => {
    try {
      await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archived: true }),
      });
      fetchJobs();
    } catch (error) {
      console.error('Error archiving job:', error);
    }
  };

  const handleJobSaved = () => {
    setIsFormOpen(false);
    setEditingJob(null);
    fetchJobs();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'closed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Jobs Board
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateJob}
        >
          Create Job
        </Button>
      </Box>

      {/* Filters */}
      <Box mb={3}>
        <Stack 
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems="stretch"
        >
          <TextField
            fullWidth
            label="Search jobs..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, description..."
          />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Department</InputLabel>
            <Select
              value={departmentFilter}
              label="Department"
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <MenuItem value="all">All Departments</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {/* Jobs Grid */}
      <Box 
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)'
          },
          gap: 3
        }}
      >
        {filteredJobs.map((job) => (
          <Box key={job.id}>
            <Card 
              elevation={2}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  elevation: 4,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {job.title}
                  </Typography>
                  <Chip
                    label={job.status}
                    color={getStatusColor(job.status) as any}
                    size="small"
                  />
                </Box>
                
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <BusinessIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {job.department}
                  </Typography>
                </Stack>
                
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                  <LocationIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {job.location}
                  </Typography>
                </Stack>
                
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {job.description}
                </Typography>
                
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                    Requirements:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {job.requirements.slice(0, 3).map((req, index) => (
                      <Chip key={index} label={req} size="small" variant="outlined" />
                    ))}
                    {job.requirements.length > 3 && (
                      <Chip 
                        label={`+${job.requirements.length - 3} more`} 
                        size="small" 
                        variant="outlined"
                        color="primary"
                      />
                    )}
                  </Stack>
                </Box>
              </CardContent>
              
              <CardActions>
                <IconButton 
                  size="small" 
                  onClick={() => handleEditJob(job)}
                  title="Edit Job"
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={() => handleArchiveJob(job.id)}
                  title="Archive Job"
                >
                  <ArchiveIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>

      {filteredJobs.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No jobs found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria or create a new job
          </Typography>
        </Box>
      )}

      {/* Job Form Dialog */}
      <Dialog 
        open={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingJob ? 'Edit Job' : 'Create New Job'}
        </DialogTitle>
        <DialogContent>
          <JobForm 
            job={editingJob}
            onSave={handleJobSaved}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default JobsBoard;
