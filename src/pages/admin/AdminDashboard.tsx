import React, { useState } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Users,
  MapPin,
  FileText,
  Calendar,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

// Mock data for dashboard
const DASHBOARD_METRICS = {
  totalReports: 1248,
  pendingReports: 89,
  inProgressReports: 156,
  resolvedReports: 1003,
  avgResolutionTime: 3.2,
  todayReports: 23,
  urgentReports: 12
};

const RECENT_REPORTS = [
  {
    id: 'NRK-123456',
    title: 'Water Main Break',
    category: 'utilities',
    status: 'urgent',
    priority: 'high',
    location: 'Downtown District',
    submittedBy: 'John Doe',
    timeAgo: '15 minutes ago',
    department: 'Water & Sewage'
  },
  {
    id: 'NRK-123457',
    title: 'Traffic Light Malfunction',
    category: 'infrastructure',
    status: 'in-progress',
    priority: 'medium',
    location: 'Main St & 5th Ave',
    submittedBy: 'Sarah Wilson',
    timeAgo: '1 hour ago',
    department: 'Traffic Management'
  },
  {
    id: 'NRK-123458',
    title: 'Illegal Dumping',
    category: 'sanitation',
    status: 'open',
    priority: 'low',
    location: 'Industrial Area',
    submittedBy: 'Mike Johnson',
    timeAgo: '2 hours ago',
    department: 'Sanitation'
  }
];

const DEPARTMENT_WORKLOAD = [
  { name: 'Sanitation', pending: 23, inProgress: 45, resolved: 234, total: 302 },
  { name: 'Roads & Transportation', pending: 18, inProgress: 32, resolved: 189, total: 239 },
  { name: 'Utilities', pending: 15, inProgress: 28, resolved: 156, total: 199 },
  { name: 'Public Safety', pending: 12, inProgress: 19, resolved: 98, total: 129 },
  { name: 'Parks & Recreation', pending: 8, inProgress: 15, resolved: 76, total: 99 }
];

const STATUS_CONFIG = {
  'open': { label: 'Open', variant: 'destructive' as const, color: 'bg-destructive' },
  'in-progress': { label: 'In Progress', variant: 'default' as const, color: 'bg-primary' },
  'resolved': { label: 'Resolved', variant: 'outline' as const, color: 'bg-secondary' },
  'urgent': { label: 'Urgent', variant: 'destructive' as const, color: 'bg-red-600' }
};

const AdminDashboard = () => {
  const [timeFilter, setTimeFilter] = useState('today');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const calculateProgress = (resolved: number, total: number) => {
    return Math.round((resolved / total) * 100);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening in your city today.
          </p>
        </div>
        
        <div className="flex gap-2">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{DASHBOARD_METRICS.totalReports.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{DASHBOARD_METRICS.todayReports} from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{DASHBOARD_METRICS.pendingReports}</div>
            <p className="text-xs text-muted-foreground">
              {DASHBOARD_METRICS.urgentReports} urgent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{DASHBOARD_METRICS.inProgressReports}</div>
            <p className="text-xs text-muted-foreground">
              Across all departments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{DASHBOARD_METRICS.avgResolutionTime} days</div>
            <p className="text-xs text-muted-foreground">
              -0.3 days from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Recent Priority Reports
              </CardTitle>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {RECENT_REPORTS.map((report) => (
                <div key={report.id} className="flex items-start justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {report.id}
                      </Badge>
                      <Badge variant={STATUS_CONFIG[report.status as keyof typeof STATUS_CONFIG].variant} className="text-xs">
                        {STATUS_CONFIG[report.status as keyof typeof STATUS_CONFIG].label}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-sm truncate">{report.title}</h4>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {report.location}
                      </span>
                      <span>{report.timeAgo}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Assigned to: {report.department}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Workload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Department Workload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {DEPARTMENT_WORKLOAD.map((dept) => (
                <div key={dept.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{dept.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {dept.resolved}/{dept.total} resolved
                    </span>
                  </div>
                  <Progress value={calculateProgress(dept.resolved, dept.total)} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Pending: {dept.pending}</span>
                    <span>In Progress: {dept.inProgress}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span className="text-sm">New Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Users className="h-6 w-6" />
              <span className="text-sm">Assign Team</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <MapPin className="h-6 w-6" />
              <span className="text-sm">Map View</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Calendar className="h-6 w-6" />
              <span className="text-sm">Schedule</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;