import { http, HttpResponse } from 'msw'
import { Job, Candidate, Assessment, Question, CandidateResponse } from '../types'

// Mock data
const jobs: Job[] = [
  {
    id: 1,
    title: 'Frontend Developer',
    department: 'Engineering',
    status: 'active',
    archived: false,
    description: 'Looking for a React developer with 3+ years experience',
    requirements: ['React', 'TypeScript', 'CSS'],
    location: 'San Francisco'
  },
  {
    id: 2,
    title: 'Backend Developer',
    department: 'Engineering', 
    status: 'active',
    archived: false,
    description: 'Node.js backend developer needed',
    requirements: ['Node.js', 'Express', 'MongoDB'],
    location: 'New York'
  },
  {
    id: 3,
    title: 'UX Designer',
    department: 'Design',
    status: 'active', 
    archived: false,
    description: 'Senior UX designer for mobile apps',
    requirements: ['Figma', 'Design Systems', 'User Research'],
    location: 'Remote'
  }
]

const candidates: Candidate[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '555-1234',
    status: 'active',
    archived: false,
    appliedJobs: [1],
    stage: 'screening',
    skills: ['React', 'JavaScript', 'CSS'],
    experience: '3 years'
  },
  {
    id: 2,
    name: 'Jane Smith', 
    email: 'jane@example.com',
    phone: '555-5678',
    status: 'active',
    archived: false,
    appliedJobs: [2],
    stage: 'interview',
    skills: ['Node.js', 'Python', 'SQL'],
    experience: '5 years'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com', 
    phone: '555-9012',
    status: 'active',
    archived: false,
    appliedJobs: [3],
    stage: 'offer',
    skills: ['UI/UX', 'Figma', 'Prototyping'],
    experience: '4 years'
  }
]

const assessments: Assessment[] = [
  {
    id: 1,
    jobId: 1,
    title: 'Frontend Skills Assessment',
    questions: [
      { id: 1, question: 'What is React?', type: 'multiple-choice', options: ['Library', 'Framework', 'Language', 'Tool'], correctAnswer: 'Library' },
      { id: 2, question: 'Explain closures in JavaScript', type: 'text', correctAnswer: '' }
    ],
    timeLimit: 60,
    candidateResponses: []
  },
  {
    id: 2,
    jobId: 2,
    title: 'Backend Development Test',
    questions: [
      { id: 1, question: 'What is REST API?', type: 'multiple-choice', options: ['Protocol', 'Architecture', 'Framework', 'Database'], correctAnswer: 'Architecture' },
      { id: 2, question: 'Explain database normalization', type: 'text', correctAnswer: '' }
    ],
    timeLimit: 90,
    candidateResponses: []
  }
]

export const handlers = [
  // Jobs endpoints
  http.get('/api/jobs', ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get('search')
    const status = url.searchParams.get('status') 
    const department = url.searchParams.get('department')
    
    let filteredJobs = jobs.filter(job => !job.archived)
    
    if (search) {
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.description.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    if (status && status !== 'all') {
      filteredJobs = filteredJobs.filter(job => job.status === status)
    }
    
    if (department && department !== 'all') {
      filteredJobs = filteredJobs.filter(job => job.department === department)
    }
    
    return HttpResponse.json(filteredJobs)
  }),

  http.post('/api/jobs', async ({ request }) => {
    const newJob = await request.json() as Partial<Job>
    const job: Job = { 
      ...newJob as Job, 
      id: jobs.length + 1, 
      archived: false 
    }
    jobs.push(job)
    return HttpResponse.json(job)
  }),

  http.put('/api/jobs/:id', async ({ params, request }) => {
    const id = parseInt(params.id as string)
    const updates = await request.json() as Partial<Job>
    const jobIndex = jobs.findIndex(job => job.id === id)
    
    if (jobIndex !== -1) {
      jobs[jobIndex] = { ...jobs[jobIndex], ...updates }
      return HttpResponse.json(jobs[jobIndex])
    }
    
    return new HttpResponse(null, { status: 404 })
  }),

  // Candidates endpoints
  http.get('/api/candidates', ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get('search')
    const stage = url.searchParams.get('stage')
    const jobId = url.searchParams.get('jobId')
    
    let filteredCandidates = candidates.filter(candidate => !candidate.archived)
    
    if (search) {
      filteredCandidates = filteredCandidates.filter(candidate =>
        candidate.name.toLowerCase().includes(search.toLowerCase()) ||
        candidate.email.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    if (stage && stage !== 'all') {
      filteredCandidates = filteredCandidates.filter(candidate => candidate.stage === stage)
    }
    
    if (jobId) {
      filteredCandidates = filteredCandidates.filter(candidate =>
        candidate.appliedJobs.includes(parseInt(jobId))
      )
    }
    
    return HttpResponse.json(filteredCandidates)
  }),

  http.post('/api/candidates', async ({ request }) => {
    const newCandidate = await request.json() as Partial<Candidate>
    const candidate: Candidate = { 
      ...newCandidate as Candidate, 
      id: candidates.length + 1, 
      archived: false 
    }
    candidates.push(candidate)
    return HttpResponse.json(candidate)
  }),

  http.put('/api/candidates/:id', async ({ params, request }) => {
    const id = parseInt(params.id as string)
    const updates = await request.json() as Partial<Candidate>
    const candidateIndex = candidates.findIndex(candidate => candidate.id === id)
    
    if (candidateIndex !== -1) {
      candidates[candidateIndex] = { ...candidates[candidateIndex], ...updates }
      return HttpResponse.json(candidates[candidateIndex])
    }
    
    return new HttpResponse(null, { status: 404 })
  }),

  // Assessments endpoints
  http.get('/api/assessments', ({ request }) => {
    const url = new URL(request.url)
    const jobId = url.searchParams.get('jobId')
    
    let filteredAssessments = assessments
    
    if (jobId) {
      filteredAssessments = assessments.filter(assessment => assessment.jobId === parseInt(jobId))
    }
    
    return HttpResponse.json(filteredAssessments)
  }),

  http.post('/api/assessments', async ({ request }) => {
    const newAssessment = await request.json() as Partial<Assessment>
    const assessment: Assessment = { 
      ...newAssessment as Assessment, 
      id: assessments.length + 1, 
      candidateResponses: [] 
    }
    assessments.push(assessment)
    return HttpResponse.json(assessment)
  }),

  http.put('/api/assessments/:id', async ({ params, request }) => {
    const id = parseInt(params.id as string)
    const updates = await request.json() as Partial<Assessment>
    const assessmentIndex = assessments.findIndex(assessment => assessment.id === id)
    
    if (assessmentIndex !== -1) {
      assessments[assessmentIndex] = { ...assessments[assessmentIndex], ...updates }
      return HttpResponse.json(assessments[assessmentIndex])
    }
    
    return new HttpResponse(null, { status: 404 })
  }),

  http.post('/api/assessments/:id/submit', async ({ params, request }) => {
    const id = parseInt(params.id as string)
    const response = await request.json() as CandidateResponse
    const assessmentIndex = assessments.findIndex(assessment => assessment.id === id)
    
    if (assessmentIndex !== -1) {
      assessments[assessmentIndex].candidateResponses.push(response)
      return HttpResponse.json({ success: true })
    }
    
    return new HttpResponse(null, { status: 404 })
  })
]
