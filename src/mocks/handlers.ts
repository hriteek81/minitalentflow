import { http, HttpResponse } from 'msw'
import { Job, Candidate, Assessment, Question, CandidateResponse } from '../types'


// Seed 25 jobs
const jobs: Job[] = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  title: `Job ${i + 1}`,
  department: ["Engineering", "Design", "HR", "Marketing"][i % 4],
  status: ["active", "archived", "closed"][i % 3],
  archived: i % 3 === 1,
  description: `Description for job ${i + 1}`,
  requirements: ["Skill A", "Skill B", "Skill C", "Skill D"].slice(0, (i % 4) + 1),
  location: ["Remote", "San Francisco", "New York", "London"][i % 4]
}));

// Seed 1,000 candidates
const candidates: Candidate[] = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: `Candidate ${i + 1}`,
  email: `candidate${i + 1}@example.com`,
  phone: `555-${1000 + i}`,
  status: "active",
  archived: false,
  appliedJobs: [((i % 25) + 1)],
  stage: ["applied", "screening", "tech", "offer", "hired", "rejected"][i % 6],
  skills: ["Skill A", "Skill B", "Skill C", "Skill D"].slice(0, (i % 4) + 1),
  experience: `${(i % 10) + 1} years`
}));

// Seed 3 assessments with 10+ questions each
const assessments: Assessment[] = Array.from({ length: 3 }, (_, i) => ({
  id: i + 1,
  jobId: i + 1,
  title: `Assessment ${i + 1}`,
  questions: Array.from({ length: 12 }, (__, q) => ({
    id: q + 1,
    question: `Question ${q + 1} for Assessment ${i + 1}`,
    type: ["multiple-choice", "text", "numeric", "file-upload"][q % 4],
    options: q % 4 === 0 ? ["Option 1", "Option 2", "Option 3"] : undefined,
    correctAnswer: q % 4 === 0 ? "Option 1" : ""
  })),
  timeLimit: 60 + i * 30,
  candidateResponses: []
}));

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
    // Artificial latency
    await new Promise(res => setTimeout(res, Math.random() * 1000 + 200));
    // Error rate 7%
    if (Math.random() < 0.07) {
      return new HttpResponse('Server error', { status: 500 });
    }
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
    await new Promise(res => setTimeout(res, Math.random() * 1000 + 200));
    if (Math.random() < 0.07) {
      return new HttpResponse('Server error', { status: 500 });
    }
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
    await new Promise(res => setTimeout(res, Math.random() * 1000 + 200));
    if (Math.random() < 0.07) {
      return new HttpResponse('Server error', { status: 500 });
    }
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
    await new Promise(res => setTimeout(res, Math.random() * 1000 + 200));
    if (Math.random() < 0.07) {
      return new HttpResponse('Server error', { status: 500 });
    }
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
    await new Promise(res => setTimeout(res, Math.random() * 1000 + 200));
    if (Math.random() < 0.07) {
      return new HttpResponse('Server error', { status: 500 });
    }
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
    await new Promise(res => setTimeout(res, Math.random() * 1000 + 200));
    if (Math.random() < 0.07) {
      return new HttpResponse('Server error', { status: 500 });
    }
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
    await new Promise(res => setTimeout(res, Math.random() * 1000 + 200));
    if (Math.random() < 0.07) {
      return new HttpResponse('Server error', { status: 500 });
    }
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
