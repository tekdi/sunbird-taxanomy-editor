import React from 'react';
import { useFrameworkFormStore } from '@/store/frameworkFormStore';
import { useFrameworksStore } from '@/store/frameworksStore';
import Dropdown from '@/components/Dropdown';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

const StepFramework: React.FC = () => {
  const framework = useFrameworkFormStore((state) => state.framework);
  const setFramework = useFrameworkFormStore((state) => state.setFramework);
  const channel = useFrameworkFormStore((state) => state.channel);
  const { frameworks, loading, error, fetchFrameworks } = useFrameworksStore();

  // Filter frameworks to only those belonging to the selected channel
  const filteredFrameworks = React.useMemo(() => {
    if (!channel) return [];
    return frameworks.filter(
      (fw) => fw.channel === channel.code || fw.channel === channel.identifier
    );
  }, [frameworks, channel]);

  const dropdownOptions = filteredFrameworks.map((fw) => ({
    label: `${fw.name} (${fw.code})`,
    value: fw.code,
  }));

  React.useEffect(() => {
    fetchFrameworks();
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
          Select Framework
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Choose the framework you want to manage or edit.
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
            label="Select Framework"
            value={framework?.code || ''}
            onChange={(value) => {
              const selected = filteredFrameworks.find(
                (fw) => fw.code === value
              );
              if (selected) setFramework(selected);
            }}
            options={dropdownOptions}
            required
          />
        </Box>
      )}
    </Box>
  );
};

export default StepFramework;
