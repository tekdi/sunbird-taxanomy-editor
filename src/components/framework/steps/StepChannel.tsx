import React from 'react';
import { useFrameworkFormStore } from '@/store/frameworkFormStore';
import { useChannelStore } from '@/store/channelStore';
import { normalizeChannels } from '@/services/channelService';
import Dropdown from '@/components/Dropdown';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

const StepChannel: React.FC = () => {
  const channel = useFrameworkFormStore((state) => state.channel);
  const setChannel = useFrameworkFormStore((state) => state.setChannel);
  const { channels, loading, error, fetchChannels } = useChannelStore();

  // Use normalizeChannels to ensure code property exists for selection
  const mappedChannels = normalizeChannels(channels);
  const dropdownOptions = mappedChannels.map((ch) => ({
    label: `${ch.name} (${ch.code})`,
    value: ch.code ?? ch.identifier,
  }));

  React.useEffect(() => {
    fetchChannels();
    // eslint-disable-next-line
  }, []);

  return (
    <Box sx={{ p: { xs: 0, md: 1 }, mb: 0 }}>
      <Box mb={3}>
        <Typography
          variant="subtitle1"
          fontWeight={700}
          gutterBottom
          sx={{
            textTransform: 'uppercase',
            color: 'text.secondary',
            fontSize: 15,
          }}
        >
          Select Channel
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Choose the channel for which you want to create the framework.
        </Typography>
      </Box>
      {loading ? (
        <Box textAlign="center" py={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ textAlign: 'center', py: 2 }}>
          {error}
        </Alert>
      ) : (
        <Box maxWidth={400}>
          <Dropdown
            label="Select Channel"
            value={channel?.code || ''}
            onChange={(value) => {
              const selected = mappedChannels.find((ch) => ch.code === value);
              if (selected) setChannel(selected);
            }}
            options={dropdownOptions}
            required
          />
        </Box>
      )}
    </Box>
  );
};

export default StepChannel;
