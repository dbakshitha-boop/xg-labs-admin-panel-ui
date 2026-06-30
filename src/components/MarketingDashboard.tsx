import React, { useState } from 'react';
import { Subscriber, Campaign, BlogPost, Portfolio } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { 
  Users, Mail, Send, Calendar, BarChart3, Plus, Search, Filter, 
  MoreHorizontal, Trash2, CheckCircle2, AlertCircle, Clock,
  Building2, Phone, User, MessageSquare, Globe, Linkedin, Twitter, StickyNote,
  ArrowUpRight, Users2, UserPlus, UserMinus
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

import { toast } from 'sonner@2.0.3';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface MarketingDashboardProps {
  subscribers: Subscriber[];
  campaigns: Campaign[];
  blogPosts: BlogPost[];
  portfolios: Portfolio[];
  onUpdateSubscriber: (subscriber: Subscriber) => void;
  onDeleteSubscriber: (id: string) => void;
  onCreateCampaign: (campaign: Omit<Campaign, 'id'>) => void;
}

export function MarketingDashboard({ 
    subscribers, 
    campaigns, 
    blogPosts, 
    portfolios,
    onUpdateSubscriber,
    onDeleteSubscriber,
    onCreateCampaign
}: MarketingDashboardProps) {
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Subscriber>>({});

  const handleSaveSubscriber = () => {
    if (!selectedSubscriber) return;
    
    const updated = { ...selectedSubscriber, ...editForm } as Subscriber;
    onUpdateSubscriber(updated);
    
    setSelectedSubscriber(updated);
    setIsEditing(false);
  };

  const openSubscriberDetail = (sub: Subscriber) => {
    setSelectedSubscriber(sub);
    setEditForm(sub);
    setIsEditing(false);
  };
  
  const [autoSendBlog, setAutoSendBlog] = useState(true);
  const [autoSendCaseStudy, setAutoSendCaseStudy] = useState(false);

  // Stats
  const activeSubscribers = subscribers.filter(s => s.status === 'subscribed').length;
  const totalSubscribers = subscribers.length;
  const growthRate = totalSubscribers > 0 ? Math.round((activeSubscribers / totalSubscribers) * 100) : 0;
  
  // Filter state
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubscribers = subscribers.filter(sub => {
    const matchesSearch = (sub.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
                         sub.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteSubscriber = (id: string) => {
      if(confirm('Are you sure?')) {
          onDeleteSubscriber(id);
          if (selectedSubscriber?.id === id) setSelectedSubscriber(null);
      }
  };

  return (
    <div className="container mx-auto py-8 px-6 space-y-8 max-w-7xl">
      
      {/* Header */}
      <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
             <Users className="w-6 h-6" />
             Audience & Automation
          </h1>
          <p className="text-gray-500 mt-1">Manage subscribers and automated email updates.</p>
      </div>

      <Tabs defaultValue="audience" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger value="audience" className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none">Audience</TabsTrigger>
              <TabsTrigger value="automation" className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none">Automation</TabsTrigger>
          </TabsList>

          {/* AUDIENCE TAB */}
          <TabsContent value="audience" className="mt-6 space-y-6">
              {/* Audience Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border shadow-sm bg-white">
                      <CardContent className="p-6 flex items-center gap-4">
                          <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                              <Users2 className="w-5 h-5" />
                          </div>
                          <div>
                              <p className="text-sm font-medium text-gray-500">Total Audience</p>
                              <h3 className="text-2xl font-bold">{totalSubscribers}</h3>
                          </div>
                      </CardContent>
                  </Card>
                  <Card className="border shadow-sm bg-white">
                      <CardContent className="p-6 flex items-center gap-4">
                          <div className="p-3 rounded-full bg-green-50 text-green-600">
                              <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <div>
                              <p className="text-sm font-medium text-gray-500">Active Subscribers</p>
                              <h3 className="text-2xl font-bold">{activeSubscribers}</h3>
                          </div>
                      </CardContent>
                  </Card>
                  <Card className="border shadow-sm bg-white">
                      <CardContent className="p-6 flex items-center gap-4">
                          <div className="p-3 rounded-full bg-indigo-50 text-indigo-600">
                              <ArrowUpRight className="w-5 h-5" />
                          </div>
                          <div>
                              <p className="text-sm font-medium text-gray-500">Engagement Rate</p>
                              <h3 className="text-2xl font-bold">{growthRate}%</h3>
                          </div>
                      </CardContent>
                  </Card>
              </div>

              <Card className="border shadow-sm overflow-hidden">
                  <div className="p-4 border-b bg-white flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="relative w-full sm:w-72">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                          <Input 
                            placeholder="Search by name or email..." 
                            className="pl-9 bg-gray-50/50" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                          <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-[180px]">
                              <div className="flex items-center gap-2 text-gray-500">
                                <Filter className="w-4 h-4" />
                                <SelectValue placeholder="Filter Status" />
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Subscribers</SelectItem>
                              <SelectItem value="subscribed">Subscribed</SelectItem>
                              <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="outline" size="icon">
                             <MoreHorizontal className="w-4 h-4" />
                          </Button>
                      </div>
                  </div>
                  <Table>
                      <TableHeader className="bg-gray-50/50">
                          <TableRow>
                              <TableHead className="w-[300px]">Contact</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Source</TableHead>
                              <TableHead>Joined</TableHead>
                              <TableHead>Tags</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody className="bg-white">
                          {filteredSubscribers.length === 0 ? (
                              <TableRow>
                                  <TableCell colSpan={6} className="h-[400px] text-center">
                                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                            <Users className="w-8 h-8 text-gray-300" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">No subscribers found</h3>
                                        <p className="text-gray-500 mt-2 mb-6 text-center">
                                            {searchQuery ? 'Try adjusting your search terms or filters.' : 'Start building your audience by adding subscribers or importing contacts.'}
                                        </p>
                                      </div>
                                  </TableCell>
                              </TableRow>
                          ) : filteredSubscribers.map((sub) => (
                              <TableRow 
                                key={sub.id} 
                                className="cursor-pointer hover:bg-gray-50/80 transition-colors group"
                                onClick={() => openSubscriberDetail(sub)}
                              >
                                  <TableCell>
                                      <div className="flex items-center gap-3">
                                          <Avatar className="h-9 w-9 border">
                                              <AvatarFallback className="bg-indigo-50 text-indigo-700 text-xs font-medium">
                                                {sub.name ? sub.name.substring(0, 2).toUpperCase() : sub.email.substring(0, 2).toUpperCase()}
                                              </AvatarFallback>
                                          </Avatar>
                                          <div className="flex flex-col">
                                              <span className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                {sub.name || 'Unknown User'}
                                              </span>
                                              <span className="text-xs text-gray-500">{sub.email}</span>
                                          </div>
                                      </div>
                                  </TableCell>
                                  <TableCell>
                                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                          sub.status === 'subscribed' 
                                            ? 'bg-green-50 text-green-700 border-green-200' 
                                            : 'bg-gray-100 text-gray-600 border-gray-200'
                                      }`}>
                                          <div className={`w-1.5 h-1.5 rounded-full ${sub.status === 'subscribed' ? 'bg-green-500' : 'bg-gray-400'}`} />
                                          <span className="capitalize">{sub.status}</span>
                                      </div>
                                  </TableCell>
                                  <TableCell>
                                      <div className="flex items-center gap-2 text-gray-600 text-xs">
                                          {sub.source?.includes('web') ? <Globe className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
                                          <span className="capitalize">{sub.source?.replace('_', ' ') || 'Direct'}</span>
                                      </div>
                                  </TableCell>
                                  <TableCell className="text-gray-500 text-xs">
                                      {new Date(sub.joinedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </TableCell>
                                  <TableCell>
                                      <div className="flex gap-1 flex-wrap">
                                          {sub.tags?.slice(0, 2).map(tag => (
                                              <span key={tag} className="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px] font-medium text-gray-600">
                                                  {tag}
                                              </span>
                                          ))}
                                          {sub.tags && sub.tags.length > 2 && (
                                              <span className="px-1.5 py-0.5 bg-gray-50 border border-gray-200 rounded text-[10px] text-gray-400">
                                                  +{sub.tags.length - 2}
                                              </span>
                                          )}
                                      </div>
                                  </TableCell>
                                  <TableCell className="text-right">
                                      <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900" onClick={(e) => e.stopPropagation()}>
                                                <MoreHorizontal className="w-4 h-4" />
                                              </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end" className="w-48">
                                              <DropdownMenuItem onClick={() => openSubscriberDetail(sub)}>
                                                  <User className="w-4 h-4 mr-2" /> View Profile
                                              </DropdownMenuItem>
                                              <DropdownMenuItem className="text-red-600" onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleDeleteSubscriber(sub.id);
                                              }}>
                                                  <Trash2 className="w-4 h-4 mr-2" /> Remove Subscriber
                                              </DropdownMenuItem>
                                          </DropdownMenuContent>
                                      </DropdownMenu>
                                  </TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
              </Card>
          </TabsContent>

          {/* AUTOMATION TAB */}
          <TabsContent value="automation" className="mt-6 max-w-3xl">
              <Card className="bg-white">
                  <CardHeader>
                      <CardTitle>Automatic Updates</CardTitle>
                      <CardDescription>Configure when to automatically send emails to your subscribers.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="space-y-1">
                              <Label className="text-base font-medium">New Blog Post</Label>
                              <p className="text-sm text-gray-500">Automatically email subscribers when you publish a new blog post.</p>
                          </div>
                          <Switch checked={autoSendBlog} onCheckedChange={setAutoSendBlog} />
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="space-y-1">
                              <Label className="text-base font-medium">New Case Study</Label>
                              <p className="text-sm text-gray-500">Automatically email subscribers when you publish a new portfolio case study.</p>
                          </div>
                          <Switch checked={autoSendCaseStudy} onCheckedChange={setAutoSendCaseStudy} />
                      </div>

                  </CardContent>
              </Card>
          </TabsContent>
      </Tabs>

      {/* Subscriber Detail View */}
      <Dialog open={!!selectedSubscriber} onOpenChange={(open) => !open && setSelectedSubscriber(null)}>
          <DialogContent className="max-w-2xl">
              <DialogHeader>
                  <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            {isEditing ? (
                                <Input 
                                    value={editForm.name || ''} 
                                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                    placeholder="Subscriber Name"
                                    className="h-8 text-lg font-medium px-2 -ml-2 w-full"
                                />
                            ) : (
                                <DialogTitle className="text-xl">{selectedSubscriber?.name || selectedSubscriber?.email}</DialogTitle>
                            )}
                            
                            <DialogDescription>
                                {selectedSubscriber?.name ? selectedSubscriber.email : 'Subscriber Details'}
                            </DialogDescription>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                      </Button>
                  </div>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-8 py-4">
                  <div className="space-y-6">
                      <div className="space-y-4">
                          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Contact Details</h4>
                          <div className="space-y-3">
                              {isEditing ? (
                                  <div className="space-y-3">
                                      <div className="space-y-1">
                                          <Label className="text-xs">Email Address</Label>
                                          <Input 
                                              value={editForm.email || ''} 
                                              disabled
                                              className="bg-gray-50"
                                          />
                                      </div>
                                  </div>
                              ) : (
                                  <>
                                      <div className="flex items-center gap-2">
                                          <Mail className="w-4 h-4 text-gray-400" />
                                          <span className="text-sm">{selectedSubscriber?.email}</span>
                                      </div>
                                  </>
                              )}
                          </div>
                      </div>

                      <div className="space-y-4">
                          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Tags</h4>
                          {isEditing ? (
                              <Input 
                                  value={editForm.tags?.join(', ') || ''}
                                  onChange={(e) => setEditForm({...editForm, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})}
                                  placeholder="tag1, tag2"
                              />
                          ) : (
                              <div className="flex flex-wrap gap-2">
                                  {selectedSubscriber?.tags?.map(tag => (
                                      <Badge key={tag} variant="secondary">{tag}</Badge>
                                  )) || <span className="text-sm text-gray-400">No tags</span>}
                              </div>
                          )}
                      </div>

                      <div className="space-y-4">
                          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Internal Notes</h4>
                          {isEditing ? (
                              <Textarea 
                                  value={editForm.notes || ''}
                                  onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                                  placeholder="Add private notes about this subscriber..."
                                  className="h-24 resize-none"
                              />
                          ) : (
                              <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100 text-sm text-yellow-800 flex gap-2">
                                  <StickyNote className="w-4 h-4 shrink-0 mt-0.5" />
                                  <p>{selectedSubscriber?.notes || <span className="italic opacity-70">No notes added.</span>}</p>
                              </div>
                          )}
                      </div>
                  </div>

                  <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Journey & History</h4>
                      <div className="relative border-l-2 border-gray-100 pl-4 space-y-6">
                          
                          {selectedSubscriber?.joinedAt && (
                              <div className="relative">
                                  <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white ${selectedSubscriber.source === 'contact_form' ? 'bg-purple-500' : 'bg-green-500'}`} />
                                  <p className="text-sm font-medium">Joined Audience</p>
                                  <p className="text-xs text-gray-500">
                                      Via {selectedSubscriber.source?.replace('_', ' ') || 'Unknown'} • {new Date(selectedSubscriber.joinedAt).toLocaleDateString()}
                                  </p>
                              </div>
                          )}

                          {selectedSubscriber?.messageHistory?.map((msg, idx) => (
                              <div key={idx} className="relative">
                                  <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-white" />
                                  <p className="text-sm font-medium">{msg.subject}</p>
                                  <p className="text-xs text-gray-500">{new Date(msg.date).toLocaleDateString()}</p>
                              </div>
                          ))}

                      </div>
                  </div>
              </div>

              <DialogFooter className="border-t pt-4">
                  {isEditing ? (
                      <Button onClick={handleSaveSubscriber}>Save Changes</Button>
                  ) : (
                      <>
                        <Button variant="outline" onClick={() => setSelectedSubscriber(null)}>Close</Button>
                        <Button variant="destructive" onClick={() => {
                            if(selectedSubscriber) handleDeleteSubscriber(selectedSubscriber.id);
                        }}>Remove Subscriber</Button>
                      </>
                  )}
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </div>
  );
}