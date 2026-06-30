import React, { useState, useMemo } from 'react';
import { Portfolio, BlogPost } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  Plus, Edit, Eye, Trash2, Globe, FileText, 
  ShieldCheck, ShieldAlert, MoreHorizontal, CheckCircle2, Calendar, User, Search, Filter, X,
  LayoutGrid, List as ListIcon, BarChart3, TrendingUp, Clock, Send
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface DashboardProps {
  type: 'portfolio' | 'blog';
  items: (Portfolio | BlogPost)[];
  onCreate: () => void;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: 'draft' | 'published') => void;
  onSendUpdate?: (id: string) => void;
}

export function Dashboard({ 
  type,
  items, 
  onCreate, 
  onEdit, 
  onView, 
  onDelete, 
  onStatusChange,
  onSendUpdate
}: DashboardProps) {
  const [isAdmin, setIsAdmin] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const isPortfolio = type === 'portfolio';

  // Extract unique tags
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    
    items.forEach(item => {
      // Tags
      let itemTagsString = '';
      if (isPortfolio) {
        itemTagsString = (item as Portfolio).hero.tags || '';
      } else {
        const post = item as BlogPost;
        itemTagsString = post.tags || '';
      }
      
      if (itemTagsString) {
        itemTagsString.split(/[|,]/).forEach(t => {
            const cleanTag = t.trim();
            if (cleanTag) tags.add(cleanTag);
        });
      }
    });
    
    return Array.from(tags).sort();
  }, [items, isPortfolio]);

  const filteredItems = useMemo(() => {
    let result = items.filter(item => {
      // 1. Status Filter
      if (activeTab !== 'all' && item.status !== activeTab) return false;

      // 2. Tag Filter
      if (selectedTag !== 'all') {
          let itemTags = '';
          if (isPortfolio) {
              itemTags = (item as Portfolio).hero.tags || '';
          } else {
              itemTags = (item as BlogPost).tags || '';
          }
          if (!itemTags.toLowerCase().includes(selectedTag.toLowerCase())) return false;
      }

      // 3. Search Filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        
        // Common fields
        if (item.title.toLowerCase().includes(query)) return true;
        if (item.slug.toLowerCase().includes(query)) return true;
        
        // Type specific
        if (isPortfolio) {
            const p = item as Portfolio;
            if (p.hero.title?.toLowerCase().includes(query)) return true;
            if (p.hero.tags?.toLowerCase().includes(query)) return true;
        } else {
            const b = item as BlogPost;
            if (b.excerpt?.toLowerCase().includes(query)) return true;
            if (b.tags?.toLowerCase().includes(query)) return true;
            if (b.author?.toLowerCase().includes(query)) return true;
        }
        return false;
      }
      
      return true;
    });

    // 4. Sorting
    return result.sort((a, b) => {
        if (sortOrder === 'az') return a.title.localeCompare(b.title);
        if (sortOrder === 'za') return b.title.localeCompare(a.title);
        
        // Date sorting
        const dateA = isPortfolio ? 0 : new Date((a as BlogPost).publishedAt).getTime();
        const dateB = isPortfolio ? 0 : new Date((b as BlogPost).publishedAt).getTime();
        
        if (sortOrder === 'oldest') return dateA - dateB;
        if (sortOrder === 'newest') return dateB - dateA;
        
        return 0;
    });
  }, [items, activeTab, selectedTag, searchQuery, sortOrder, isPortfolio]);

  const title = isPortfolio ? 'Case Studies' : 'Blog Posts';
  const description = isPortfolio ? 'Manage and organize your portfolio case studies.' : 'Create and publish articles for your blog.';
  const createLabel = isPortfolio ? 'Create Case Study' : 'Create New Post';

  // Stats
  const totalItems = items.length;
  const publishedItems = items.filter(i => i.status === 'published').length;
  const draftItems = items.filter(i => i.status === 'draft').length;

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
      
      {/* Top Header with Admin Toggle */}
      <div className="flex justify-between items-center">
          <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                 {isPortfolio ? <LayoutGrid className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                 {title}
              </h1>
              <p className="text-gray-500 mt-1">{description}</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-1.5 px-3 rounded-full border shadow-sm">
             <div className="flex items-center gap-2">
                {isAdmin ? <ShieldCheck className="w-4 h-4 text-green-600" /> : <ShieldAlert className="w-4 h-4 text-gray-400" />}
                <Label htmlFor="admin-mode" className="text-xs font-medium cursor-pointer uppercase tracking-wider text-gray-500">Admin Mode</Label>
             </div>
             <Switch 
                id="admin-mode" 
                checked={isAdmin} 
                onCheckedChange={setIsAdmin} 
                className="scale-75"
              />
          </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard title={`Total ${isPortfolio ? 'Projects' : 'Posts'}`} value={totalItems} icon={BarChart3} color="bg-blue-500 text-blue-500" />
          <StatsCard title="Published" value={publishedItems} icon={Globe} color="bg-green-500 text-green-500" />
          <StatsCard title="Drafts" value={draftItems} icon={FileText} color="bg-orange-500 text-orange-500" />
      </div>

      {/* Main Content Card */}
      <Card className="border shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
        <div className="p-4 border-b bg-white flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Left: Tabs & View Toggle */}
            <div className="flex items-center gap-4 w-full md:w-auto">
                <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
                    <TabsList className="bg-gray-100">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="published" className="gap-2">
                        <CheckCircle2 className="w-3 h-3" /> Published
                    </TabsTrigger>
                    <TabsTrigger value="draft" className="gap-2">
                        <Clock className="w-3 h-3" /> Drafts
                    </TabsTrigger>
                    </TabsList>
                </Tabs>
                
                <div className="hidden md:flex bg-gray-100 rounded-md p-1 gap-1">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`h-7 w-7 p-0 ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-400'}`}
                        onClick={() => setViewMode('grid')}
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`h-7 w-7 p-0 ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-400'}`}
                        onClick={() => setViewMode('list')}
                    >
                        <ListIcon className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Right: Search, Filter, Create */}
            <div className="flex flex-1 flex-wrap gap-2 w-full md:w-auto items-center justify-end">
                <div className="relative w-full md:w-48 lg:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                        type="search"
                        placeholder={isPortfolio ? "Search projects..." : "Search posts..."}
                        className="w-full pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                
                <div className="w-[130px] shrink-0">
                    <Select value={selectedTag} onValueChange={setSelectedTag}>
                        <SelectTrigger className="bg-gray-50 border-gray-200">
                            <div className="flex items-center gap-2 truncate">
                                <Filter className="w-3.5 h-3.5 text-gray-500" />
                                <SelectValue placeholder="Tag" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Tags</SelectItem>
                            {availableTags.map(tag => (
                                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-[130px] shrink-0">
                    <Select value={sortOrder} onValueChange={setSortOrder}>
                        <SelectTrigger className="bg-gray-50 border-gray-200">
                            <div className="flex items-center gap-2 truncate">
                                <TrendingUp className="w-3.5 h-3.5 text-gray-500" />
                                <SelectValue placeholder="Sort" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                            <SelectItem value="az">Title (A-Z)</SelectItem>
                            <SelectItem value="za">Title (Z-A)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {isAdmin && (
                    <Button onClick={onCreate} className="gap-2 shadow-sm bg-zinc-900 text-white hover:bg-zinc-800">
                        <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Create</span>
                    </Button>
                )}
            </div>
        </div>
        
        {/* Content Area */}
        <div className="p-6 bg-gray-50/50 min-h-[400px]">
             
             {filteredItems.length === 0 ? (
                 <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                        <Search className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">No results found</h3>
                    <p className="text-gray-500 mt-2 max-w-md">
                        We couldn't find any {isPortfolio ? 'projects' : 'posts'} matching your current filters. Try adjusting your search or create a new one.
                    </p>
                    {isAdmin && (
                        <Button variant="outline" className="mt-6" onClick={onCreate}>Create New</Button>
                    )}
                 </div>
             ) : (
                 <>
                    {viewMode === 'grid' ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map((item) => {
                            const image = isPortfolio ? (item as Portfolio).hero.image : (item as BlogPost).coverImage;
                            const desc = isPortfolio ? (item as Portfolio).hero.title : (item as BlogPost).excerpt;
                            const date = isPortfolio ? new Date().toLocaleDateString() : (item as BlogPost).publishedAt;
                            
                            return (
                                <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-gray-200 bg-white flex flex-col h-full">
                                    <div className="aspect-video bg-gray-100 relative overflow-hidden shrink-0">
                                        {image ? (
                                        <img 
                                            src={image} 
                                            alt={item.title} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                        />
                                        ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                                            <FileText className="w-8 h-8 opacity-20 mb-2" />
                                        </div>
                                        )}
                                        
                                        <div className="absolute top-3 right-3 flex gap-2">
                                            <Badge variant={item.status === 'published' ? 'default' : 'secondary'} className={item.status === 'published' ? 'bg-green-500 hover:bg-green-600' : 'bg-white/90 backdrop-blur text-gray-600'}>
                                                {item.status === 'published' ? 'Published' : 'Draft'}
                                            </Badge>
                                        </div>

                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <Button variant="secondary" size="sm" onClick={() => onView(item.id)} className="translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                                <Eye className="w-4 h-4 mr-2" /> Preview
                                            </Button>
                                            {isAdmin && (
                                                <Button variant="secondary" size="sm" onClick={() => onEdit(item.id)} className="translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                                    <Edit className="w-4 h-4 mr-2" /> Edit
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    <CardContent className="p-5 flex-1 flex flex-col">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono uppercase tracking-wider mb-2">
                                            <span>{date}</span>
                                        </div>
                                        <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
                                            {desc || "No description provided."}
                                        </p>
                                        
                                        <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-100">
                                            {(isPortfolio ? (item as Portfolio).hero.tags : (item as BlogPost).tags)?.split(',').slice(0, 3).map((tag, i) => (
                                                <span key={i} className="text-[10px] px-2 py-1 bg-gray-100 rounded text-gray-600 font-medium uppercase tracking-wide">
                                                    {tag.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </CardContent>
                                    
                                    {isAdmin && (
                                        <div className="px-5 py-3 bg-gray-50 border-t flex justify-between items-center text-xs text-gray-500">
                                            <span>{item.slug}</span>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-white">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => onEdit(item.id)}>
                                                    <Edit className="w-4 h-4 mr-2" /> Edit Content
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onView(item.id)}>
                                                    <Eye className="w-4 h-4 mr-2" /> View Live
                                                </DropdownMenuItem>
                                                {onSendUpdate && item.status === 'published' && (
                                                    <DropdownMenuItem onClick={() => onSendUpdate(item.id)}>
                                                        <Send className="w-4 h-4 mr-2" /> Send to Subscribers
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuSeparator />
                                                {item.status === 'published' ? (
                                                    <DropdownMenuItem onClick={() => onStatusChange(item.id, 'draft')}>
                                                        <FileText className="w-4 h-4 mr-2" /> Revert to Draft
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem onClick={() => onStatusChange(item.id, 'published')}>
                                                        <Globe className="w-4 h-4 mr-2" /> Publish Now
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600" onClick={() => onDelete(item.id)}>
                                                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    )}
                                </Card>
                            );
                        })}
                        </div>
                    ) : (
                        <Card className="overflow-hidden border-none shadow-sm">
                            <Table>
                                <TableHeader className="bg-gray-50">
                                    <TableRow>
                                        <TableHead className="w-[400px]">Title</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Author / Tags</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredItems.map((item) => (
                                        <TableRow key={item.id} className="group hover:bg-gray-50/50">
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded bg-gray-200 overflow-hidden shrink-0">
                                                        {(isPortfolio ? (item as Portfolio).hero.image : (item as BlogPost).coverImage) && (
                                                            <img src={isPortfolio ? (item as Portfolio).hero.image : (item as BlogPost).coverImage} className="w-full h-full object-cover" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900">{item.title}</div>
                                                        <div className="text-xs text-gray-500 font-mono">{item.slug}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={item.status === 'published' ? 'default' : 'secondary'} className={item.status === 'published' ? 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'}>
                                                    {item.status === 'published' ? 'Published' : 'Draft'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-gray-500">
                                                {isPortfolio ? new Date().toLocaleDateString() : (item as BlogPost).publishedAt}
                                            </TableCell>
                                            <TableCell className="text-gray-500">
                                                {isPortfolio ? (
                                                    <span className="text-xs uppercase bg-gray-100 px-2 py-1 rounded">{(item as Portfolio).hero.tags?.split(',')[0]}</span>
                                                ) : (
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <User className="w-3 h-3" /> {(item as BlogPost).author}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" onClick={() => onView(item.id)} title="View">
                                                        <Eye className="w-4 h-4 text-gray-500" />
                                                    </Button>
                                                    {isAdmin && (
                                                        <>
                                                            <Button variant="ghost" size="icon" onClick={() => onEdit(item.id)} title="Edit">
                                                                <Edit className="w-4 h-4 text-gray-500" />
                                                            </Button>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon">
                                                                        <MoreHorizontal className="w-4 h-4 text-gray-500" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    {onSendUpdate && item.status === 'published' && (
                                                                        <DropdownMenuItem onClick={() => onSendUpdate(item.id)}>
                                                                            <Send className="w-4 h-4 mr-2" /> Send to Subscribers
                                                                        </DropdownMenuItem>
                                                                    )}
                                                                    <DropdownMenuItem className="text-red-600" onClick={() => onDelete(item.id)}>
                                                                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    )}
                 </>
             )}
        </div>
      </Card>
    </div>
  );
}
