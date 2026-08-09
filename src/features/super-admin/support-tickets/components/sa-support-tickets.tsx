'use client';

import { useState, useMemo } from 'react';
import type { SupportTicket, TicketPriority, TicketStatus, TicketCategory } from '@/lib/types';
import { mockSupportTickets } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/shared/page-header';
import { toast } from 'sonner';
import { formatDate } from '@/lib/helpers';
import { MessageSquare, Search, Clock, Loader2, CheckCircle2, AlertCircle, CircleDot, CircleOff } from 'lucide-react';

// ---------- Badge helpers ----------

function getCategoryBadge(category: TicketCategory) {
  const map: Record<TicketCategory, { label: string; cls: string }> = {
    bug:            { label: 'Bug',             cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    feature_request: { label: 'Feature Request',  cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    billing:         { label: 'Billing',          cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    technical:       { label: 'Technical',        cls: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
    other:           { label: 'Other',            cls: 'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400' },
  };
  const { label, cls } = map[category];
  return <Badge variant="outline" className={cls}>{label}</Badge>;
}

function getPriorityBadge(priority: TicketPriority) {
  const map: Record<TicketPriority, { label: string; cls: string }> = {
    low:      { label: 'Low',      cls: 'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400' },
    medium:   { label: 'Medium',   cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    high:     { label: 'High',     cls: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
    critical: { label: 'Critical', cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  };
  const { label, cls } = map[priority];
  return <Badge variant="outline" className={cls}>{label}</Badge>;
}

function getStatusBadge(status: TicketStatus) {
  const map: Record<TicketStatus, { label: string; cls: string }> = {
    open:       { label: 'Open',       cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    in_progress: { label: 'In Progress', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    resolved:   { label: 'Resolved',   cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
    closed:     { label: 'Closed',     cls: 'bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400' },
  };
  const { label, cls } = map[status];
  return <Badge variant="outline" className={cls}>{label}</Badge>;
}

// ---------- Component ----------

export default function SASupportTickets() {
  const [tickets, setTickets] = useState<SupportTicket[]>(mockSupportTickets);
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [responseTexts, setResponseTexts] = useState<Record<string, string>>({});
  const [responding, setResponding] = useState<string | null>(null);

  // Stats
  const stats = useMemo(() => {
    const open = tickets.filter((t) => t.status === 'open').length;
    const inProgress = tickets.filter((t) => t.status === 'in_progress').length;
    const resolved = tickets.filter((t) => t.status === 'resolved').length;
    const total = tickets.length;
    return { open, inProgress, resolved, total };
  }, [tickets]);

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!t.tenantName.toLowerCase().includes(q) && !t.subject.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [tickets, statusFilter, categoryFilter, search]);

  // Actions
  const handleSendResponse = (ticketId: string) => {
    const text = responseTexts[ticketId]?.trim();
    if (!text) {
      toast.error('Please enter a response before sending.');
      return;
    }
    setResponding(ticketId);
    // Simulate async
    setTimeout(() => {
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId
            ? {
                ...t,
                response: text,
                respondedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status: t.status === 'open' ? 'in_progress' as TicketStatus : t.status,
              }
            : t
        )
      );
      setResponseTexts((prev) => {
        const next = { ...prev };
        delete next[ticketId];
        return next;
      });
      setResponding(null);
      toast.success('Response sent successfully.');
    }, 600);
  };

  const handleMarkResolved = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, status: 'resolved' as TicketStatus, updatedAt: new Date().toISOString() }
          : t
      )
    );
    toast.success('Ticket marked as resolved.');
  };

  const toggleExpand = (id: string) => {
    setExpandedTicketId((prev) => (prev === id ? null : id));
  };

  // Stats cards
  const statCards = [
    { label: 'Open', value: stats.open, icon: CircleDot, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'In Progress', value: stats.inProgress, icon: Loader2, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { label: 'Resolved', value: stats.resolved, icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Total', value: stats.total, icon: MessageSquare, color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-50 dark:bg-gray-800/30' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Support Tickets" description="Manage and respond to tenant support requests" />

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${s.bg}`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="bug">Bug</SelectItem>
            <SelectItem value="feature_request">Feature Request</SelectItem>
            <SelectItem value="billing">Billing</SelectItem>
            <SelectItem value="technical">Technical</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by tenant name or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Ticket List */}
      <div className="space-y-3">
        {filteredTickets.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-lg font-medium">No tickets found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your filters or search query.</p>
            </CardContent>
          </Card>
        )}

        {filteredTickets.map((ticket) => {
          const isExpanded = expandedTicketId === ticket.id;
          const hasResponse = !!ticket.response;

          return (
            <Card
              key={ticket.id}
              className={`cursor-pointer transition-all hover:shadow-md ${isExpanded ? 'ring-1 ring-primary/20 shadow-md' : ''}`}
              onClick={() => toggleExpand(ticket.id)}
            >
              <CardContent className="p-4 sm:p-6">
                {/* Collapsed view */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{ticket.tenantName}</span>
                      {hasResponse && (
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100">
                          Responded
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium">{ticket.subject}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      {getCategoryBadge(ticket.category)}
                      {getPriorityBadge(ticket.priority)}
                      {getStatusBadge(ticket.status)}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {formatDate(ticket.createdAt)}
                  </div>
                </div>

                {/* Truncated description when collapsed */}
                {!isExpanded && (
                  <p className="mt-3 line-clamp-1 text-sm text-muted-foreground">
                    {ticket.description}
                  </p>
                )}

                {/* Expanded view */}
                {isExpanded && (
                  <div
                    className="mt-4 space-y-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Separator />

                    <div className="space-y-1">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Description</p>
                      <p className="text-sm leading-relaxed">{ticket.description}</p>
                    </div>

                    {hasResponse && (
                      <div className="space-y-1 rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/40 dark:bg-emerald-900/10">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          <p className="text-xs font-medium uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Response</p>
                          {ticket.respondedAt && (
                            <span className="text-xs text-muted-foreground">— {formatDate(ticket.respondedAt)}</span>
                          )}
                        </div>
                        <p className="mt-2 text-sm leading-relaxed">{ticket.response}</p>
                      </div>
                    )}

                    {!hasResponse && ticket.status !== 'closed' && ticket.status !== 'resolved' && (
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <Label htmlFor={`response-${ticket.id}`}>Send a Response</Label>
                          <Textarea
                            id={`response-${ticket.id}`}
                            placeholder="Type your response here..."
                            value={responseTexts[ticket.id] || ''}
                            onChange={(e) =>
                              setResponseTexts((prev) => ({ ...prev, [ticket.id]: e.target.value }))
                            }
                            rows={3}
                          />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            disabled={responding === ticket.id || !responseTexts[ticket.id]?.trim()}
                            onClick={() => handleSendResponse(ticket.id)}
                          >
                            {responding === ticket.id && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
                            Send Response
                          </Button>
                          {ticket.status === 'in_progress' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkResolved(ticket.id)}
                            >
                              <CheckCircle2 className="mr-1.5 h-4 w-4" />
                              Mark as Resolved
                            </Button>
                          )}
                        </div>
                      </div>
                    )}

                    {ticket.status === 'in_progress' && hasResponse && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkResolved(ticket.id)}
                      >
                        <CheckCircle2 className="mr-1.5 h-4 w-4" />
                        Mark as Resolved
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
