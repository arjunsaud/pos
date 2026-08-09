'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Download, Search, LayoutList, Rows3, ChevronDown, ChevronUp } from 'lucide-react';
import { mockActivityLogs } from '@/lib/mock-data';
import type { ActivityLog } from '@/lib/types';
import { cn } from '@/lib/utils';
import { getLogDotColor, formatDateTime } from '@/lib/helpers';
import { toast } from 'sonner';

type LogType = 'all' | 'info' | 'warning' | 'error' | 'success';
type ViewMode = 'table' | 'timeline';

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getLogTypeBadgeClasses(type: string): string {
  switch (type) {
    case 'info': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'warning': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    case 'error': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    case 'success': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    default: return 'bg-muted text-muted-foreground';
  }
}

export default function ActivityLogs() {
  const [typeFilter, setTypeFilter] = useState<LogType>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredLogs = mockActivityLogs.filter((log) => {
    const matchesType = typeFilter === 'all' || log.type === typeFilter;
    const matchesSearch =
      search === '' ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const paged = filteredLogs.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const exportCSV = () => {
    const headers = ['User', 'Action', 'Details', 'Type', 'Timestamp'];
    const rows = filteredLogs.map(l => [
      `"${l.user}"`,
      `"${l.action}"`,
      `"${l.details}"`,
      l.type,
      l.timestamp,
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'activity-logs-export.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success('Activity logs exported successfully');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activity Logs"
        description="Track all system activities and changes"
      >
        <Button variant="outline" onClick={exportCSV}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </PageHeader>

      {/* Filters + View Toggle */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1">
          {(['all', 'info', 'warning', 'error', 'success'] as LogType[]).map(
            (type) => (
              <Button
                key={type}
                variant={typeFilter === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => { setTypeFilter(type); setPage(1); }}
              >
                {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            )
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              className="pl-9"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="flex rounded-lg border p-0.5">
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setViewMode('table')}
            >
              <Rows3 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={viewMode === 'timeline' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setViewMode('timeline')}
            >
              <LayoutList className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {viewMode === 'table' ? (
        /* ===== TABLE VIEW ===== */
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="transition-colors hover:bg-muted/50">
                  <TableHead className="w-10"></TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead className="hidden md:table-cell">Details</TableHead>
                  <TableHead className="text-right">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.length === 0 ? (
                  <TableRow className="transition-colors hover:bg-muted/50">
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No activity logs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paged.map((log) => {
                    const isExpanded = expandedId === log.id;
                    return (
                      <TableRow key={log.id} className="transition-colors hover:bg-muted/50">
                        <TableCell>
                          <span
                            className={cn(
                              'inline-block h-2.5 w-2.5 rounded-full',
                              getLogDotColor(log.type)
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-muted-foreground">{log.user}</TableCell>
                        <TableCell>
                          <button
                            className="flex items-center gap-1 font-medium cursor-pointer hover:underline"
                            onClick={() => toggleExpand(log.id)}
                          >
                            {log.action}
                            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                          </button>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground max-w-xs truncate">
                          {log.details}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground whitespace-nowrap">
                          {formatTimestamp(log.timestamp)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
            </div>

            {/* Expanded Detail */}
            {expandedId && (
              <div className="border-t px-4 py-3 bg-muted/30">
                {(() => {
                  const log = filteredLogs.find(l => l.id === expandedId);
                  if (!log) return null;
                  return (
                    <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 sm:grid-cols-4">
                      <div>
                        <span className="text-muted-foreground">Full Timestamp</span>
                        <p className="font-medium">{formatDateTime(log.timestamp)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Log Type</span>
                        <p className="mt-0.5">
                          <Badge className={cn(getLogTypeBadgeClasses(log.type))} variant="secondary">
                            {log.type.charAt(0).toUpperCase() + log.type.slice(1)}
                          </Badge>
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Action Details</span>
                        <p className="font-medium">{log.details}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Performed By</span>
                        <p className="font-medium">{log.user}</p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 px-4">
              <p className="text-sm text-muted-foreground">
                Showing {filteredLogs.length > 0 ? ((page - 1) * ITEMS_PER_PAGE) + 1 : 0}-{Math.min(page * ITEMS_PER_PAGE, filteredLogs.length)} of {filteredLogs.length}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
                <span className="text-sm font-medium">{page} / {totalPages || 1}</span>
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* ===== TIMELINE VIEW ===== */
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-6">
            {paged.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Search className="mb-2 h-8 w-8 opacity-50" />
                <p>No activity logs found.</p>
              </div>
            ) : (
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />

                <div className="space-y-4">
                  {paged.map((log) => (
                    <div key={log.id} className="relative flex gap-4 pl-6">
                      {/* Dot */}
                      <div className="absolute left-0 top-3">
                        <span
                          className={cn(
                            'inline-block h-[15px] w-[15px] rounded-full border-2 border-background',
                            getLogDotColor(log.type)
                          )}
                        />
                      </div>

                      {/* Card */}
                      <div className="flex-1 rounded-lg border p-3 transition-colors hover:bg-muted/50">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{log.action}</span>
                              <Badge className={cn('text-[10px] px-1.5 py-0', getLogTypeBadgeClasses(log.type))} variant="secondary">
                                {log.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{log.details}</p>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="text-xs text-muted-foreground whitespace-nowrap">{formatTimestamp(log.timestamp)}</p>
                            <p className="text-xs text-muted-foreground">{log.user}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between pt-6">
              <p className="text-sm text-muted-foreground">
                Showing {filteredLogs.length > 0 ? ((page - 1) * ITEMS_PER_PAGE) + 1 : 0}-{Math.min(page * ITEMS_PER_PAGE, filteredLogs.length)} of {filteredLogs.length}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
                <span className="text-sm font-medium">{page} / {totalPages || 1}</span>
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
