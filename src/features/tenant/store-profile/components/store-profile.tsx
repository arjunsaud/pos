'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/features/auth/store';
import {
  Save,
  Clock,
  MapPin,
  Phone,
  Mail,
  Building2,
  FileCheck,
  Calendar,
  Globe,
  Languages,
  Percent,
  Receipt,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

const BUSINESS_HOURS: Record<string, { open: string; close: string }> = {
  Monday: { open: '10:00 AM', close: '8:00 PM' },
  Tuesday: { open: '10:00 AM', close: '8:00 PM' },
  Wednesday: { open: '10:00 AM', close: '8:00 PM' },
  Thursday: { open: '10:00 AM', close: '8:00 PM' },
  Friday: { open: '10:00 AM', close: '8:00 PM' },
  Saturday: { open: '10:00 AM', close: '6:00 PM' },
  Sunday: { open: '10:00 AM', close: '6:00 PM' },
};

export default function StoreProfile() {
  const { user } = useAuthStore();
  const tenantName = user?.tenantName || 'ABC Store';

  const [storeName, setStoreName] = useState(tenantName);
  const [pan, setPan] = useState('309876543');
  const [phone, setPhone] = useState('+977-9801234567');
  const [email, setEmail] = useState('info@abcstore.com.np');
  const [address, setAddress] = useState('Putalisadak, Kathmandu 44600, Nepal');
  const [businessType, setBusinessType] = useState('Retail / General Store');
  const [regDate, setRegDate] = useState('2024-01-15');
  const [currency, setCurrency] = useState('NPR (Nepalese Rupee)');
  const [timezone, setTimezone] = useState('Asia/Kathmandu (GMT+5:45)');
  const [language, setLanguage] = useState('English');
  const [taxRate, setTaxRate] = useState('13% VAT');
  const [receiptFooter, setReceiptFooter] = useState('Thank you for shopping with us!');

  const todayIndex = useMemo(() => {
    const jsDay = new Date().getDay(); // 0=Sun, 6=Sat
    return jsDay === 0 ? 6 : jsDay - 1; // Convert to 0=Mon, 6=Sun
  }, []);

  const initials = storeName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleSave = () => {
    toast.success('Store profile saved successfully');
  };

  const recentActivity = [
    { text: 'Store profile updated', time: '2 days ago', icon: Activity },
    { text: 'Business hours changed', time: '5 days ago', icon: Clock },
    { text: 'PAN verified', time: '12 days ago', icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Store Profile" description="Manage your store information and settings">
        <Button onClick={handleSave}>
          <Save className="h-4 w-4" /> Save Changes
        </Button>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Store Info Card - spans 2 cols */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Store Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo + Name Row */}
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground shrink-0">
                {initials}
              </div>
              <div className="grid gap-2 flex-1">
                <Label htmlFor="store-name">Store Name</Label>
                <Input
                  id="store-name"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                />
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="business-type">Business Type</Label>
                <Input
                  id="business-type"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pan">PAN Number</Label>
                <Input
                  id="pan"
                  value={pan}
                  onChange={(e) => setPan(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reg-date">Registration Date</Label>
                <Input
                  id="reg-date"
                  type="date"
                  value={regDate}
                  onChange={(e) => setRegDate(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Store Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-primary" />
              Store Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="language">Language</Label>
              <Input
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tax-rate">Tax Rate</Label>
              <Input
                id="tax-rate"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="receipt-footer">Receipt Footer</Label>
              <Input
                id="receipt-footer"
                value={receiptFooter}
                onChange={(e) => setReceiptFooter(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Business Hours Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Business Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {DAYS.map((day, idx) => {
                const hours = BUSINESS_HOURS[day];
                const isToday = idx === todayIndex;
                const isWeekend = day === 'Saturday' || day === 'Sunday';
                return (
                  <div
                    key={day}
                    className={cn(
                      'rounded-lg border p-3 text-center transition-all duration-200',
                      isToday && 'bg-primary/10 border-primary/30 shadow-sm',
                      isWeekend && !isToday && 'bg-amber-50 dark:bg-amber-900/10 border-amber-200/50 dark:border-amber-800/30',
                      !isToday && !isWeekend && 'bg-muted/30'
                    )}
                  >
                    <p className={cn(
                      'text-sm font-semibold',
                      isToday && 'text-primary'
                    )}>
                      {day.slice(0, 3)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {hours.open} – {hours.close}
                    </p>
                    {isToday && (
                      <span className="mt-1.5 inline-block rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-medium text-primary">
                        Today
                      </span>
                    )}
                    {isWeekend && !isToday && (
                      <span className="mt-1.5 inline-block rounded-full bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-400">
                        Weekend
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative space-y-0">
              {/* Vertical line */}
              <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />
              {recentActivity.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="relative flex items-start gap-3 pb-5 last:pb-0">
                    <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="pt-0.5">
                      <p className="text-sm font-medium">{item.text}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
