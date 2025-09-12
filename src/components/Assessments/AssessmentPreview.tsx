import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Stack,
  LinearProgress,
  Chip,
  Divider,
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  Quiz as QuizIcon,
} from '@mui/icons-material';
import { Assessment } from '../../types';

interface AssessmentPreviewProps {
  assessment: Assessment;
  onClose: () => void;
}

const AssessmentPreview: React.FC<AssessmentPreviewProps> = ({ assessment, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [timeRemaining, setTimeRemaining] = useState(assessment.timeLimit * 60); // Convert to seconds

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestion(index);
  };

  const nextQuestion = () => {
    if (currentQuestion < assessment.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const submitAssessment = () => {
    alert(`Assessment Preview Complete!\n\nAnswered: ${Object.keys(answers).length}/${assessment.questions.length} questions`);
    onClose();
  };

  const progress = ((currentQuestion + 1) / assessment.questions.length) * 100;
  const question = assessment.questions[currentQuestion];

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
        <Typography variant="h5" gutterBottom>
          {assessment.title}
        </Typography>
        
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <QuizIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {assessment.questions.length} questions
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center" gap={1}>
            <TimeIcon fontSize="small" color="action" />
            <Typography 
              variant="body2" 
              color={timeRemaining < 300 ? "error" : "text.secondary"}
              sx={{ fontWeight: timeRemaining < 300 ? 'bold' : 'normal' }}
            >
              {formatTime(timeRemaining)}
            </Typography>
          </Box>
        </Stack>

        <Box mb={2}>
          <Typography variant="caption" color="text.secondary" gutterBottom>
            Progress: {currentQuestion + 1} of {assessment.questions.length}
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        {/* Question Navigation */}
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {assessment.questions.map((_, index) => (
            <Chip
              key={index}
              label={index + 1}
              size="small"
              onClick={() => goToQuestion(index)}
              color={index === currentQuestion ? "primary" : "default"}
              variant={answers[assessment.questions[index].id] ? "filled" : "outlined"}
              clickable
            />
          ))}
        </Stack>
      </Box>

      {/* Question Content */}
      <Card sx={{ flex: 1, mb: 3 }} elevation={2}>
        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" gutterBottom>
            Question {currentQuestion + 1}
          </Typography>
          
          <Typography variant="body1" paragraph>
            {question.question}
          </Typography>

          {question.type === 'multiple-choice' && question.options && (
            <RadioGroup
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            >
              {question.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                  sx={{ mb: 1 }}
                />
              ))}
            </RadioGroup>
          )}

          {question.type === 'text' && (
            <TextField
              fullWidth
              multiline
              rows={6}
              placeholder="Enter your answer here..."
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              variant="outlined"
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          onClick={previousQuestion}
          disabled={currentQuestion === 0}
          variant="outlined"
        >
          Previous
        </Button>

        <Stack direction="row" spacing={1}>
          <Button onClick={onClose} variant="outlined">
            Close Preview
          </Button>
          
          {currentQuestion === assessment.questions.length - 1 ? (
            <Button 
              onClick={submitAssessment}
              variant="contained"
              color="success"
            >
              Submit Assessment
            </Button>
          ) : (
            <Button
              onClick={nextQuestion}
              variant="contained"
            >
              Next
            </Button>
          )}
        </Stack>
      </Box>

      {/* Assessment Info Panel */}
      <Divider sx={{ my: 2 }} />
      <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
          Preview Mode - This is how candidates will see the assessment
        </Typography>
        <Stack direction="row" spacing={2}>
          <Typography variant="caption">
            Answered: {Object.keys(answers).length}/{assessment.questions.length}
          </Typography>
          <Typography variant="caption">
            Time Limit: {assessment.timeLimit} minutes
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default AssessmentPreview;
