import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LayersIcon from '@mui/icons-material/Layers';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SidebarProps } from '@/interfaces/LayoutInterface';

// Define the width of the sidebar drawer
const drawerWidth = 260;

// This component renders the sidebar for the application.
// It includes navigation links for Dashboard, Channels, and Frameworks.
const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onMobileClose }) => {
  const router = useRouter();
  const [openFrameworks, setOpenFrameworks] = React.useState(true);
  const [openChannels, setOpenChannels] = React.useState(true);

  const handleFrameworksClick = () => setOpenFrameworks((prev) => !prev);
  const handleChannelsClick = () => setOpenChannels((prev) => !prev);

  const isActive = (href: string) => router.pathname === href;

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: 56,
          px: 2,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <LayersIcon sx={{ color: 'primary.main', mr: 1 }} />
        <Typography variant="h6" fontWeight={600} color="primary.main">
          Taxonomy Editor
        </Typography>
      </Box>
      <List sx={{ pt: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            component={NextLink}
            href="/"
            selected={isActive('/')}
            onClick={onMobileClose}
          >
            <ListItemIcon>
              <DashboardIcon color={isActive('/') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItemButton onClick={handleChannelsClick} sx={{ mt: 1 }}>
          <ListItemIcon>
            <LayersIcon color={openChannels ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText primary="Channels" />
          {openChannels ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openChannels} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 4 }}>
            <ListItem disablePadding>
              <ListItemButton
                component={NextLink}
                href="/channels/create"
                selected={isActive('/channels/create')}
                onClick={onMobileClose}
              >
                <ListItemText primary="Create New Channel" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={NextLink}
                href="/channels"
                selected={isActive('/channels')}
                onClick={onMobileClose}
              >
                <ListItemText primary="View All Channels" />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>
        <ListItemButton onClick={handleFrameworksClick} sx={{ mt: 1 }}>
          <ListItemIcon>
            <LayersIcon color={openFrameworks ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText primary="Frameworks" />
          {openFrameworks ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openFrameworks} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 4 }}>
            <ListItem disablePadding>
              <ListItemButton
                component={NextLink}
                href="/frameworks/create"
                selected={isActive('/frameworks/create')}
                onClick={onMobileClose}
              >
                <ListItemText primary="Create New Framework" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={NextLink}
                href="/frameworks"
                selected={isActive('/frameworks')}
                onClick={onMobileClose}
              >
                <ListItemText primary="View All Frameworks" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={NextLink}
                href="/frameworks/manage"
                selected={isActive('/frameworks/manage')}
                onClick={onMobileClose}
              >
                <ListItemText primary="Manage Taxonomy" />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>
      </List>
      <Box sx={{ flexGrow: 1 }} />
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {drawerContent}
      </Drawer>
      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', lg: 'block' },
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
