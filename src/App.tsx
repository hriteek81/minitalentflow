import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';

import { initializeDatabase } from './db/database';
import Layout from './components/Layout';
import JobsBoard from './components/Jobs/JobsBoard';
import CandidatesBoard from './components/Candidates/SimpleCandidatesBoard';
import AssessmentsBoard from './components/Assessments/AssessmentsBoard';

// Create MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
});

function App() {
  useEffect(() => {
    // Initialize MSW and database
    const initApp = async () => {
      if (process.env.NODE_ENV === 'development') {
        const { worker } = await import('./mocks/browser');
        await worker.start();
      }
      
      await initializeDatabase();
    };
    
    initApp();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/jobs" replace />} />
            <Route path="/jobs" element={<JobsBoard />} />
            <Route path="/candidates" element={<CandidatesBoard />} />
            <Route path="/assessments" element={<AssessmentsBoard />} />
            <Route path="*" element={<Navigate to="/jobs" replace />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
