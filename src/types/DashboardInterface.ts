export interface StatCardProps {
  title: string;
  value: string;
  IconComponent: import('@mui/material/OverridableComponent').OverridableComponent<
    import('@mui/material/SvgIcon').SvgIconTypeMap
  >;
}

export interface RecentActivityItemProps {
  title: string;
  time: string;
  status: string;
  user: string;
  id?: string;
}

export interface RecentListProps<T> {
  title: string;
  loading: boolean;
  error?: string;
  items: T[];
  itemKey: (item: T) => string;
  itemToProps: (item: T) => RecentActivityItemProps;
  viewAllHref: string;
}
