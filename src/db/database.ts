import Dexie, { Table } from 'dexie';
import { Job, Candidate, Assessment } from '../types';

export class TalentFlowDatabase extends Dexie {
  jobs!: Table<Job>;
  candidates!: Table<Candidate>;
  assessments!: Table<Assessment>;

  constructor() {
    super('TalentFlowDatabase');
    
    this.version(1).stores({
      jobs: '++id, title, department, status, archived',
      candidates: '++id, name, email, stage, status, archived, *appliedJobs',
      assessments: '++id, jobId, title'
    });
  }
}

export const db = new TalentFlowDatabase();

// Initialize database with sample data if empty
export const initializeDatabase = async () => {
  const jobCount = await db.jobs.count();
  
  if (jobCount === 0) {
    // Initial jobs data
    await db.jobs.bulkAdd([
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
    ]);

    // Initial candidates data
    await db.candidates.bulkAdd([
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
    ]);

    // Initial assessments data
    await db.assessments.bulkAdd([
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
    ]);

    console.log('Database initialized with sample data');
  }
};
