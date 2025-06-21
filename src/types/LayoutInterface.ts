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
