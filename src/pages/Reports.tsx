import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Calendar, MapPin, Eye, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Mock data for demonstration
const MOCK_REPORTS = [
  {
    id: 'NRK-123456',
    category: 'roads',
    title: 'Pothole on Main Street',
    description: 'Large pothole causing traffic issues near the shopping center intersection.',
    status: 'in-progress',
    priority: 'high',
    location: 'Main Street, Downtown',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
    photos: 2,
    estimatedResolution: '2-3 business days'
  },
  {
    id: 'NRK-123457',
    category: 'sanitation',
    title: 'Overflowing Garbage Bin',
    description: 'Public garbage bin at park entrance is overflowing and attracting pests.',
    status: 'resolved',
    priority: 'medium',
    location: 'Central Park Entrance',
    createdAt: '2024-01-14T09:15:00Z',
    updatedAt: '2024-01-15T16:45:00Z',
    photos: 3,
    estimatedResolution: 'Completed'
  },
  {
    id: 'NRK-123458',
    category: 'utilities',
    title: 'Street Light Not Working',
    description: 'Street light has been out for several days, creating safety concerns.',
    status: 'open',
    priority: 'medium',
    location: '5th Avenue & Oak Street',
    createdAt: '2024-01-13T18:22:00Z',
    updatedAt: '2024-01-13T18:22:00Z',
    photos: 1,
    estimatedResolution: '3-5 business days'
  },
  {
    id: 'NRK-123459',
    category: 'public-safety',
    title: 'Damaged Sidewalk',
    description: 'Cracked sidewalk poses tripping hazard for pedestrians.',
    status: 'under-review',
    priority: 'low',
    location: 'Elm Street near School',
    createdAt: '2024-01-12T11:30:00Z',
    updatedAt: '2024-01-14T09:10:00Z',
    photos: 4,
    estimatedResolution: '1-2 weeks'
  }
];

const STATUS_CONFIG = {
  'open': { label: 'Open', variant: 'destructive' as const },
  'under-review': { label: 'Under Review', variant: 'secondary' as const },
  'in-progress': { label: 'In Progress', variant: 'default' as const },
  'resolved': { label: 'Resolved', variant: 'outline' as const }
};

const PRIORITY_CONFIG = {
  'low': { label: 'Low', variant: 'secondary' as const },
  'medium': { label: 'Medium', variant: 'default' as const },
  'high': { label: 'High', variant: 'destructive' as const }
};

const CATEGORY_LABELS = {
  'sanitation': 'Sanitation',
  'roads': 'Roads & Transportation',
  'utilities': 'Utilities',
  'public-safety': 'Public Safety',
  'infrastructure': 'Infrastructure',
  'environment': 'Environment'
};

const Reports = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filteredAndSortedReports = useMemo(() => {
    let filtered = MOCK_REPORTS.filter(report => {
      const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || report.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });

    // Sort reports
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'priority':
          const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
          return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, statusFilter, categoryFilter, sortBy]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimeSince = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">My Reports</h1>
          <Button onClick={() => navigate('/report/new')}>
            New Report
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredAndSortedReports.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground mb-4">No reports found matching your criteria.</p>
                <Button onClick={() => navigate('/report/new')}>
                  Create Your First Report
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredAndSortedReports.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {report.id}
                        </Badge>
                        <Badge variant={STATUS_CONFIG[report.status as keyof typeof STATUS_CONFIG].variant}>
                          {STATUS_CONFIG[report.status as keyof typeof STATUS_CONFIG].label}
                        </Badge>
                        <Badge variant={PRIORITY_CONFIG[report.priority as keyof typeof PRIORITY_CONFIG].variant}>
                          {PRIORITY_CONFIG[report.priority as keyof typeof PRIORITY_CONFIG].label}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-foreground">{report.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{report.description}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/report/${report.id}`)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate max-w-32">{report.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(report.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {report.photos > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {report.photos} photos
                        </Badge>
                      )}
                      <span className="text-xs">{getTimeSince(report.updatedAt)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Category: {CATEGORY_LABELS[report.category as keyof typeof CATEGORY_LABELS]}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/report/${report.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Load More Button (for infinite scroll placeholder) */}
        {filteredAndSortedReports.length > 0 && (
          <div className="text-center mt-6">
            <Button variant="outline">
              Load More Reports
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;