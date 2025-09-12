import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getTabValue = () => {
    switch (location.pathname) {
      case '/jobs':
        return 0;
      case '/candidates':
        return 1;
      case '/assessments':
        return 2;
      default:
        return 0;
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        navigate('/jobs');
        break;
      case 1:
        navigate('/candidates');
        break;
      case 2:
        navigate('/assessments');
        break;
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            TALENTFLOW - Mini HR Management
          </Typography>
        </Toolbar>
        <Tabs
          value={getTabValue()}
          onChange={handleTabChange}
          sx={{
            backgroundColor: 'background.paper',
            color: 'text.primary',
            '& .MuiTabs-indicator': {
              backgroundColor: 'primary.main',
            },
          }}
          variant="fullWidth"
        >
          <Tab
            icon={<WorkIcon />}
            label="Jobs Board"
            sx={{
              minHeight: 64,
              '&.Mui-selected': {
                color: 'primary.main',
              },
            }}
          />
          <Tab
            icon={<PeopleIcon />}
            label="Candidates"
            sx={{
              minHeight: 64,
              '&.Mui-selected': {
                color: 'primary.main',
              },
            }}
          />
          <Tab
            icon={<AssignmentIcon />}
            label="Assessments"
            sx={{
              minHeight: 64,
              '&.Mui-selected': {
                color: 'primary.main',
              },
            }}
          />
        </Tabs>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
