import React, { useState } from 'react';
import { Filter, Search, MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

// Mock data for map markers
const MOCK_ISSUES = [
  {
    id: 'NRK-123456',
    title: 'Pothole on Main Street',
    category: 'roads',
    status: 'in-progress',
    priority: 'high',
    location: { lat: 40.7128, lng: -74.0060 },
    address: 'Main Street, Downtown',
    reportedDate: '2024-01-15',
    photos: 2
  },
  {
    id: 'NRK-123457',
    title: 'Overflowing Garbage Bin',
    category: 'sanitation',
    status: 'resolved',
    priority: 'medium',
    location: { lat: 40.7158, lng: -74.0050 },
    address: 'Central Park Entrance',
    reportedDate: '2024-01-14',
    photos: 3
  },
  {
    id: 'NRK-123458',
    title: 'Street Light Not Working',
    category: 'utilities',
    status: 'open',
    priority: 'medium',
    location: { lat: 40.7098, lng: -74.0070 },
    address: '5th Avenue & Oak Street',
    reportedDate: '2024-01-13',
    photos: 1
  }
];

const STATUS_CONFIG = {
  'open': { label: 'Open', variant: 'destructive' as const, color: '#dc2626' },
  'under-review': { label: 'Under Review', variant: 'secondary' as const, color: '#6b7280' },
  'in-progress': { label: 'In Progress', variant: 'default' as const, color: '#1e40af' },
  'resolved': { label: 'Resolved', variant: 'outline' as const, color: '#059669' }
};

const CATEGORY_LABELS = {
  'sanitation': 'Sanitation',
  'roads': 'Roads & Transportation',
  'utilities': 'Utilities',
  'public-safety': 'Public Safety',
  'infrastructure': 'Infrastructure',
  'environment': 'Environment'
};

const Map = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedIssue, setSelectedIssue] = useState<typeof MOCK_ISSUES[0] | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Filter issues based on current filters
  const filteredIssues = MOCK_ISSUES.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || issue.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Map Container */}
      <div className="relative h-[70vh] bg-muted">
        {/* Placeholder for actual map implementation */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="text-center">
            <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Interactive Map</h3>
            <p className="text-muted-foreground">Map integration would be implemented here</p>
            <p className="text-sm text-muted-foreground mt-2">
              Showing {filteredIssues.length} issues in the area
            </p>
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <Card>
            <CardContent className="p-3">
              <div className="flex gap-2">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search location or issues..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <SheetHeader>
                      <SheetTitle>Filter Issues</SheetTitle>
                    </SheetHeader>
                    <div className="space-y-4 mt-6">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Status</label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="under-review">Under Review</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Category</label>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                              <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Button 
                        onClick={getUserLocation}
                        variant="outline" 
                        className="w-full"
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        Center on My Location
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 z-10">
          <Card>
            <CardContent className="p-3">
              <div className="space-y-2">
                <p className="text-xs font-medium text-foreground">Status Legend</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                    <div key={status} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: config.color }}
                      />
                      <span className="text-muted-foreground">{config.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Issues List */}
      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Issues in Area ({filteredIssues.length})
            </h2>
            <Button variant="outline" size="sm">
              List View
            </Button>
          </div>

          <div className="space-y-3">
            {filteredIssues.map((issue) => (
              <Card key={issue.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {issue.id}
                        </Badge>
                        <Badge variant={STATUS_CONFIG[issue.status as keyof typeof STATUS_CONFIG].variant}>
                          {STATUS_CONFIG[issue.status as keyof typeof STATUS_CONFIG].label}
                        </Badge>
                      </div>
                      <h3 className="font-medium text-foreground mb-1">{issue.title}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{issue.address}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {formatDate(issue.reportedDate)}
                      </p>
                      {issue.photos > 0 && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          {issue.photos} photos
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-xs">
                      {CATEGORY_LABELS[issue.category as keyof typeof CATEGORY_LABELS]}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedIssue(issue)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredIssues.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No issues found matching your criteria.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 pb-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Area Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {MOCK_ISSUES.filter(i => i.status === 'open').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Open Issues</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-secondary">
                    {MOCK_ISSUES.filter(i => i.status === 'in-progress').length}
                  </p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent">
                    {MOCK_ISSUES.filter(i => i.status === 'resolved').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {MOCK_ISSUES.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Reports</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Map;