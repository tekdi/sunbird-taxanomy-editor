import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useRouter } from 'next/router';
import { validateChannelForm, createChannel } from '@/services/channelService';
import BaseForm from '@/components/BaseForm';
import { autoFillCodeFromName } from '@/utils/HelperService';

// This component serves as the main page for creating a new channel in the application.
// It includes a form with fields for channel name, code, and description.
// The form validates input and submits the data to create a new channel via an API call.
// It is an extension of the BaseForm component, which handles form submission, loading state, and error/success messages.
const CreateChannelPage: React.FC = () => {
  const [channel, setChannel] = useState({
    name: '',
    code: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setChannel((prev) => autoFillCodeFromName(prev, name));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const validationError = validateChannelForm(channel);
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;
      const authToken = process.env.NEXT_PUBLIC_AUTH_TOKEN;
      const cookie = process.env.NEXT_PUBLIC_COOKIE;
      const interfaceUrl = process.env.NEXT_PUBLIC_INTERFACE_URL;

      if (!tenantId || !authToken || !cookie || !interfaceUrl) {
        throw new Error('Missing environment variables');
      }

      await createChannel(channel, {
        tenantId,
        authToken,
        cookie,
        interfaceUrl,
      });
      setSuccess('Channel created successfully!');
      setChannel({ name: '', code: '', description: '' });
      setTimeout(() => router.push('/channels'), 1000);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Failed to create channel');
    } finally {
      setLoading(false);
    }
  };

  const channelFields = (
    <>
      <Box
        display="grid"
        gap={2}
        gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }}
      >
        <TextField
          label="Channel Name"
          value={channel.name}
          onChange={handleNameChange}
          placeholder="e.g., Youthnet Channel"
          helperText="Name should be descriptive and unique"
          required
          fullWidth
        />
        <TextField
          label="Channel Code"
          value={channel.code}
          onChange={(e) => setChannel({ ...channel, code: e.target.value })}
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
    </>
  );

  return (
    <PageLayout>
      <BaseForm
        title="Create New Channel"
        description="Provide basic details about the channel you're creating."
        loading={loading}
        error={error}
        success={success}
        onSubmit={handleSubmit}
        submitText="Create Channel"
        submitIcon={<AddCircleOutlineIcon />}
        fields={channelFields}
        sectionTitle="Channel Information"
      />
    </PageLayout>
  );
};

export default CreateChannelPage;
