import Head from "next/head";
import * as React from "react";
import PageLayout from "@/components/layout/PageLayout";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";
import LayersIcon from "@mui/icons-material/Layers";
import DescriptionIcon from "@mui/icons-material/Description";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useFrameworksStore } from "@/store/frameworksStore";
import { useChannelStore } from "@/store/channelStore";
import {
  getChannelCode,
  getChannelLastUpdatedOn,
  sortFrameworksByLastUpdated,
  sortChannelsByLastUpdated,
} from "@/lib/dashboard";
import RecentList from "@/components/ui/dashboard/RecentList";
import StatCard from "@/components/ui/dashboard/StatCard";

const DashboardPage: React.FC = () => {
  const {
    frameworks,
    loading: fwLoading,
    error: fwError,
    fetchFrameworks,
  } = useFrameworksStore();
  const {
    channels,
    loading: chLoading,
    error: chError,
    fetchChannels,
  } = useChannelStore();

  React.useEffect(() => {
    fetchFrameworks();
    fetchChannels();
    // eslint-disable-next-line
  }, []);

  const masterCategories = 12;
  const totalCategories = 48;
  const terms = 320;

  // Sort frameworks by lastUpdatedOn (descending)
  const sortedFrameworks = sortFrameworksByLastUpdated(frameworks);

  // Show up to 5 most recent
  const recentFrameworks = sortedFrameworks.slice(0, 5);

  // Sort channels by lastUpdatedOn (descending)
  const sortedChannels = sortChannelsByLastUpdated(channels);

  // Show up to 5 most recent
  const recentChannels = sortedChannels.slice(0, 5);

  return (
    <PageLayout>
      <Head>
        <title>Dashboard - Taxonomy Editor</title>
      </Head>
      <Box sx={{ py: 2 }}>
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent={{ xs: "flex-start", sm: "space-between" }}
          alignItems={{ xs: "stretch", sm: "center" }}
          gap={2}
          mb={3}
        >
          <Typography
            variant="h4"
            component="h1"
            fontWeight={700}
            color="text.primary"
            sx={{ mb: { xs: 1, sm: 0 } }}
          >
            Dashboard
          </Typography>
          <Link href="/frameworks/create" passHref legacyBehavior>
            <Button
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              sx={{ width: { xs: "100%", sm: "auto" }, fontWeight: 600 }}
            >
              Create Framework
            </Button>
          </Link>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            flexWrap: { xs: "nowrap", sm: "wrap" },
            gap: 3,
            mb: 4,
            "& > *": {
              width: {
                xs: "100%",
                sm: "calc(50% - 12px)",
                md: "calc(25% - 18px)",
              },
              minWidth: 0,
            },
          }}
        >
          <StatCard
            title="Total Frameworks"
            value={frameworks.length.toString()}
            IconComponent={LayersIcon}
          />
          <StatCard
            title="Master Categories"
            value={masterCategories.toString()}
            IconComponent={LayersIcon}
          />
          <StatCard
            title="Total Categories"
            value={totalCategories.toString()}
            IconComponent={DescriptionIcon}
          />
          <StatCard
            title="Terms"
            value={terms.toString()}
            IconComponent={DescriptionIcon}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          <RecentList
            title="Recent Frameworks"
            loading={fwLoading}
            error={fwError || undefined}
            items={recentFrameworks}
            itemKey={(fw) => fw.identifier}
            itemToProps={(fw) => ({
              id: fw.identifier,
              title: fw.name,
              time: fw.lastUpdatedOn
                ? new Date(fw.lastUpdatedOn).toLocaleString()
                : "Unknown",
              status:
                fw.status && fw.status.toLowerCase() === "live"
                  ? "Published"
                  : "Draft",
              user: fw.channel || "Unknown",
            })}
            viewAllHref="/frameworks"
          />
          <RecentList
            title="Recent Channels"
            loading={chLoading}
            error={chError || undefined}
            items={recentChannels}
            itemKey={(ch) => ch.identifier}
            itemToProps={(ch) => ({
              id: getChannelCode(ch),
              title: ch.name,
              time: getChannelLastUpdatedOn(ch)
                ? new Date(getChannelLastUpdatedOn(ch)!).toLocaleString()
                : "Unknown",
              status:
                ch.status && ch.status.toLowerCase() === "live"
                  ? "Published"
                  : "Draft",
              user: getChannelCode(ch),
            })}
            viewAllHref="/channels"
          />
        </Box>
      </Box>
    </PageLayout>
  );
};

export default DashboardPage;
