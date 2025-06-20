import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
  },
  palette: {
    primary: { main: "#6366f1" }, // indigo-500 for primary
    secondary: { main: "#a78bfa" }, // indigo-300 for secondary
    background: {
      default: "#f8fafc", // slate-50
      paper: "#fff",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
          fontSize: "1rem",
          boxShadow: "none",
        },
        containedPrimary: {
          backgroundColor: "#6366f1",
          "&:hover": { backgroundColor: "#4f46e5" },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontSize: "0.75rem",
          height: 20,
          minWidth: 20,
          backgroundColor: "#f1f5f9",
          color: "#6366f1",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0px 2px 8px rgba(0,0,0,0.06)",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: "#f5f5f5",
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        root: {
          // Modal overlay and content styling
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          padding: "8px 12px",
        },
      },
    },
  },
});

export default theme;
