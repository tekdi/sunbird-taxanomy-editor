import React, { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useChannelStore } from "@/store/channelStore";
import ChannelItem from "@/components/ui/channel/ChannelItem";
import FilterPopover from "@/components/ui/FilterPopover";
import { normalizeChannels, filterChannels } from "@/lib/channel";
import SearchBar from "@/components/ui/SearchBar";

const ChannelsPage: React.FC = () => {
  const { channels, loading, error, fetchChannels } = useChannelStore();
  const [search, setSearch] = useState("");
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  useEffect(() => {
    fetchChannels();
    // eslint-disable-next-line
  }, []);

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };
  const handleStatusChange = (status: string) => {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  // Normalize and filter channels using reusable utilities
  const mappedChannels = normalizeChannels(channels);
  const filteredChannels = filterChannels(
    mappedChannels,
    search,
    selectedStatus
  );

  return (
    <PageLayout>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          alignItems={{ md: "center" }}
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
              Channels
            </Typography>
            <Typography color="text.secondary">
              Manage and create channels
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={Link}
            href="/channels/create"
            sx={{ minWidth: 180, fontWeight: 600, fontSize: 16 }}
          >
            Create Channel
          </Button>
        </Box>
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          gap={2}
          alignItems={{ md: "center" }}
        >
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search channels..."
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
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={handleFilterClose}
              selectedStatus={selectedStatus}
              onStatusChange={handleStatusChange}
              statusOptions={["Live", "Draft"]}
            />
          </Box>
        </Box>
        <Card
          sx={{
            mt: 2,
            p: 0,
            borderRadius: 3,
            boxShadow: "0px 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          {loading ? (
            <Box sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>
              Loading...
            </Box>
          ) : error ? (
            <Box sx={{ p: 4, textAlign: "center", color: "error.main" }}>
              {error}
            </Box>
          ) : filteredChannels.length === 0 ? (
            <Box sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>
              No channels found.
            </Box>
          ) : (
            filteredChannels.map((channel) => (
              <ChannelItem key={channel.identifier} channel={channel} />
            ))
          )}
        </Card>
      </Box>
    </PageLayout>
  );
};

export default ChannelsPage;
