import { useState } from 'react';
import { Store } from 'lucide-react';
import type { DesktopRole } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LoginScreen({
  onSubmit,
  error,
  busy,
  challengeEmail,
}: {
  onSubmit: (email: string, password: string, role: DesktopRole, otp?: string) => void;
  error: string;
  busy: boolean;
  challengeEmail?: string;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<DesktopRole>('tenant-admin');
  const [otp, setOtp] = useState('');

  return (
    <div className="relative flex min-h-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-muted/50 via-background to-muted/30 p-4">
      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          <Store className="size-8" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">POS Nepal</h1>
        <div className="mt-2 h-[2px] w-24 bg-gradient-to-r from-emerald-500 via-sky-500 to-amber-500" />
        <p className="mt-3 text-sm text-muted-foreground">
          Sign in as a tenant admin or staff member
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {['Fast POS', 'Multi-Tenant', 'Secure'].map((label) => (
            <span
              key={label}
              className="rounded-full border bg-background/80 px-3 py-1 text-xs text-muted-foreground"
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <Card className="relative w-full max-w-md border-0 shadow-xl">
        <CardContent className="p-6 sm:p-8">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(email, password, role, challengeEmail ? otp : undefined);
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!challengeEmail}
              />
            </div>
            {challengeEmail ? (
              <div className="space-y-2">
                <Label htmlFor="otp">2FA code sent to {challengeEmail}</Label>
                <Input id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} required />
              </div>
            ) : null}

            <div className="grid gap-2 sm:grid-cols-2">
              {(
                [
                  ['tenant-admin', 'Tenant Admin', 'Dashboard, inventory, reports'],
                  ['staff', 'Staff', 'POS and sales history'],
                ] as const
              ).map(([id, title, desc]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setRole(id)}
                  className={cn(
                    'rounded-xl border p-3 text-left transition-colors',
                    role === id
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'hover:bg-accent/50',
                  )}
                >
                  <strong className="text-sm">{title}</strong>
                  <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
                </button>
              ))}
            </div>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <Button
              type="submit"
              className="h-11 w-full bg-gradient-to-r from-primary to-primary/90"
              disabled={busy || !email || !password || Boolean(challengeEmail && !otp)}
            >
              {busy ? 'Signing in…' : challengeEmail ? 'Verify code' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
