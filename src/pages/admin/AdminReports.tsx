import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Download, 
  RefreshCw,
  Calendar,
  MapPin,
  User,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowUpDown,
  Eye,
  MessageSquare,
  UserCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock data for reports
const MOCK_REPORTS = [
  {
    id: 'NRK-123456',
    title: 'Water Main Break on Oak Street',
    category: 'utilities',
    status: 'urgent',
    priority: 'high',
    location: 'Oak Street & 3rd Ave',
    submittedBy: 'John Doe',
    submittedAt: '2024-01-15T08:30:00Z',
    assignedTo: 'Water Department',
    assignedStaff: 'Mike Wilson',
    description: 'Large water main break causing street flooding',
    photos: 3,
    comments: 2,
    estimatedResolution: '2024-01-16T18:00:00Z'
  },
  {
    id: 'NRK-123457',
    title: 'Pothole on Main Street',
    category: 'roads',
    status: 'in-progress',
    priority: 'medium',
    location: 'Main Street near City Hall',
    submittedBy: 'Sarah Wilson',
    submittedAt: '2024-01-14T14:20:00Z',
    assignedTo: 'Roads Department',
    assignedStaff: 'Tom Brown',
    description: 'Large pothole causing traffic issues',
    photos: 2,
    comments: 5,
    estimatedResolution: '2024-01-18T12:00:00Z'
  },
  {
    id: 'NRK-123458',
    title: 'Overflowing Garbage Bin',
    category: 'sanitation',
    status: 'resolved',
    priority: 'low',
    location: 'Central Park Entrance',
    submittedBy: 'Mike Johnson',
    submittedAt: '2024-01-13T10:15:00Z',
    assignedTo: 'Sanitation Department',
    assignedStaff: 'Lisa Davis',
    description: 'Garbage bin overflowing, attracting pests',
    photos: 1,
    comments: 1,
    estimatedResolution: '2024-01-14T16:00:00Z'
  }
];

const STATUS_CONFIG = {
  'open': { label: 'Open', variant: 'destructive' as const, icon: AlertTriangle },
  'in-progress': { label: 'In Progress', variant: 'default' as const, icon: Clock },
  'resolved': { label: 'Resolved', variant: 'outline' as const, icon: CheckCircle },
  'urgent': { label: 'Urgent', variant: 'destructive' as const, icon: AlertTriangle }
};

const PRIORITY_CONFIG = {
  'low': { label: 'Low', color: 'text-green-600' },
  'medium': { label: 'Medium', color: 'text-yellow-600' },
  'high': { label: 'High', color: 'text-red-600' }
};

const AdminReports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [sortField, setSortField] = useState('submittedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedReports(MOCK_REPORTS.map(r => r.id));
    } else {
      setSelectedReports([]);
    }
  };

  const handleSelectReport = (reportId: string, checked: boolean) => {
    if (checked) {
      setSelectedReports([...selectedReports, reportId]);
    } else {
      setSelectedReports(selectedReports.filter(id => id !== reportId));
    }
  };

  const filteredReports = MOCK_REPORTS.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || report.category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' || report.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Report Management</h1>
          <p className="text-muted-foreground">
            Manage and process citizen reports efficiently
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports by ID, title, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="roads">Roads</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="sanitation">Sanitation</SelectItem>
                  <SelectItem value="public-safety">Public Safety</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedReports.length > 0 && (
            <div className="flex items-center gap-2 mt-4 p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">
                {selectedReports.length} report(s) selected
              </span>
              <div className="flex gap-2 ml-auto">
                <Button size="sm" variant="outline">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Assign
                </Button>
                <Button size="sm" variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Update Status
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Selected
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedReports.length === filteredReports.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-32">Report ID</TableHead>
                <TableHead>Title & Location</TableHead>
                <TableHead className="w-24">Category</TableHead>
                <TableHead className="w-24">Status</TableHead>
                <TableHead className="w-20">Priority</TableHead>
                <TableHead className="w-32">Submitted</TableHead>
                <TableHead className="w-32">Assigned To</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => {
                const StatusIcon = STATUS_CONFIG[report.status as keyof typeof STATUS_CONFIG].icon;
                return (
                  <TableRow key={report.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedReports.includes(report.id)}
                        onCheckedChange={(checked) => handleSelectReport(report.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {report.id}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{report.title}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {report.location}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {report.photos > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {report.photos} photos
                            </Badge>
                          )}
                          {report.comments > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              {report.comments}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {report.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_CONFIG[report.status as keyof typeof STATUS_CONFIG].variant}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {STATUS_CONFIG[report.status as keyof typeof STATUS_CONFIG].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm font-medium ${PRIORITY_CONFIG[report.priority as keyof typeof PRIORITY_CONFIG].color}`}>
                        {PRIORITY_CONFIG[report.priority as keyof typeof PRIORITY_CONFIG].label}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{getTimeAgo(report.submittedAt)}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(report.submittedAt)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{report.assignedStaff}</div>
                        <div className="text-xs text-muted-foreground">{report.assignedTo}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserCheck className="mr-2 h-4 w-4" />
                            Reassign
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Add Comment
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark Resolved
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">
                {filteredReports.filter(r => r.status === 'open' || r.status === 'urgent').length}
              </div>
              <div className="text-sm text-muted-foreground">Pending Reports</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {filteredReports.filter(r => r.status === 'in-progress').length}
              </div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">
                {filteredReports.filter(r => r.status === 'resolved').length}
              </div>
              <div className="text-sm text-muted-foreground">Resolved</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {filteredReports.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Showing</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminReports;