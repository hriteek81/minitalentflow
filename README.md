# TALENTFLOW - Mini HR Management System

A comprehensive React-based HR management application designed to streamline job postings, candidate management, and assessment processes.

![TALENTFLOW](https://img.shields.io/badge/TALENTFLOW-HR%20Management-blue)
![React](https://img.shields.io/badge/React-18.x-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Material-UI](https://img.shields.io/badge/Material--UI-5.x-blue)

## 🚀 Features

### 1. Jobs Board
- **Create, edit, and archive job postings**
- **Advanced search and filtering** by title, description, status, and department
- **Job requirements management** with dynamic tags
- **Status tracking** (Active, Inactive, Closed)
- **Responsive card-based layout** with hover effects

### 2. Candidates Management
- **Comprehensive candidate profiles** with contact information
- **Skills and experience tracking**
- **Stage-based pipeline** (Screening → Interview → Offer → Hired/Rejected)
- **Search and filter candidates** by name, email, and stage
- **Visual candidate cards** with avatars and skill chips

### 3. Assessment System
- **Interactive assessment builder** with drag-and-drop question ordering
- **Multiple question types:**
  - Multiple choice questions with correct answer marking
  - Text-based questions for detailed responses
- **Time-limited assessments** with live countdown timer
- **Assessment preview mode** with candidate-like interface
- **Progress tracking** and question navigation
- **Response collection and management**

### 4. Technical Features
- **Mock Service Worker (MSW)** for API simulation
- **IndexedDB integration** with Dexie for local data storage
- **TypeScript** for enhanced type safety
- **Material-UI** for consistent design system
- **React Router** for seamless navigation
- **Responsive design** for all device sizes

## 🛠 Technology Stack

- **Frontend:** React 18.x with TypeScript
- **UI Framework:** Material-UI (MUI) 5.x
- **State Management:** React Hooks
- **API Mocking:** Mock Service Worker (MSW)
- **Local Storage:** IndexedDB with Dexie
- **Routing:** React Router v6
- **Build Tool:** Create React App
- **Package Manager:** npm

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd JobApplication/talentflow-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗 Project Structure

```
talentflow-app/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Layout.tsx                 # Main layout with navigation
│   │   ├── Jobs/
│   │   │   ├── JobsBoard.tsx         # Jobs listing and management
│   │   │   └── JobForm.tsx           # Job creation/editing form
│   │   ├── Candidates/
│   │   │   ├── SimpleCandidatesBoard.tsx  # Candidates management
│   │   │   └── CandidateForm.tsx     # Candidate creation/editing form
│   │   └── Assessments/
│   │       ├── AssessmentsBoard.tsx  # Assessment management
│   │       ├── AssessmentBuilder.tsx # Assessment creation tool
│   │       └── AssessmentPreview.tsx # Assessment preview mode
│   ├── mocks/
│   │   ├── handlers.ts               # MSW API handlers
│   │   └── browser.ts                # MSW browser setup
│   ├── db/
│   │   └── database.ts               # IndexedDB configuration
│   ├── types/
│   │   └── index.ts                  # TypeScript interfaces
│   ├── App.tsx                       # Main application component
│   └── index.tsx                     # Application entry point
├── package.json
└── README.md
```

## 🎯 Core Functionality

### Jobs Management
- **CRUD Operations:** Create, read, update, and archive job postings
- **Dynamic Filtering:** Real-time search by title/description, filter by status and department
- **Requirements Management:** Add/remove job requirements with visual chips
- **Status Management:** Track job status with color-coded indicators

### Candidates Pipeline
- **Profile Management:** Store comprehensive candidate information
- **Skills Tracking:** Tag-based skill management with visual indicators
- **Pipeline Stages:** Move candidates through hiring stages
- **Search & Filter:** Find candidates quickly with advanced filtering

### Assessment Builder
- **Question Types:** Support for multiple choice and text-based questions
- **Visual Builder:** Intuitive interface for creating assessments
- **Preview Mode:** Test assessments from candidate perspective
- **Time Management:** Configurable time limits with live countdown
- **Response Tracking:** Collect and manage candidate responses

## 🔧 API Endpoints (Mocked)

### Jobs
- `GET /api/jobs` - Fetch jobs with optional query parameters
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/:id` - Update existing job

### Candidates
- `GET /api/candidates` - Fetch candidates with optional filtering
- `POST /api/candidates` - Add new candidate
- `PUT /api/candidates/:id` - Update candidate information

### Assessments
- `GET /api/assessments` - Fetch assessments
- `POST /api/assessments` - Create new assessment
- `PUT /api/assessments/:id` - Update assessment
- `POST /api/assessments/:id/submit` - Submit assessment responses

## 📊 Data Models

### Job
```typescript
interface Job {
  id: number;
  title: string;
  department: string;
  status: 'active' | 'inactive' | 'closed';
  archived: boolean;
  description: string;
  requirements: string[];
  location: string;
}
```

### Candidate
```typescript
interface Candidate {
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
```

### Assessment
```typescript
interface Assessment {
  id: number;
  jobId: number;
  title: string;
  questions: Question[];
  timeLimit: number;
  candidateResponses: CandidateResponse[];
}
```

## 🎨 UI/UX Features

- **Material Design 3** principles with MUI components
- **Responsive grid layouts** that adapt to screen sizes
- **Interactive cards** with hover effects and smooth transitions
- **Color-coded status indicators** for quick visual recognition
- **Consistent typography** and spacing throughout the application
- **Accessible design** with proper ARIA labels and keyboard navigation

## 🔄 State Management

The application uses React's built-in state management with hooks:
- **useState** for component-level state
- **useEffect** for side effects and API calls
- **Context API** potential for global state (theme, user preferences)

## 💾 Data Persistence

- **IndexedDB** for client-side data storage using Dexie
- **Automatic data synchronization** between MSW and IndexedDB
- **Offline capability** for viewing and managing data

## 🚦 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App (irreversible)

## 🔮 Future Enhancements

### Planned Features
- **Drag-and-drop candidate pipeline** with react-beautiful-dnd
- **Advanced analytics dashboard** with charts and metrics
- **Email integration** for candidate communication
- **Calendar integration** for interview scheduling
- **Export functionality** for reports and candidate data
- **Multi-user support** with role-based access control
- **Real-time notifications** for application updates

### Technical Improvements
- **End-to-end testing** with Cypress
- **Unit test coverage** with React Testing Library
- **Progressive Web App** capabilities
- **Docker containerization** for deployment
- **CI/CD pipeline** integration

## 🐛 Known Issues

- Grid component TypeScript compatibility issues (warnings only, functionality intact)
- Drag-and-drop functionality temporarily disabled due to library compatibility
- Some ESLint warnings for unused imports in legacy components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support or questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ using React and Material-UI**
