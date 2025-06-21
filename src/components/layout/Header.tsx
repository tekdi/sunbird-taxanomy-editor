import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { HeaderProps } from '@/types/LayoutInterface';

const Header: React.FC<HeaderProps> = ({ onMobileMenuClick }) => {
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          minHeight: 56,
          px: 2,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {!isLgUp && (
          <IconButton
            edge="start"
            color="inherit"
            onClick={onMobileMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography
          variant="h6"
          noWrap
          sx={{ fontWeight: 600, color: 'primary.main' }}
        >
          Taxonomy Editor
        </Typography>
        <div />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
