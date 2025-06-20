import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Chip from "@mui/material/Chip";
import { grey, green } from "@mui/material/colors";
import { RecentActivityItemProps, RecentListProps } from "@/types/dashboard";

// Inline RecentActivityItem as a subcomponent
const InlineRecentActivityItem: React.FC<RecentActivityItemProps> = ({
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
        <Typography variant="body1" fontWeight={500} color="text.primary">
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

function RecentList<T>({
  title,
  loading,
  error,
  items,
  itemKey,
  itemToProps,
  viewAllHref,
}: RecentListProps<T>) {
  return (
    <Card elevation={1} sx={{ borderRadius: 3, flex: 1, minWidth: 0 }}>
      <Box sx={{ p: 3, pb: 0 }}>
        <Typography variant="h6" fontWeight={600} color="text.primary">
          {title}
        </Typography>
      </Box>
      <CardContent sx={{ pt: 0 }}>
        {loading ? (
          <Box sx={{ textAlign: "center", py: 2, color: "text.secondary" }}>
            Loading {title.toLowerCase()}...
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: "center", py: 2, color: "error.main" }}>
            {error}
          </Box>
        ) : items.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 2, color: "text.secondary" }}>
            No recent activity.
          </Box>
        ) : (
          <Box>
            {items.map((item) => (
              <InlineRecentActivityItem
                key={itemKey(item)}
                {...itemToProps(item)}
              />
            ))}
          </Box>
        )}
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Link href={viewAllHref} passHref legacyBehavior>
            <Button variant="outlined" endIcon={<ArrowForwardIcon />}>
              View All {title}
            </Button>
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
}

export default RecentList;
