import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Download, 
  RefreshCw,
  Users,
  MapPin,
  Clock,
  Target,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

// Mock analytics data
const PERFORMANCE_METRICS = {
  totalReports: 1248,
  resolvedReports: 1003,
  avgResolutionTime: 3.2,
  citizenSatisfaction: 4.2,
  responseTime: 2.1,
  departmentEfficiency: 87
};

const MONTHLY_TRENDS = [
  { month: 'Jan', reports: 98, resolved: 89, satisfaction: 4.1 },
  { month: 'Feb', reports: 112, resolved: 105, satisfaction: 4.3 },
  { month: 'Mar', reports: 134, resolved: 128, satisfaction: 4.2 },
  { month: 'Apr', reports: 108, resolved: 102, satisfaction: 4.4 },
  { month: 'May', reports: 142, resolved: 134, satisfaction: 4.1 },
  { month: 'Jun', reports: 156, resolved: 148, satisfaction: 4.3 }
];

const DEPARTMENT_PERFORMANCE = [
  { 
    name: 'Sanitation', 
    reports: 302, 
    resolved: 287, 
    avgTime: 2.8, 
    satisfaction: 4.3,
    efficiency: 95 
  },
  { 
    name: 'Roads & Transportation', 
    reports: 239, 
    resolved: 220, 
    avgTime: 4.1, 
    satisfaction: 4.0,
    efficiency: 92 
  },
  { 
    name: 'Utilities', 
    reports: 199, 
    resolved: 185, 
    avgTime: 3.6, 
    satisfaction: 4.2,
    efficiency: 93 
  },
  { 
    name: 'Public Safety', 
    reports: 129, 
    resolved: 118, 
    avgTime: 2.2, 
    satisfaction: 4.4,
    efficiency: 91 
  },
  { 
    name: 'Parks & Recreation', 
    reports: 99, 
    resolved: 94, 
    avgTime: 3.9, 
    satisfaction: 4.1,
    efficiency: 95 
  }
];

const CATEGORY_BREAKDOWN = [
  { category: 'Roads', count: 298, percentage: 24, trend: '+12%' },
  { category: 'Sanitation', count: 267, percentage: 21, trend: '+8%' },
  { category: 'Utilities', count: 198, percentage: 16, trend: '-3%' },
  { category: 'Public Safety', count: 156, percentage: 13, trend: '+5%' },
  { category: 'Infrastructure', count: 134, percentage: 11, trend: '+15%' },
  { category: 'Environment', count: 89, percentage: 7, trend: '+2%' },
  { category: 'Other', count: 106, percentage: 8, trend: '-1%' }
];

const RESOLUTION_TIMELINE = [
  { timeframe: '< 24 hours', count: 342, percentage: 34 },
  { timeframe: '1-3 days', count: 456, percentage: 46 },
  { timeframe: '4-7 days', count: 156, percentage: 16 },
  { timeframe: '> 1 week', count: 49, percentage: 4 }
];

const AdminAnalytics = () => {
  const [dateRange, setDateRange] = useState('month');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const calculateResolutionRate = (resolved: number, total: number) => {
    return Math.round((resolved / total) * 100);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into city performance and trends
          </p>
        </div>
        
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{PERFORMANCE_METRICS.totalReports.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {calculateResolutionRate(PERFORMANCE_METRICS.resolvedReports, PERFORMANCE_METRICS.totalReports)}%
            </div>
            <p className="text-xs text-muted-foreground">+3% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{PERFORMANCE_METRICS.avgResolutionTime} days</div>
            <p className="text-xs text-muted-foreground">-0.3 days improved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citizen Satisfaction</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{PERFORMANCE_METRICS.citizenSatisfaction}/5</div>
            <p className="text-xs text-muted-foreground">+0.1 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{PERFORMANCE_METRICS.responseTime} hrs</div>
            <p className="text-xs text-muted-foreground">-0.4 hrs improved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{PERFORMANCE_METRICS.departmentEfficiency}%</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="resolution">Resolution</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {MONTHLY_TRENDS.map((month) => (
                    <div key={month.month} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{month.month}</span>
                        <span>{month.resolved}/{month.reports}</span>
                      </div>
                      <Progress 
                        value={calculateResolutionRate(month.resolved, month.reports)} 
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Resolution Rate: {calculateResolutionRate(month.resolved, month.reports)}%</span>
                        <span>Satisfaction: {month.satisfaction}/5</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Reports by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {CATEGORY_BREAKDOWN.map((item) => (
                    <div key={item.category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{item.category}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{item.count}</span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            item.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {item.trend}
                          </span>
                        </div>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {DEPARTMENT_PERFORMANCE.map((dept) => (
                  <div key={dept.name} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{dept.name}</h4>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>Efficiency: {dept.efficiency}%</span>
                        <span>Satisfaction: {dept.satisfaction}/5</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Total Reports</span>
                        <div className="font-medium">{dept.reports}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Resolved</span>
                        <div className="font-medium">{dept.resolved}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg Time</span>
                        <div className="font-medium">{dept.avgTime} days</div>
                      </div>
                    </div>
                    <Progress 
                      value={calculateResolutionRate(dept.resolved, dept.reports)} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {CATEGORY_BREAKDOWN.map((item) => (
                    <div key={item.category} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-primary rounded-sm" />
                        <span className="font-medium">{item.category}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{item.count}</div>
                        <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {CATEGORY_BREAKDOWN.map((item) => (
                    <div key={item.category} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{item.category}</div>
                        <div className="text-sm text-muted-foreground">{item.count} reports</div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.trend.startsWith('+') 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {item.trend}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resolution" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Resolution Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {RESOLUTION_TIMELINE.map((item) => (
                    <div key={item.timeframe} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{item.timeframe}</span>
                        <span className="text-sm text-muted-foreground">
                          {item.count} reports ({item.percentage}%)
                        </span>
                      </div>
                      <Progress value={item.percentage} className="h-3" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resolution Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {calculateResolutionRate(PERFORMANCE_METRICS.resolvedReports, PERFORMANCE_METRICS.totalReports)}%
                    </div>
                    <p className="text-muted-foreground">Overall Resolution Rate</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Same Day Resolution</span>
                      <span className="font-medium">34%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Within SLA</span>
                      <span className="font-medium">89%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Escalated Issues</span>
                      <span className="font-medium">8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Citizen Satisfaction</span>
                      <span className="font-medium">4.2/5</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalytics;