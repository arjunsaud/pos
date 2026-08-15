'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Shield, ShieldCheck } from 'lucide-react';
import { apiPaths, apiRequest } from '@/lib/api';
import { useAuthStore } from '@/features/auth/store';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function TwoFactorSettings({
  enabled,
  isAdmin,
  onChanged,
}: {
  enabled: boolean;
  isAdmin?: boolean;
  onChanged?: (enabled: boolean) => void;
}) {
  const [current, setCurrent] = useState(enabled);
  const [otp, setOtp] = useState('');
  const [action, setAction] = useState<'enable' | 'disable' | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setCurrent(enabled);
  }, [enabled]);

  const base = isAdmin ? apiPaths.admin.auth : apiPaths.user.auth;

  const requestCode = async (next: boolean) => {
    const nextAction = next ? 'enable' : 'disable';
    setBusy(true);
    try {
      await apiRequest(`${base.twoFaChallenge}`, {
        method: 'POST',
        body: { action: nextAction },
      });
      setAction(nextAction);
      setOtp('');
      toast.success('A verification code was sent to your email.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not start 2FA');
    } finally {
      setBusy(false);
    }
  };

  const confirm = async () => {
    if (!action || otp.length < 4) return;
    setBusy(true);
    try {
      const result = await apiRequest<{ twoFactorEnabled: boolean }>(
        base.twoFaConfirm,
        { method: 'POST', body: { action, otp } },
      );
      const next = Boolean(result.twoFactorEnabled);
      setCurrent(next);
      setAction(null);
      setOtp('');
      onChanged?.(next);
      const user = useAuthStore.getState().user;
      if (user) {
        useAuthStore.setState({ user: { ...user, twoFactorEnabled: next } });
      }
      toast.success(next ? 'Two-factor authentication enabled' : 'Two-factor authentication disabled');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Invalid code');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Shield className="h-5 w-5" />
          Two-factor authentication
        </CardTitle>
        <CardDescription>
          Require an email code after your password whenever you sign in.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Enable 2FA</p>
            <p className="text-sm text-muted-foreground">
              Status:{' '}
              <Badge
                variant={current ? 'default' : 'outline'}
                className={cn('text-[10px]', current && 'bg-emerald-600')}
              >
                {current ? (
                  <>
                    <ShieldCheck className="mr-1 h-3 w-3" />
                    Enabled
                  </>
                ) : (
                  'Disabled'
                )}
              </Badge>
            </p>
          </div>
          <Switch
            checked={current}
            disabled={busy}
            onCheckedChange={(next) => {
              if (next === current) return;
              void requestCode(next);
            }}
          />
        </div>
        {action ? (
          <div className="max-w-xs space-y-2">
            <Label>Verification code</Label>
            <Input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit code"
              inputMode="numeric"
            />
            <div className="flex gap-2">
              <Button disabled={busy || otp.length < 4} onClick={() => void confirm()}>
                Confirm
              </Button>
              <Button variant="ghost" disabled={busy} onClick={() => setAction(null)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
