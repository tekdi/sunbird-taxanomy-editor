import React, { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Popover from "@mui/material/Popover";
import Checkbox from "@mui/material/Checkbox";
import Stack from "@mui/material/Stack";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { formatDate } from "@/lib/utils";
import { green, grey } from "@mui/material/colors";
import { useChannelStore } from "@/store/channelStore";

interface Channel {
  identifier: string;
  name: string;
  code: string;
  status: string;
  lastUpdatedOn?: string;
}

const ChannelItem: React.FC<{ channel: Channel }> = ({ channel }) => (
  <Box
    sx={{
      p: 2,
      borderBottom: 1,
      borderColor: "divider",
      ":last-child": { borderBottom: 0 },
    }}
  >
    <Box
      display="flex"
      flexDirection={{ xs: "column", sm: "row" }}
      alignItems={{ sm: "center" }}
      justifyContent="space-between"
    >
      <Box>
        <Box display="flex" alignItems="center">
          <Typography variant="h6" fontWeight={600} color="text.primary">
            {channel.name}
          </Typography>
          <Chip
            label={
              channel.status?.toLowerCase() === "live" ? "Published" : "Draft"
            }
            size="small"
            sx={{
              ml: 2,
              bgcolor:
                channel.status?.toLowerCase() === "live"
                  ? green[100]
                  : grey[200],
              color:
                channel.status?.toLowerCase() === "live"
                  ? green[800]
                  : grey[700],
              fontWeight: 600,
            }}
          />
        </Box>
        <Typography variant="body2" color="text.primary" mt={0.5}>
          Code: {channel.code} • Last updated:{" "}
          {channel.lastUpdatedOn ? formatDate(channel.lastUpdatedOn) : "-"}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }}>
        {/* Add view/edit links if needed */}
      </Box>
    </Box>
  </Box>
);

// Helper to get code from channel
function getChannelCode(ch: {
  code?: string;
  extra?: Record<string, unknown>;
  identifier: string;
}): string {
  if (typeof ch.code === "string" && ch.code) return ch.code;
  if (ch.extra && typeof ch.extra.code === "string" && ch.extra.code)
    return ch.extra.code;
  return ch.identifier;
}

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

  // Map channels to ensure code property exists for filtering and rendering
  const mappedChannels = channels.map((ch) => ({
    ...ch,
    code: getChannelCode(ch),
  }));

  const filteredChannels = mappedChannels.filter((channel) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      (channel.name?.toLowerCase() || "").includes(q) ||
      (channel.code?.toLowerCase() || "").includes(q);
    const matchesStatus =
      selectedStatus.length === 0 || selectedStatus.includes(channel.status);
    return matchesSearch && matchesStatus;
  });

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
          <TextField
            type="search"
            placeholder="Search channels..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#6366f1" }} />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, minWidth: 240, bgcolor: "#fff" }}
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
            <Popover
              open={Boolean(filterAnchorEl)}
              anchorEl={filterAnchorEl}
              onClose={handleFilterClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              PaperProps={{ sx: { p: 2, width: 220 } }}
            >
              <Typography fontWeight={600} mb={1} color="text.primary">
                Filter by Status
              </Typography>
              <Stack direction="column" spacing={1}>
                {["Live", "Draft"].map((status) => (
                  <Box key={status} display="flex" alignItems="center">
                    <Checkbox
                      checked={selectedStatus.includes(status)}
                      onChange={() => handleStatusChange(status)}
                      sx={{ color: "#6366f1" }}
                    />
                    <Typography variant="body2" color="text.primary">
                      {status}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Popover>
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
