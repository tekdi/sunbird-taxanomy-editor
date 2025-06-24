import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useRouter } from 'next/router';
import { useChannelStore } from '@/store/channelStore';
import BaseForm from '@/components/BaseForm';
import { createFramework } from '@/services/frameworkService';
import Dropdown from '@/components/Dropdown';

const CreateFrameworkPage: React.FC = () => {
  const [framework, setFramework] = useState({
    name: '',
    code: '',
    description: '',
  });
  const [selectedChannel, setSelectedChannel] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const {
    channels,
    loading: channelsLoading,
    error: channelsError,
    fetchChannels,
  } = useChannelStore();

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!framework.name.trim() || !framework.code.trim() || !selectedChannel) {
      setError('Framework Name, Code, and Channel are required.');
      return;
    }
    setLoading(true);
    try {
      const channelObj = channels.find(
        (ch) => ch.identifier === selectedChannel
      );
      if (!channelObj) throw new Error('Selected channel not found');
      await createFramework(framework, channelObj.identifier, channelObj.name);
      setSuccess('Framework created successfully!');
      setFramework({ name: '', code: '', description: '' });
      setSelectedChannel('');
      setTimeout(() => router.push('/frameworks'), 1000);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Failed to create framework');
    } finally {
      setLoading(false);
    }
  };

  const channelOptions = channels.map((ch) => ({
    label: `${ch.name} (${ch.code || ch.identifier})`,
    value: ch.identifier,
  }));

  const frameworkFields = (
    <>
      <Dropdown
        label="Select Channel"
        value={selectedChannel}
        onChange={setSelectedChannel}
        options={channelOptions}
        required
        disabled={channelsLoading}
        helperText={
          channelsError
            ? channelsError
            : 'Select the channel for this framework'
        }
      />
      <Box
        display="grid"
        gap={2}
        gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }}
      >
        <TextField
          label="Framework Name"
          value={framework.name}
          onChange={(e) => setFramework({ ...framework, name: e.target.value })}
          placeholder="e.g., Mathematics Framework"
          helperText="Name should be descriptive and unique"
          required
          fullWidth
        />
        <TextField
          label="Framework Code"
          value={framework.code}
          onChange={(e) => setFramework({ ...framework, code: e.target.value })}
          placeholder="e.g., math_framework"
          helperText="Code must be unique and use underscores."
          required
          fullWidth
        />
      </Box>
      <TextField
        label="Description"
        value={framework.description}
        onChange={(e) =>
          setFramework({ ...framework, description: e.target.value })
        }
        placeholder="Describe the purpose and scope of this framework"
        helperText="Describe the purpose and scope of this framework"
        multiline
        minRows={3}
        maxRows={6}
        fullWidth
        sx={{ mt: 2 }}
      />
    </>
  );

  return (
    <PageLayout>
      <BaseForm
        title="Create New Framework"
        description="Provide basic details about the framework you're creating."
        loading={loading}
        error={error}
        success={success}
        onSubmit={handleSubmit}
        submitText="Create Framework"
        submitIcon={<AddCircleOutlineIcon />}
        fields={frameworkFields}
        sectionTitle="Framework Information"
      />
    </PageLayout>
  );
};

export default CreateFrameworkPage;
