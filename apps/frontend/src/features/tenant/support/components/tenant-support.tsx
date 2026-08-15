'use client';

import { useState, useMemo, useEffect } from 'react';
import type { SupportTicket, TicketPriority, TicketStatus, TicketCategory } from '@/lib/types';
import { useSupportTickets } from '@/hooks/use-api-data';
import { useAuthStore } from '@/features/auth/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/shared/page-header';
import { toast } from 'sonner';
import { formatDate } from '@/lib/helpers';
import {
  Plus,
  Search,
  MessageSquare,
  CircleDot,
  Loader2,
  CheckCircle2,
  TicketCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

// ---------- Badge helpers ----------

function getCategoryBadgeClasses(category: TicketCategory): string {
  switch (category) {
    case 'bug':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    case 'feature_request':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'billing':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    case 'technical':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    case 'other':
      return 'bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

function getCategoryLabel(category: TicketCategory): string {
  const labels: Record<TicketCategory, string> = {
    bug: 'Bug Report',
    feature_request: 'Feature Request',
    billing: 'Billing',
    technical: 'Technical',
    other: 'Other',
  };
  return labels[category];
}

function getPriorityBadgeClasses(priority: TicketPriority): string {
  switch (priority) {
    case 'low':
      return 'bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400';
    case 'medium':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    case 'high':
      return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
    case 'critical':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

function getStatusBadgeClasses(status: TicketStatus): string {
  switch (status) {
    case 'open':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'in_progress':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    case 'resolved':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    case 'closed':
      return 'bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

function getStatusLabel(status: TicketStatus): string {
  const labels: Record<TicketStatus, string> = {
    open: 'Open',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed',
  };
  return labels[status];
}

// ---------- Component ----------

export default function TenantSupport() {
  const { items: ticketsFromApi, create } = useSupportTickets();
  const user = useAuthStore((s) => s.user);

  const [tickets, setTickets] = useState<SupportTicket[]>(ticketsFromApi);
  useEffect(() => {
    setTickets(ticketsFromApi);
  }, [ticketsFromApi]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state
  const [formSubject, setFormSubject] = useState('');
  const [formCategory, setFormCategory] = useState<TicketCategory | ''>('');
  const [formPriority, setFormPriority] = useState<TicketPriority | ''>('');
  const [formDescription, setFormDescription] = useState('');

  // Stats
  const stats = useMemo(() => {
    const open = tickets.filter((t) => t.status === 'open').length;
    const inProgress = tickets.filter((t) => t.status === 'in_progress').length;
    const resolved = tickets.filter((t) => t.status === 'resolved').length;
    return { open, inProgress, resolved, total: tickets.length };
  }, [tickets]);

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesStatus =
        statusFilter === 'all' || ticket.status === statusFilter;
      const matchesSearch =
        searchQuery === '' ||
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [tickets, statusFilter, searchQuery]);

  // Handlers
  function resetForm() {
    setFormSubject('');
    setFormCategory('');
    setFormPriority('');
    setFormDescription('');
  }

  async function handleSubmit() {
    if (!formSubject.trim()) {
      toast.error('Please enter a subject');
      return;
    }
    if (!formCategory) {
      toast.error('Please select a category');
      return;
    }
    if (!formPriority) {
      toast.error('Please select a priority');
      return;
    }
    if (!formDescription.trim()) {
      toast.error('Please enter a description');
      return;
    }

    try {
      await create({
        tenantId: user?.tenantId || '',
        tenantName: user?.tenantName || '',
        subject: formSubject.trim(),
        description: formDescription.trim(),
        category: formCategory,
        priority: formPriority,
        status: 'open',
      });
      resetForm();
      setDialogOpen(false);
      toast.success('Ticket created successfully');
    } catch {
      toast.error('Failed to create support ticket');
    }
  }

  function toggleExpand(id: string) {
    setExpandedTicketId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader title="Support" description="Create and track your support tickets">
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Ticket
        </Button>
      </PageHeader>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <CircleDot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.open}</p>
                <p className="text-xs text-muted-foreground">Open</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/30">
                <Loader2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.resolved}</p>
                <p className="text-xs text-muted-foreground">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-muted p-2">
                <TicketCheck className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Ticket List */}
      <div className="space-y-3">
        {filteredTickets.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageSquare className="mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">
                No tickets found
              </p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create a new ticket to get started'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTickets.map((ticket) => {
            const isExpanded = expandedTicketId === ticket.id;
            return (
              <Card
                key={ticket.id}
                className="cursor-pointer transition-colors hover:bg-muted/50"
                onClick={() => toggleExpand(ticket.id)}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold leading-tight">
                          {ticket.subject}
                        </h3>
                        {ticket.response && (
                          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                            Replied
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {ticket.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={getCategoryBadgeClasses(ticket.category)}
                        >
                          {getCategoryLabel(ticket.category)}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={getPriorityBadgeClasses(ticket.priority)}
                        >
                          {ticket.priority.charAt(0).toUpperCase() +
                            ticket.priority.slice(1)}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={getStatusBadgeClasses(ticket.status)}
                        >
                          {getStatusLabel(ticket.status)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(ticket.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 text-muted-foreground">
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <>
                      <Separator className="my-3" />
                      <div className="space-y-3">
                        <div>
                          <h4 className="mb-1 text-sm font-medium">Description</h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {ticket.description}
                          </p>
                        </div>
                        {ticket.response && (
                          <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/20">
                            <h4 className="mb-1 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                              Support Response
                            </h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {ticket.response}
                            </p>
                            {ticket.respondedAt && (
                              <p className="mt-2 text-xs text-muted-foreground/70">
                                Responded on {formatDate(ticket.respondedAt)}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* New Ticket Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Ticket</DialogTitle>
            <DialogDescription>
              Describe your issue and we will get back to you as soon as possible.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Brief description of your issue"
                value={formSubject}
                onChange={(e) => setFormSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formCategory}
                onValueChange={(v) => setFormCategory(v as TicketCategory)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">Bug Report</SelectItem>
                  <SelectItem value="feature_request">Feature Request</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formPriority}
                onValueChange={(v) => setFormPriority(v as TicketPriority)}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide details about your issue..."
                rows={5}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Submit Ticket</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
