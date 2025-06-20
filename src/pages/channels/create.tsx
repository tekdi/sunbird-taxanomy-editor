import React, { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useRouter } from "next/router";

const CreateChannelPage: React.FC = () => {
  const [channel, setChannel] = useState({
    name: "",
    code: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!channel.name.trim() || !channel.code.trim()) {
      setError("Both Channel Name and Channel Code are required.");
      return;
    }
    setLoading(true);
    try {
      const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;
      const authToken = process.env.NEXT_PUBLIC_AUTH_TOKEN;
      const cookie = process.env.NEXT_PUBLIC_COOKIE;
      const interfaceUrl = process.env.NEXT_PUBLIC_INTERFACE_URL;
      if (!tenantId || !authToken || !cookie || !interfaceUrl) {
        throw new Error("Missing environment variables");
      }
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("tenantId", tenantId);
      myHeaders.append("Authorization", `Bearer ${authToken}`);
      myHeaders.append("Cookie", cookie);
      const raw = JSON.stringify({
        request: {
          channel: {
            name: channel.name,
            code: channel.code,
            description: channel.description,
          },
        },
      });
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow" as RequestRedirect,
      };
      const url = `${interfaceUrl}/action/channel/v3/create`;
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      if (!response.ok || data.responseCode !== "OK") {
        throw new Error(
          data?.params?.errmsg ||
            data?.params?.err ||
            `Error: ${response.status}`
        );
      }
      setSuccess("Channel created successfully!");
      setChannel({ name: "", code: "", description: "" });
      setTimeout(() => router.push("/channels"), 1000);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to create channel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <Box
        minHeight="80vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor="#f8fafc"
        py={4}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            maxWidth: 720,
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            border: "1px solid #f1f5f9",
            padding: 0,
          }}
        >
          {/* Header Section */}
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            px={4}
            pt={4}
            pb={1.5}
            borderBottom="1px solid #f1f5f9"
          >
            <Typography variant="h5" fontWeight={700} color="text.primary">
              Create New Channel
            </Typography>
          </Box>
          {/* Info Section */}
          <Box px={4} pt={2.5} pb={1.5}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              textTransform="uppercase"
              fontWeight={600}
              letterSpacing={1}
              mb={0.5}
            >
              Channel Information
            </Typography>
            <Typography color="text.secondary" mb={2}>
              Provide basic details about the channel you&apos;re creating.
            </Typography>
            <Box
              display="grid"
              gap={2}
              gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
            >
              <TextField
                label="Channel Name"
                value={channel.name}
                onChange={(e) =>
                  setChannel({ ...channel, name: e.target.value })
                }
                placeholder="e.g., Youthnet Channel"
                helperText="Name should be descriptive and unique"
                required
                fullWidth
              />
              <TextField
                label="Channel Code"
                value={channel.code}
                onChange={(e) =>
                  setChannel({ ...channel, code: e.target.value })
                }
                placeholder="e.g., youthnet-channel"
                helperText="Code must be unique and use hyphens"
                required
                fullWidth
              />
            </Box>
            <TextField
              label="Channel Description"
              value={channel.description}
              onChange={(e) =>
                setChannel({ ...channel, description: e.target.value })
              }
              placeholder="Describe the channel (optional)"
              helperText="A short description about the channel"
              multiline
              minRows={3}
              maxRows={6}
              fullWidth
              sx={{ mt: 2 }}
            />
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {success}
              </Alert>
            )}
          </Box>
          {/* Footer Section */}
          <Divider sx={{ mt: 2, mb: 0 }} />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            gap={2}
            px={4}
            py={3}
            bgcolor="#f8fafc"
            sx={{ borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={<AddCircleOutlineIcon />}
              sx={{ px: 4, fontWeight: 600, fontSize: 16 }}
            >
              {loading ? "Creating..." : "Create Channel"}
            </Button>
          </Box>
        </form>
      </Box>
    </PageLayout>
  );
};

export default CreateChannelPage;
