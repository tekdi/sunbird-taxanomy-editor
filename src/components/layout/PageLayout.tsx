import React from 'react';
import Box from '@mui/material/Box';
import Header from './Header';
import Sidebar from './Sidebar';
import { PageLayoutProps } from '@/interfaces/LayoutInterface';

// This component serves as the main layout for the application.
// It includes a sidebar for navigation and a header for the title and mobile menu toggle.
// The layout is responsive, adjusting the sidebar visibility based on the screen size.
// It accepts children components to render within the main content area.

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const drawerWidth = 260; // Import or define drawerWidth here

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          ml: { lg: `${drawerWidth}px` }, // Add marginLeft for desktop sidebar
        }}
      >
        <Header onMobileMenuClick={handleDrawerToggle} />
        <Box
          component="main"
          sx={{ flex: 1, p: { xs: 2, md: 3 }, overflowY: 'auto' }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default PageLayout;
