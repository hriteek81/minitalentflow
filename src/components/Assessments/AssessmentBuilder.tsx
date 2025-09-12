import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Stack,
  Divider,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
} from '@mui/icons-material';
import { Assessment, Question } from '../../types';

interface AssessmentBuilderProps {
  assessment?: Assessment | null;
  jobs: any[];
  onSave: () => void;
  onCancel: () => void;
}

const AssessmentBuilder: React.FC<AssessmentBuilderProps> = ({
  assessment,
  jobs,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    jobId: '',
    timeLimit: 60,
    questions: [] as Question[],
  });

  useEffect(() => {
    if (assessment) {
      setFormData({
        title: assessment.title,
        jobId: assessment.jobId.toString(),
        timeLimit: assessment.timeLimit,
        questions: [...assessment.questions],
      });
    }
  }, [assessment]);

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

  const addQuestion = (type: 'multiple-choice' | 'text') => {
    const newQuestion: Question = {
      id: Date.now(), // Simple ID generation
      question: '',
      type,
      options: type === 'multiple-choice' ? ['', '', '', ''] : undefined,
      correctAnswer: '',
    };

    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, ...updates } : q
      ),
    }));
  };

  const removeQuestion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => {
        if (i === questionIndex && q.options) {
          const newOptions = [...q.options];
          newOptions[optionIndex] = value;
          return { ...q, options: newOptions };
        }
        return q;
      }),
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      const url = assessment ? `/api/assessments/${assessment.id}` : '/api/assessments';
      const method = assessment ? 'PUT' : 'POST';
      
      const payload = {
        ...formData,
        jobId: parseInt(formData.jobId),
        timeLimit: parseInt(formData.timeLimit.toString()),
      };
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        onSave();
      }
    } catch (error) {
      console.error('Error saving assessment:', error);
    }
  };

  const QuestionCard: React.FC<{ question: Question; index: number }> = ({ 
    question, 
    index 
  }) => (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Stack spacing={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <DragIcon color="action" />
            <Typography variant="subtitle2">
              Question {index + 1}
            </Typography>
            <Chip 
              label={question.type === 'multiple-choice' ? 'Multiple Choice' : 'Text'}
              size="small"
              variant="outlined"
            />
          </Box>
          
          <TextField
            fullWidth
            label="Question"
            multiline
            rows={2}
            value={question.question}
            onChange={(e) => updateQuestion(index, { question: e.target.value })}
            placeholder="Enter your question here..."
          />

          {question.type === 'multiple-choice' && question.options && (
            <Box>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                Options (select the correct answer):
              </Typography>
              <Stack spacing={1}>
                {question.options.map((option, optionIndex) => (
                  <Box key={optionIndex} display="flex" gap={1} alignItems="center">
                    <TextField
                      fullWidth
                      size="small"
                      label={`Option ${optionIndex + 1}`}
                      value={option}
                      onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                    />
                    <Button
                      variant={question.correctAnswer === option && option ? "contained" : "outlined"}
                      size="small"
                      onClick={() => updateQuestion(index, { correctAnswer: option })}
                      disabled={!option}
                    >
                      Correct
                    </Button>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {question.type === 'text' && (
            <TextField
              fullWidth
              label="Sample Answer (optional)"
              multiline
              rows={2}
              value={question.correctAnswer}
              onChange={(e) => updateQuestion(index, { correctAnswer: e.target.value })}
              placeholder="Provide a sample correct answer or key points..."
            />
          )}
        </Stack>
      </CardContent>
      
      <CardActions>
        <IconButton
          size="small"
          onClick={() => removeQuestion(index)}
          color="error"
          title="Delete Question"
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2, height: '100%' }}>
      <Stack spacing={3} sx={{ height: '100%' }}>
        {/* Assessment Details */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Assessment Details
          </Typography>
          <Stack spacing={2}>
            <TextField
              required
              fullWidth
              label="Assessment Title"
              value={formData.title}
              onChange={handleInputChange('title')}
              placeholder="e.g., Frontend Developer Skills Test"
            />
            
            <Box display="flex" gap={2}>
              <FormControl required sx={{ flex: 1 }}>
                <InputLabel>Job Position</InputLabel>
                <Select
                  value={formData.jobId}
                  label="Job Position"
                  onChange={handleSelectChange('jobId')}
                >
                  {jobs.map((job) => (
                    <MenuItem key={job.id} value={job.id.toString()}>
                      {job.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                required
                label="Time Limit (minutes)"
                type="number"
                value={formData.timeLimit}
                onChange={handleInputChange('timeLimit')}
                inputProps={{ min: 5, max: 180 }}
                sx={{ width: 200 }}
              />
            </Box>
          </Stack>
        </Box>

        <Divider />

        {/* Questions Section */}
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Questions ({formData.questions.length})
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => addQuestion('multiple-choice')}
              >
                Multiple Choice
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => addQuestion('text')}
              >
                Text Question
              </Button>
            </Stack>
          </Box>

          {formData.questions.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                No questions added yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click the buttons above to add multiple choice or text questions
              </Typography>
            </Box>
          ) : (
            formData.questions.map((question, index) => (
              <QuestionCard 
                key={question.id} 
                question={question} 
                index={index} 
              />
            ))
          )}
        </Box>

        <Divider />

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={!formData.title || !formData.jobId || formData.questions.length === 0}
          >
            {assessment ? 'Update' : 'Create'} Assessment
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AssessmentBuilder;
