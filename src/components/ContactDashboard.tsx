import React, { useState } from 'react';
import { ContactSubmission, Subscriber } from '../types';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { 
  Mail, Search, Filter, Trash2, Eye, Archive, CheckCircle2, Inbox, 
  MessageSquare, User, Calendar, Clock, Building2, Phone, UserPlus, StickyNote
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface ContactDashboardProps {
  submissions: ContactSubmission[];
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: 'new' | 'read' | 'archived') => void;
  onAddToSubscribers: (data: Omit<Subscriber, 'id'>) => void;
}

export function ContactDashboard({ submissions, onDelete, onStatusChange, onAddToSubscribers }: ContactDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [subscriberToCreate, setSubscriberToCreate] = useState<Partial<Subscriber> | null>(null);

  const initiateAddToAudience = (submission: ContactSubmission) => {
      setSubscriberToCreate({
          email: submission.email,
          name: submission.name,
          company: submission.company,
          phone: submission.phone,
          status: 'subscribed',
          source: 'contact_form',
          joinedAt: new Date().toISOString(),
          tags: ['from_contact'],
          messageHistory: [{
              date: submission.submittedAt,
              subject: 'Contact Form Submission'
          }]
      });
  };

  const confirmAddToAudience = () => {
      if (subscriberToCreate && subscriberToCreate.email) {
          onAddToSubscribers(subscriberToCreate as Omit<Subscriber, 'id'>);
          setSubscriberToCreate(null);
          // Also close the submission detail if open
          // setSelectedSubmission(null); // Optional: keep it open? Let's keep it open.
      }
  };

  // Stats
  const total = submissions.length;
  const unread = submissions.filter(s => s.status === 'new').length;
  const archived = submissions.filter(s => s.status === 'archived').length;

  const filteredItems = submissions.filter(item => {
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
            item.name.toLowerCase().includes(query) ||
            item.email.toLowerCase().includes(query) ||
            (item.company && item.company.toLowerCase().includes(query)) ||
            (item.phone && item.phone.toLowerCase().includes(query)) ||
            (item.message && item.message.toLowerCase().includes(query))
        );
    }
    return true;
  });

  const StatsCard = ({ title, value, icon: Icon, color }: any) => (
      <Card className="flex-1 border-none shadow-sm bg-white">
          <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
                  <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
              </div>
              <div>
                  <p className="text-sm font-medium text-gray-500">{title}</p>
                  <h3 className="text-2xl font-bold">{value}</h3>
              </div>
          </CardContent>
      </Card>
  );

  return (
    <div className="container mx-auto py-8 px-6 space-y-8 max-w-7xl">
      
      {/* Header */}
      <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
             <Mail className="w-6 h-6" />
             Inbox
          </h1>
          <p className="text-gray-500 mt-1">Manage inquiries and contact form submissions.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard title="Total Messages" value={total} icon={Inbox} color="bg-blue-500 text-blue-500" />
          <StatsCard title="Unread" value={unread} icon={MessageSquare} color="bg-green-500 text-green-500" />
          <StatsCard title="Archived" value={archived} icon={Archive} color="bg-gray-500 text-gray-500" />
      </div>

      {/* Main Content */}
      <Card className="border shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
        <div className="p-4 border-b bg-white flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                    type="search"
                    placeholder="Search name, company, email..."
                    className="w-full pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="w-[180px]">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="bg-gray-50 border-gray-200">
                        <div className="flex items-center gap-2">
                            <Filter className="w-3.5 h-3.5 text-gray-500" />
                            <SelectValue placeholder="Status" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Messages</SelectItem>
                        <SelectItem value="new">Unread</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        <div className="bg-white min-h-[400px]">
             {filteredItems.length === 0 ? (
                 <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                        <Inbox className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">No messages found</h3>
                    <p className="text-gray-500 mt-2 mb-6">
                        You're all caught up! No messages match your current filters.
                    </p>
                 </div>
             ) : (
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="w-[250px]">Contact</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead className="w-[300px]">Brief</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredItems.map((item) => (
                            <TableRow 
                                key={item.id} 
                                className={`group hover:bg-gray-50/50 cursor-pointer ${item.status === 'new' ? 'bg-blue-50/30' : ''}`}
                                onClick={() => {
                                    setSelectedSubmission(item);
                                    if(item.status === 'new') onStatusChange(item.id, 'read');
                                }}
                            >
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 font-bold text-xs">
                                            {item.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className={`text-sm ${item.status === 'new' ? 'font-bold text-gray-900' : 'text-gray-700'}`}>{item.name}</div>
                                            <div className="text-xs text-gray-500">{item.email}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {item.company ? (
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <Building2 className="w-3 h-3 text-gray-400" />
                                            <span className="text-sm">{item.company}</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-400 italic">Individual</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="text-xs text-gray-600 truncate max-w-[280px]">
                                        {item.message}
                                    </div>
                                </TableCell>
                                <TableCell className="text-gray-500 text-sm whitespace-nowrap">
                                    {new Date(item.submittedAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={item.status === 'new' ? 'default' : 'secondary'} className={
                                        item.status === 'new' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200' : 
                                        item.status === 'archived' ? 'bg-gray-100 text-gray-500' : 
                                        'bg-gray-100 text-gray-700'
                                    }>
                                        {item.status === 'new' ? 'New' : item.status === 'archived' ? 'Archived' : 'Read'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                        <Button variant="ghost" size="icon" onClick={() => setSelectedSubmission(item)}>
                                            <Eye className="w-4 h-4 text-gray-500" />
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <Clock className="w-4 h-4 text-gray-500" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => onStatusChange(item.id, 'new')}>
                                                    <Mail className="w-4 h-4 mr-2" /> Mark as Unread
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onStatusChange(item.id, 'archived')}>
                                                    <Archive className="w-4 h-4 mr-2" /> Archive
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => initiateAddToAudience(item)}>
                                                    <UserPlus className="w-4 h-4 mr-2" /> Add to Audience
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600" onClick={() => onDelete(item.id)}>
                                                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
             )}
        </div>
      </Card>

      {/* Detail View Modal */}
      <Dialog open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
        <DialogContent className="max-w-2xl">
            <DialogHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{selectedSubmission?.status}</Badge>
                        <DialogDescription className="text-sm text-gray-500">
                            {selectedSubmission?.submittedAt && new Date(selectedSubmission.submittedAt).toLocaleString()}
                        </DialogDescription>
                    </div>
                </div>
                <DialogTitle className="text-2xl mt-1">{selectedSubmission?.name}</DialogTitle>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                    {selectedSubmission?.company && (
                        <div className="flex items-center gap-1.5">
                            <Building2 className="w-4 h-4" />
                            {selectedSubmission.company}
                        </div>
                    )}
                    <div className="flex items-center gap-1.5">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${selectedSubmission?.email}`} className="hover:text-blue-600 underline-offset-4 hover:underline">
                            {selectedSubmission?.email}
                        </a>
                    </div>
                    {selectedSubmission?.phone && (
                        <div className="flex items-center gap-1.5">
                            <Phone className="w-4 h-4" />
                            <a href={`tel:${selectedSubmission?.phone}`} className="hover:text-blue-600 underline-offset-4 hover:underline">
                                {selectedSubmission?.phone}
                            </a>
                        </div>
                    )}
                </div>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
                <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Project Brief</h4>
                    <div className="text-gray-800 leading-relaxed whitespace-pre-wrap p-4 bg-gray-50 rounded-lg border border-gray-100">
                        {selectedSubmission?.message || <span className="text-gray-400 italic">No brief provided.</span>}
                    </div>
                </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
                <div className="flex gap-2 w-full justify-end">
                    <Button variant="outline" onClick={() => initiateAddToAudience(selectedSubmission!)}>
                        <UserPlus className="w-4 h-4 mr-2" /> Add to Audience
                    </Button>
                    <Button variant="outline" onClick={() => {
                        if (selectedSubmission) onStatusChange(selectedSubmission.id, 'archived');
                        setSelectedSubmission(null);
                    }}>
                        <Archive className="w-4 h-4 mr-2" /> Archive
                    </Button>
                    <Button variant="destructive" onClick={() => {
                        if (selectedSubmission) onDelete(selectedSubmission.id);
                        setSelectedSubmission(null);
                    }}>
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                </div>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add to Audience Dialog */}
      <Dialog open={!!subscriberToCreate} onOpenChange={(open) => !open && setSubscriberToCreate(null)}>
        <DialogContent className="max-w-md">
            <DialogHeader>
                <DialogTitle>Add to Audience</DialogTitle>
                <DialogDescription>
                    Review and enrich the subscriber profile before adding them to your audience.
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
                <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input 
                        value={subscriberToCreate?.name || ''} 
                        onChange={(e) => setSubscriberToCreate(prev => ({ ...prev!, name: e.target.value }))}
                        placeholder="John Doe"
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input 
                            value={subscriberToCreate?.email || ''} 
                            disabled
                            className="bg-gray-50"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input 
                            value={subscriberToCreate?.phone || ''} 
                            onChange={(e) => setSubscriberToCreate(prev => ({ ...prev!, phone: e.target.value }))}
                            placeholder="+1 234..."
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Company</Label>
                    <Input 
                        value={subscriberToCreate?.company || ''} 
                        onChange={(e) => setSubscriberToCreate(prev => ({ ...prev!, company: e.target.value }))}
                        placeholder="Company Inc."
                    />
                </div>

                <div className="space-y-2">
                    <Label>Tags</Label>
                    <Input 
                        value={subscriberToCreate?.tags?.join(', ') || ''}
                        onChange={(e) => setSubscriberToCreate(prev => ({ ...prev!, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))}
                        placeholder="client, lead, etc."
                    />
                    <p className="text-xs text-gray-500">Comma separated tags</p>
                </div>

                <div className="space-y-2">
                    <Label>Internal Notes</Label>
                    <Textarea 
                        value={subscriberToCreate?.notes || ''} 
                        onChange={(e) => setSubscriberToCreate(prev => ({ ...prev!, notes: e.target.value }))}
                        placeholder="Add notes about this contact..."
                        className="resize-none"
                    />
                </div>
            </div>

            <DialogFooter>
                <Button variant="outline" onClick={() => setSubscriberToCreate(null)}>Cancel</Button>
                <Button onClick={confirmAddToAudience}>
                    <UserPlus className="w-4 h-4 mr-2" /> Confirm & Add
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}