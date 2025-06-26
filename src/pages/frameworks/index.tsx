import React, { useEffect, useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useFrameworksStore } from '@/store/frameworksStore';
import SearchBar from '@/components/SearchBar';
import FilterPopover from '@/components/FilterPopover';
import FrameworkItem from '@/components/framework/FrameworkItem';

// This page allows users to view, search, and filter frameworks.
// It fetches frameworks from the store and displays them in a card layout.
const FrameworksPage: React.FC = () => {
  const { frameworks, loading, error, fetchFrameworks } = useFrameworksStore();
  const [search, setSearch] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);

  useEffect(() => {
    fetchFrameworks();
    // eslint-disable-next-line
  }, []);

  // Extract unique channels from frameworks for filtering
  // This ensures that the filter options are based on the available frameworks.
  const channels = Array.from(
    new Set(
      (frameworks || []).map((fw) => fw.channel).filter((c): c is string => !!c)
    )
  );

  // Handlers for search and filter functionality

  // This function handles the click event for the filter button, setting the anchor element for the popover.
  // It allows users to filter frameworks by channel.
  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };
  const handleChannelChange = (channel: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((ch) => ch !== channel)
        : [...prev, channel]
    );
  };

  // Filter frameworks based on search query and selected channels
  const filteredFrameworks = (frameworks || []).filter((framework) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      framework.name.toLowerCase().includes(q) ||
      framework.code.toLowerCase().includes(q);
    const matchesChannel =
      selectedChannels.length === 0 ||
      selectedChannels.includes(framework.channel ?? '');
    return matchesSearch && matchesChannel;
  });

  return (
    <PageLayout>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box
          display="flex"
          flexDirection={{ xs: 'column', md: 'row' }}
          alignItems={{ md: 'center' }}
          justifyContent="space-between"
          gap={2}
          mb={2}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={700}
              mb={0.5}
              color="text.primary"
            >
              Frameworks
            </Typography>
            <Typography color="text.secondary">
              Manage and create frameworks
            </Typography>
          </Box>
        </Box>
        <Box
          display="flex"
          flexDirection={{ xs: 'column', md: 'row' }}
          gap={2}
          alignItems={{ md: 'center' }}
        >
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search frameworks..."
            autoFocus
          />
          <Box>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={handleFilterClick}
              sx={{ minWidth: 100, fontWeight: 500 }}
            >
              Filter
            </Button>
            <FilterPopover
              open={Boolean(filterAnchorEl)}
              anchorEl={filterAnchorEl}
              onClose={handleFilterClose}
              selectedStatus={selectedChannels}
              onStatusChange={handleChannelChange}
              statusOptions={channels}
              filterTitle="Filter by Channel"
            />
          </Box>
        </Box>
        <Card
          sx={{
            mt: 2,
            p: 0,
            borderRadius: 3,
            boxShadow: '0px 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          {loading ? (
            <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
              Loading...
            </Box>
          ) : error ? (
            <Box sx={{ p: 4, textAlign: 'center', color: 'error.main' }}>
              {error}
            </Box>
          ) : filteredFrameworks.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
              No frameworks found.
            </Box>
          ) : (
            filteredFrameworks.map((framework) => (
              <FrameworkItem key={framework.identifier} framework={framework} />
            ))
          )}
        </Card>
      </Box>
    </PageLayout>
  );
};

export default FrameworksPage;
