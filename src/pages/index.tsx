import Head from "next/head";
import * as React from "react";
import PageLayout from "@/components/layout/PageLayout";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Link from "next/link";
import LayersIcon from "@mui/icons-material/Layers";
import DescriptionIcon from "@mui/icons-material/Description";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { grey, indigo, green } from "@mui/material/colors";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material/SvgIcon";
import { useFrameworksStore } from "@/store/frameworksStore";
import { useChannelStore } from "@/store/channelStore";

interface StatCardProps {
  title: string;
  value: string;
  IconComponent: OverridableComponent<SvgIconTypeMap>;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, IconComponent }) => (
  <Card elevation={1} sx={{ borderRadius: 3 }}>
    <CardContent sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h5" component="h2" fontWeight={700} mt={0.5}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            bgcolor: indigo[50],
            p: 1.5,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconComponent sx={{ color: indigo[600], fontSize: 20 }} />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

interface RecentActivityItemProps {
  title: string;
  time: string;
  status: string;
  user: string;
  id?: string;
}

const RecentActivityItem: React.FC<RecentActivityItemProps> = ({
  title,
  time,
  status,
  user,
  id,
}) => (
  <Box
    sx={{
      py: 1.5,
      borderBottom: 1,
      borderColor: "divider",
      "&:last-child": { borderBottom: 0 },
    }}
  >
    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
      <Box>
        <Typography variant="body1" fontWeight={500}>
          {id ? (
            <Link href={`/frameworks/${id}`} passHref legacyBehavior>
              <Typography
                component="a"
                color="text.primary"
                sx={{
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {title}
              </Typography>
            </Link>
          ) : (
            title
          )}
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          {user} • {time}
        </Typography>
      </Box>
      <Chip
        label={status}
        size="small"
        sx={{
          bgcolor: status === "Published" ? green[100] : grey[200],
          color: status === "Published" ? green[800] : grey[700],
          fontWeight: 600,
        }}
      />
    </Box>
  </Box>
);

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
  const sortedFrameworks = [...frameworks].sort((a, b) => {
    const dateA = a.lastUpdatedOn ? new Date(a.lastUpdatedOn).getTime() : 0;
    const dateB = b.lastUpdatedOn ? new Date(b.lastUpdatedOn).getTime() : 0;
    return dateB - dateA;
  });

  // Show up to 5 most recent
  const recentFrameworks = sortedFrameworks.slice(0, 5);

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
  // Helper to get lastUpdatedOn from channel
  function getChannelLastUpdatedOn(ch: {
    lastUpdatedOn?: string;
    extra?: Record<string, unknown>;
  }): string | undefined {
    if (typeof ch.lastUpdatedOn === "string" && ch.lastUpdatedOn)
      return ch.lastUpdatedOn;
    if (
      ch.extra &&
      typeof ch.extra.lastUpdatedOn === "string" &&
      ch.extra.lastUpdatedOn
    )
      return ch.extra.lastUpdatedOn;
    return undefined;
  }
  // Sort channels by lastUpdatedOn (descending)
  const sortedChannels = [...channels].sort((a, b) => {
    const dateA = getChannelLastUpdatedOn(a)
      ? new Date(getChannelLastUpdatedOn(a)!).getTime()
      : 0;
    const dateB = getChannelLastUpdatedOn(b)
      ? new Date(getChannelLastUpdatedOn(b)!).getTime()
      : 0;
    return dateB - dateA;
  });
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
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" component="h1" fontWeight={700}>
            Dashboard
          </Typography>
          <Link href="/frameworks/create" passHref legacyBehavior>
            <Button
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIcon />}
            >
              Create Framework
            </Button>
          </Link>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            mb: 4,
            "& > *": {
              flexGrow: 1,
              width: {
                xs: "100%",
                sm: "calc(50% - 12px)",
                md: "calc(25% - 18px)",
              },
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
          {/* Recent Frameworks Column */}
          <Card elevation={1} sx={{ borderRadius: 3, flex: 1 }}>
            <CardHeader
              title={
                <Typography variant="h6" fontWeight={600}>
                  Recent Frameworks
                </Typography>
              }
            />
            <CardContent sx={{ pt: 0 }}>
              {fwLoading ? (
                <Box
                  sx={{ textAlign: "center", py: 2, color: "text.secondary" }}
                >
                  Loading frameworks...
                </Box>
              ) : fwError ? (
                <Box sx={{ textAlign: "center", py: 2, color: "error.main" }}>
                  {fwError}
                </Box>
              ) : recentFrameworks.length === 0 ? (
                <Box
                  sx={{ textAlign: "center", py: 2, color: "text.secondary" }}
                >
                  No recent activity.
                </Box>
              ) : (
                <Box>
                  {recentFrameworks.map((fw) => (
                    <RecentActivityItem
                      key={fw.identifier}
                      id={fw.identifier}
                      title={fw.name}
                      time={
                        fw.lastUpdatedOn
                          ? new Date(fw.lastUpdatedOn).toLocaleString()
                          : "Unknown"
                      }
                      status={
                        fw.status && fw.status.toLowerCase() === "live"
                          ? "Published"
                          : "Draft"
                      }
                      user={fw.channel || "Unknown"}
                    />
                  ))}
                </Box>
              )}
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Link href="/frameworks" passHref legacyBehavior>
                  <Button variant="outlined" endIcon={<ArrowForwardIcon />}>
                    View All Frameworks
                  </Button>
                </Link>
              </Box>
            </CardContent>
          </Card>

          {/* Recent Channels Column */}
          <Card elevation={1} sx={{ borderRadius: 3, flex: 1 }}>
            <CardHeader
              title={
                <Typography variant="h6" fontWeight={600}>
                  Recent Channels
                </Typography>
              }
            />
            <CardContent sx={{ pt: 0 }}>
              {chLoading ? (
                <Box
                  sx={{ textAlign: "center", py: 2, color: "text.secondary" }}
                >
                  Loading channels...
                </Box>
              ) : chError ? (
                <Box sx={{ textAlign: "center", py: 2, color: "error.main" }}>
                  {chError}
                </Box>
              ) : recentChannels.length === 0 ? (
                <Box
                  sx={{ textAlign: "center", py: 2, color: "text.secondary" }}
                >
                  No recent activity.
                </Box>
              ) : (
                <Box>
                  {recentChannels.map((ch) => (
                    <RecentActivityItem
                      key={ch.identifier}
                      id={getChannelCode(ch)}
                      title={ch.name}
                      time={
                        getChannelLastUpdatedOn(ch)
                          ? new Date(
                              getChannelLastUpdatedOn(ch)!
                            ).toLocaleString()
                          : "Unknown"
                      }
                      status={
                        ch.status && ch.status.toLowerCase() === "live"
                          ? "Published"
                          : "Draft"
                      }
                      user={getChannelCode(ch)}
                    />
                  ))}
                </Box>
              )}
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Link href="/channels" passHref legacyBehavior>
                  <Button variant="outlined" endIcon={<ArrowForwardIcon />}>
                    View All Channels
                  </Button>
                </Link>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </PageLayout>
  );
};

export default DashboardPage;
