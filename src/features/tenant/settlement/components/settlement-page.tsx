'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import {
  ShoppingCart,
  Wallet,
  CreditCard,
  Receipt,
  Download,
  Printer,
  Smartphone,
  ArrowUpRight,
  Save,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { nprFull, getInitials } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ---------- Avatar color palette (same as customers page) ----------
const AVATAR_COLORS = [
  { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400' },
  { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
  { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' },
  { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400' },
  { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-600 dark:text-rose-400' },
  { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-600 dark:text-cyan-400' },
  { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400' },
  { bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-600 dark:text-teal-400' },
  { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-600 dark:text-indigo-400' },
  { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-600 dark:text-pink-400' },
];

function getAvatarColor(name: string) {
  const char = name.trim().charAt(0).toUpperCase();
  const code = char.charCodeAt(0);
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

// ---------- Mock data ----------
const paymentMethods = [
  { name: 'Cash', amount: 18750, transactions: 28, icon: Wallet, color: 'emerald', percentage: 53 },
  { name: 'Card', amount: 8464, transactions: 5, icon: CreditCard, color: 'blue', percentage: 24 },
  { name: 'eSewa', amount: 4593, transactions: 4, icon: Smartphone, color: 'green', percentage: 13 },
  { name: 'Khalti', amount: 3393, transactions: 2, icon: ArrowUpRight, color: 'purple', percentage: 10 },
];

const reconciliationData = [
  { category: 'Cash in Register', expected: 18750, actual: 18700, difference: -50, status: 'Warning' },
  { category: 'Card Settlements', expected: 8464, actual: 8464, difference: 0, status: 'Matched' },
  { category: 'eSewa Transfers', expected: 4593, actual: 4593, difference: 0, status: 'Matched' },
  { category: 'Khalti Transfers', expected: 3393, actual: 3393, difference: 0, status: 'Matched' },
];

const staffPerformance = [
  { name: 'Rajesh Sharma', transactions: 12, revenue: 15230, avgOrder: 1269.17 },
  { name: 'Ramesh Karki', transactions: 15, revenue: 12450, avgOrder: 830.0 },
  { name: 'Sita Thapa', transactions: 12, revenue: 7519, avgOrder: 626.58 },
];

const paymentColorMap: Record<string, { bg: string; text: string }> = {
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400' },
  blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
  green: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400' },
  purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' },
};

const barColorMap: Record<string, string> = {
  emerald: 'bg-emerald-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  purple: 'bg-purple-500',
};

function getTodayDateString(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default function SettlementPage() {
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [notes, setNotes] = useState('');

  const handleGenerateReport = () => {
    toast.success('Report generated', { description: `Settlement report for ${selectedDate}` });
  };

  const handleExportReport = () => {
    toast.success('Export started', { description: 'Settlement report is being exported...' });
  };

  const handleSaveNotes = () => {
    toast.success('Notes saved', { description: 'Shift notes have been saved successfully.' });
  };

  const handleCloseRegister = () => {
    toast.success('Register closed', { description: 'Cash register has been closed for the day.' });
  };

  const handlePrintReport = () => {
    window.print();
  };

  const totalExpected = reconciliationData.reduce((sum, row) => sum + row.expected, 0);
  const totalActual = reconciliationData.reduce((sum, row) => sum + row.actual, 0);
  const totalDifference = totalExpected - totalActual;

  return (
    <div className="space-y-6">
      {/* A. Page Header */}
      <PageHeader title="Daily Settlement" description="End-of-day cash register reconciliation">
        <Button variant="outline" onClick={handleExportReport}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </PageHeader>

      {/* B. Date Picker Row */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="space-y-2">
              <Label htmlFor="settlement-date">Settlement Date</Label>
              <Input
                id="settlement-date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-48"
              />
            </div>
            <Button onClick={handleGenerateReport}>
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* C. Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Sales"
          value={`NPR ${nprFull(35199)}`}
          icon={ShoppingCart}
          iconClassName="border-l-emerald-500"
          trend={{ value: 12.5, label: 'from yesterday' }}
        />
        <StatCard
          title="Cash Collected"
          value={`NPR ${nprFull(18750)}`}
          icon={Wallet}
          iconClassName="border-l-blue-500"
        />
        <StatCard
          title="Digital Payments"
          value={`NPR ${nprFull(16449)}`}
          icon={CreditCard}
          iconClassName="border-l-purple-500"
        />
        <StatCard
          title="Transactions"
          value="39"
          icon={Receipt}
          iconClassName="border-l-amber-500"
          trend={{ value: 8, label: 'from yesterday' }}
        />
      </div>

      {/* D. Payment Method Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {paymentMethods.map((method) => {
              const MethodIcon = method.icon;
              const colors = paymentColorMap[method.color];
              return (
                <div key={method.name} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', colors.bg)}>
                      <MethodIcon className={cn('h-5 w-5', colors.text)} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{method.name}</p>
                      <p className="text-lg font-bold">NPR {nprFull(method.amount)}</p>
                      <p className="text-xs text-muted-foreground">{method.transactions} transactions</p>
                    </div>
                  </div>
                  {/* Percentage bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{method.percentage}% of total</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className={cn('h-2 rounded-full transition-all duration-500', barColorMap[method.color])}
                        style={{ width: `${method.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* E. Reconciliation Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reconciliation</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Expected</TableHead>
                <TableHead className="text-right">Actual</TableHead>
                <TableHead className="text-right">Difference</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reconciliationData.map((row) => (
                <TableRow key={row.category} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{row.category}</TableCell>
                  <TableCell className="text-right font-mono">NPR {nprFull(row.expected)}</TableCell>
                  <TableCell className="text-right font-mono">NPR {nprFull(row.actual)}</TableCell>
                  <TableCell className={cn('text-right font-mono', row.difference !== 0 && 'text-red-600 dark:text-red-400')}>
                    {row.difference !== 0 ? '-' : ''}NPR {nprFull(Math.abs(row.difference))}
                  </TableCell>
                  <TableCell className="text-center">
                    {row.status === 'Matched' ? (
                      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Matched
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        Warning
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow className="bg-muted/50 font-semibold">
                <TableCell>Total</TableCell>
                <TableCell className="text-right font-mono">NPR {nprFull(totalExpected)}</TableCell>
                <TableCell className="text-right font-mono">NPR {nprFull(totalActual)}</TableCell>
                <TableCell className={cn('text-right font-mono', totalDifference !== 0 && 'text-red-600 dark:text-red-400')}>
                  {totalDifference !== 0 ? '-' : ''}NPR {nprFull(Math.abs(totalDifference))}
                </TableCell>
                <TableCell className="text-center">
                  {totalDifference === 0 ? (
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Matched
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30">
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      Warning
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>

      {/* F. Staff Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff</TableHead>
                <TableHead className="text-right">Transactions</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Avg. Order</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffPerformance.map((staff) => {
                const avatarColor = getAvatarColor(staff.name);
                return (
                  <TableRow key={staff.name} className="hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold', avatarColor.bg, avatarColor.text)}>
                          {getInitials(staff.name)}
                        </div>
                        <span className="font-medium">{staff.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{staff.transactions}</TableCell>
                    <TableCell className="text-right font-mono">NPR {nprFull(staff.revenue)}</TableCell>
                    <TableCell className="text-right font-mono">NPR {nprFull(staff.avgOrder)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* G. Notes Section */}
      <Card>
        <CardHeader>
          <CardTitle>Shift Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Add any notes about today's shift..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
            <Button onClick={handleSaveNotes}>
              <Save className="mr-2 h-4 w-4" />
              Save Notes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* H. Action Buttons Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="destructive" onClick={handleCloseRegister}>
          Close Register
        </Button>
        <Button variant="outline" onClick={handlePrintReport}>
          <Printer className="mr-2 h-4 w-4" />
          Print Report
        </Button>
      </div>
    </div>
  );
}
