import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Wallet, Video, Phone, Save, Loader2, RotateCcw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfigCard } from '@/components/configuration/ConfigCard';
import { ConfigField } from '@/components/configuration/ConfigField';
import { ConfigSkeleton } from '@/components/skeletons/ConfigSkeleton';
import { useConfig, useUpdateConfig } from '@/hooks/useApi';
import useErrorHandler from '@/hooks/useErrorHandler';
import type { IUpdateConfigPayload } from '@/types/api';

const Configuration = () => {
  const { handleError } = useErrorHandler();
  const { data: config, isLoading, error } = useConfig();
  const updateConfig = useUpdateConfig();

  const [formData, setFormData] = useState<IUpdateConfigPayload | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (config) {
      setFormData({
        inrToCoinRatio: config.withdrawal.inrToCoinRatio.value,
        minWithdrawalCoins: config.withdrawal.minWithdrawalCoins.value,
        userVideoCallCoinPerSec: config.videoCall.userCoinPerSec.value,
        userAudioCallCoinPerSec: config.audioCall.userCoinPerSec.value,
        telecallerVideoCallCoinPerSec: config.videoCall.telecallerCoinPerSec.value,
        telecallerAudioCallCoinPerSec: config.audioCall.telecallerCoinPerSec.value,
      });
      setHasChanges(false);
    }
  }, [config]);

  if (error) {
    handleError(error, 'Failed to fetch configuration.');
  }

  const handleFieldChange = (key: keyof IUpdateConfigPayload, value: number | undefined) => {
    setFormData((prev) => prev ? { ...prev, [key]: value } : null);
    setHasChanges(true);
  };

  const handleReset = () => {
    if (config) {
      setFormData({
        inrToCoinRatio: config.withdrawal.inrToCoinRatio.value,
        minWithdrawalCoins: config.withdrawal.minWithdrawalCoins.value,
        userVideoCallCoinPerSec: config.videoCall.userCoinPerSec.value,
        userAudioCallCoinPerSec: config.audioCall.userCoinPerSec.value,
        telecallerVideoCallCoinPerSec: config.videoCall.telecallerCoinPerSec.value,
        telecallerAudioCallCoinPerSec: config.audioCall.telecallerCoinPerSec.value,
      });
      setHasChanges(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData) return;

    const hasEmptyFields = Object.values(formData).some(
      (val) => val === undefined || val === null || isNaN(val)
    );

    if (hasEmptyFields) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await updateConfig.mutateAsync(formData);
      toast.success('Configuration updated successfully');
      setHasChanges(false);
    } catch (err) {
      handleError(err, 'Failed to update configuration.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  if (isLoading) {
    return <ConfigSkeleton />;
  }

  if (!config || !formData) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[500px]">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Settings className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-6 text-xl font-semibold">Configuration not found</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          Unable to load app configuration. This might be a server issue.
          Please try refreshing the page or contact support.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => window.location.reload()}
        >
          <RotateCcw className="h-4 w-4" />
          Refresh Page
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configuration</h1>
        <p className="text-muted-foreground">
          Manage app-wide settings for coin rates, call charges, and withdrawal limits.
          Changes will take effect immediately for all users.
        </p>
      </div>

      {/* Withdrawal Settings */}
      <ConfigCard
        icon={<Wallet className="h-5 w-5" />}
        title="Withdrawal Settings"
        description="Configure coin to INR conversion and withdrawal limits"
      >
        <ConfigField
          id="inrToCoinRatio"
          field={config.withdrawal.inrToCoinRatio}
          value={formData.inrToCoinRatio}
          onChange={(value) => handleFieldChange('inrToCoinRatio', value)}
          disabled={updateConfig.isPending}
        />
        <ConfigField
          id="minWithdrawalCoins"
          field={config.withdrawal.minWithdrawalCoins}
          value={formData.minWithdrawalCoins}
          onChange={(value) => handleFieldChange('minWithdrawalCoins', value)}
          disabled={updateConfig.isPending}
        />
      </ConfigCard>

      {/* Video Call Settings */}
      <ConfigCard
        icon={<Video className="h-5 w-5" />}
        title="Video Call Settings"
        description="Set coin rates for video calls between users and telecallers"
      >
        <ConfigField
          id="userVideoCallCoinPerSec"
          field={config.videoCall.userCoinPerSec}
          value={formData.userVideoCallCoinPerSec}
          onChange={(value) => handleFieldChange('userVideoCallCoinPerSec', value)}
          disabled={updateConfig.isPending}
        />
        <ConfigField
          id="telecallerVideoCallCoinPerSec"
          field={config.videoCall.telecallerCoinPerSec}
          value={formData.telecallerVideoCallCoinPerSec}
          onChange={(value) => handleFieldChange('telecallerVideoCallCoinPerSec', value)}
          disabled={updateConfig.isPending}
        />
      </ConfigCard>

      {/* Audio Call Settings */}
      <ConfigCard
        icon={<Phone className="h-5 w-5" />}
        title="Audio Call Settings"
        description="Set coin rates for audio calls between users and telecallers"
      >
        <ConfigField
          id="userAudioCallCoinPerSec"
          field={config.audioCall.userCoinPerSec}
          value={formData.userAudioCallCoinPerSec}
          onChange={(value) => handleFieldChange('userAudioCallCoinPerSec', value)}
          disabled={updateConfig.isPending}
        />
        <ConfigField
          id="telecallerAudioCallCoinPerSec"
          field={config.audioCall.telecallerCoinPerSec}
          value={formData.telecallerAudioCallCoinPerSec}
          onChange={(value) => handleFieldChange('telecallerAudioCallCoinPerSec', value)}
          disabled={updateConfig.isPending}
        />
      </ConfigCard>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          Last updated: {formatDate(config.updatedAt)}
        </p>
        <div className="flex items-center gap-3">
          {hasChanges && (
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={updateConfig.isPending}
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            disabled={!hasChanges || updateConfig.isPending}
          >
            {updateConfig.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Configuration;