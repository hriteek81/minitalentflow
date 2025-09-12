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
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Archive as ArchiveIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { Candidate } from '../../types';
import CandidateForm from './CandidateForm';

const stages = [
  { id: 'screening', label: 'Screening', color: '#2196f3' },
  { id: 'interview', label: 'Interview', color: '#ff9800' },
  { id: 'offer', label: 'Offer', color: '#4caf50' },
  { id: 'hired', label: 'Hired', color: '#8bc34a' },
  { id: 'rejected', label: 'Rejected', color: '#f44336' },
];

const SimpleCandidatesBoard: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (stageFilter !== 'all') params.append('stage', stageFilter);

      const response = await fetch(`/api/candidates?${params.toString()}`);
      const candidatesData = await response.json();
      setCandidates(candidatesData);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  const handleCreateCandidate = () => {
    setEditingCandidate(null);
    setIsFormOpen(true);
  };

  const handleEditCandidate = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setIsFormOpen(true);
  };

  const handleArchiveCandidate = async (candidateId: number) => {
    try {
      await fetch(`/api/candidates/${candidateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archived: true }),
      });
      fetchCandidates();
    } catch (error) {
      console.error('Error archiving candidate:', error);
    }
  };

  const handleCandidateSaved = () => {
    setIsFormOpen(false);
    setEditingCandidate(null);
    fetchCandidates();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStageColor = (stage: string) => {
    const stageObj = stages.find(s => s.id === stage);
    return stageObj ? stageObj.color : '#9e9e9e';
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Candidates
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateCandidate}
        >
          Add Candidate
        </Button>
      </Box>

      {/* Filters */}
      <Stack direction="row" spacing={2} mb={3}>
        <TextField
          label="Search candidates..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setTimeout(fetchCandidates, 300);
          }}
          sx={{ minWidth: 300 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Stage</InputLabel>
          <Select
            value={stageFilter}
            label="Stage"
            onChange={(e) => {
              setStageFilter(e.target.value);
              setTimeout(fetchCandidates, 100);
            }}
          >
            <MenuItem value="all">All Stages</MenuItem>
            {stages.map((stage) => (
              <MenuItem key={stage.id} value={stage.id}>
                {stage.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/* Candidates Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: 2,
        }}
      >
        {candidates.map((candidate) => (
          <Card key={candidate.id} elevation={2}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="flex-start" mb={2}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 50, height: 50 }}>
                  {getInitials(candidate.name)}
                </Avatar>
                <Stack sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="h6" noWrap>
                    {candidate.name}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5} mb={0.5}>
                    <EmailIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {candidate.email}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <PhoneIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {candidate.phone}
                    </Typography>
                  </Stack>
                </Stack>
                <Chip
                  label={candidate.stage}
                  size="small"
                  sx={{
                    backgroundColor: getStageColor(candidate.stage),
                    color: 'white',
                  }}
                />
              </Stack>

              <Typography variant="body2" color="text.secondary" mb={1}>
                Experience: {candidate.experience}
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {candidate.skills.slice(0, 4).map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    size="small"
                    variant="outlined"
                  />
                ))}
                {candidate.skills.length > 4 && (
                  <Chip
                    label={`+${candidate.skills.length - 4}`}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                )}
              </Stack>
            </CardContent>

            <CardActions>
              <IconButton
                size="small"
                onClick={() => handleEditCandidate(candidate)}
                title="Edit Candidate"
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleArchiveCandidate(candidate.id)}
                title="Archive Candidate"
              >
                <ArchiveIcon />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </Box>

      {candidates.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No candidates found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add your first candidate to get started
          </Typography>
        </Box>
      )}

      {/* Candidate Form Dialog */}
      <Dialog 
        open={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingCandidate ? 'Edit Candidate' : 'Add New Candidate'}
        </DialogTitle>
        <DialogContent>
          <CandidateForm 
            candidate={editingCandidate}
            onSave={handleCandidateSaved}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SimpleCandidatesBoard;
