import type { AlertProps } from '@mui/material/Alert';

export interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export interface PageLayoutProps {
  children: React.ReactNode;
}

export interface HeaderProps {
  onMobileMenuClick: () => void;
}

export interface AlertMessageProps {
  severity: AlertProps['severity'];
  message: string;
  sx?: object;
}
