import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Preview as PreviewIcon,
  AccessTime as TimeIcon,
  Quiz as QuizIcon,
} from '@mui/icons-material';
import { Assessment } from '../../types';
import AssessmentBuilder from './AssessmentBuilder';
import AssessmentPreview from './AssessmentPreview';

const AssessmentsBoard: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
  const [previewAssessment, setPreviewAssessment] = useState<Assessment | null>(null);
  const [jobFilter, setJobFilter] = useState('all');

  useEffect(() => {
    fetchAssessments();
    fetchJobs();
  }, []);

  const fetchAssessments = async () => {
    try {
      const params = new URLSearchParams();
      if (jobFilter !== 'all') params.append('jobId', jobFilter);

      const response = await fetch(`/api/assessments?${params.toString()}`);
      const assessmentsData = await response.json();
      setAssessments(assessmentsData);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      const jobsData = await response.json();
      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleCreateAssessment = () => {
    setEditingAssessment(null);
    setIsBuilderOpen(true);
  };

  const handleEditAssessment = (assessment: Assessment) => {
    setEditingAssessment(assessment);
    setIsBuilderOpen(true);
  };

  const handlePreviewAssessment = (assessment: Assessment) => {
    setPreviewAssessment(assessment);
    setIsPreviewOpen(true);
  };

  const handleDeleteAssessment = async (assessmentId: number) => {
    if (window.confirm('Are you sure you want to delete this assessment?')) {
      try {
        await fetch(`/api/assessments/${assessmentId}`, {
          method: 'DELETE',
        });
        fetchAssessments();
      } catch (error) {
        console.error('Error deleting assessment:', error);
      }
    }
  };

  const handleAssessmentSaved = () => {
    setIsBuilderOpen(false);
    setEditingAssessment(null);
    fetchAssessments();
  };

  const getJobTitle = (jobId: number) => {
    const job = jobs.find(j => j.id === jobId);
    return job ? job.title : 'Unknown Job';
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Assessments
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateAssessment}
        >
          Create Assessment
        </Button>
      </Box>

      {/* Filter */}
      <Box mb={3}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Job</InputLabel>
          <Select
            value={jobFilter}
            label="Filter by Job"
            onChange={(e) => {
              setJobFilter(e.target.value);
              setTimeout(fetchAssessments, 100);
            }}
          >
            <MenuItem value="all">All Jobs</MenuItem>
            {jobs.map((job) => (
              <MenuItem key={job.id} value={job.id.toString()}>
                {job.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Assessments Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: 3,
        }}
      >
        {assessments.map((assessment) => (
          <Card key={assessment.id} elevation={2}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Typography variant="h6" component="h2">
                  {assessment.title}
                </Typography>
                <Chip
                  label={getJobTitle(assessment.jobId)}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>

              <Stack spacing={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <QuizIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {assessment.questions.length} questions
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <TimeIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Time limit: {formatTime(assessment.timeLimit)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                    Question Types:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {Array.from(new Set(assessment.questions.map(q => q.type))).map((type) => (
                      <Chip
                        key={type}
                        label={type === 'multiple-choice' ? 'Multiple Choice' : 'Text'}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Responses: {assessment.candidateResponses.length}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>

            <CardActions>
              <IconButton
                size="small"
                onClick={() => handleEditAssessment(assessment)}
                title="Edit Assessment"
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handlePreviewAssessment(assessment)}
                title="Preview Assessment"
              >
                <PreviewIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleDeleteAssessment(assessment.id)}
                title="Delete Assessment"
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </Box>

      {assessments.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No assessments found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create your first assessment to get started
          </Typography>
        </Box>
      )}

      {/* Assessment Builder Dialog */}
      <Dialog
        open={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { height: '90vh' }
        }}
      >
        <DialogTitle>
          {editingAssessment ? 'Edit Assessment' : 'Create New Assessment'}
        </DialogTitle>
        <DialogContent>
          <AssessmentBuilder
            assessment={editingAssessment}
            jobs={jobs}
            onSave={handleAssessmentSaved}
            onCancel={() => setIsBuilderOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Assessment Preview Dialog */}
      <Dialog
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { height: '90vh' }
        }}
      >
        <DialogTitle>
          Assessment Preview
        </DialogTitle>
        <DialogContent>
          {previewAssessment && (
            <AssessmentPreview
              assessment={previewAssessment}
              onClose={() => setIsPreviewOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AssessmentsBoard;
