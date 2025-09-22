import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, FileText, MapPin, Clock, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();

  const recentReports = [
    { id: 1, title: 'Broken streetlight on Main St', status: 'In Progress', category: 'Utilities', time: '2 hours ago' },
    { id: 2, title: 'Pothole near City Hall', status: 'Submitted', category: 'Roads', time: '1 day ago' },
    { id: 3, title: 'Garbage collection missed', status: 'Resolved', category: 'Sanitation', time: '3 days ago' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'secondary';
      case 'In Progress': return 'default';
      default: return 'outline';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <FileText className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Welcome to Nagrik</h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Your voice matters. Report civic issues and help build a better community.
        </p>
      </div>

      {/* Primary CTA */}
      <div className="space-y-4">
        {user ? (
          <>
            <Button 
              size="lg" 
              className="w-full h-14 text-lg font-semibold"
              onClick={() => navigate('/report/new')}
            >
              <FileText className="mr-2 h-6 w-6" />
              Report an Issue
            </Button>
            
            <Button 
              variant="secondary" 
              size="lg" 
              className="w-full h-12"
              onClick={() => navigate('/report/new')}
            >
              <AlertTriangle className="mr-2 h-5 w-5" />
              Emergency Report
            </Button>
          </>
        ) : (
          <Button 
            size="lg" 
            className="w-full h-14 text-lg font-semibold"
            onClick={() => navigate('/auth')}
          >
            <LogIn className="mr-2 h-6 w-6" />
            Sign In to Report Issues
          </Button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">127</div>
              <p className="text-sm text-muted-foreground">Issues Resolved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">23</div>
              <p className="text-sm text-muted-foreground">Active Reports</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Activity</span>
              <Button variant="ghost" size="sm" onClick={() => navigate('/reports')}>
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{report.title}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="text-xs">{report.category}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {report.time}
                    </span>
                  </div>
                </div>
                <Badge variant={getStatusColor(report.status)} className="text-xs">
                  {report.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="h-12" onClick={() => navigate(user ? '/map' : '/auth')}>
          <MapPin className="mr-2 h-4 w-4" />
          View Map
        </Button>
        <Button variant="outline" className="h-12" onClick={() => navigate(user ? '/profile' : '/auth')}>
          View Profile
        </Button>
      </div>

      {/* Admin Access for authorized users */}
      {user && (userRole === 'admin' || userRole === 'department_staff') && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-primary">Administrative Access</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/admin/dashboard')}
              className="w-full"
            >
              Go to Admin Dashboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Index;
