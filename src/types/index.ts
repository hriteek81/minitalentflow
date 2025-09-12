export interface Job {
  id: number;
  title: string;
  department: string;
  status: 'active' | 'inactive' | 'closed';
  archived: boolean;
  description: string;
  requirements: string[];
  location: string;
}

export interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  archived: boolean;
  appliedJobs: number[];
  stage: 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  skills: string[];
  experience: string;
}

export interface Question {
  id: number;
  question: string;
  type: 'multiple-choice' | 'text';
  options?: string[];
  correctAnswer: string;
}

export interface Assessment {
  id: number;
  jobId: number;
  title: string;
  questions: Question[];
  timeLimit: number;
  candidateResponses: CandidateResponse[];
}

export interface CandidateResponse {
  candidateId: number;
  responses: { questionId: number; answer: string }[];
  submittedAt: Date;
  score?: number;
}

export interface FilterOptions {
  search?: string;
  status?: string;
  department?: string;
  stage?: string;
  jobId?: string;
}
