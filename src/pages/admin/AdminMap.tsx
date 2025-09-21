import React, { useState } from 'react';
import { 
  Map as MapIcon, 
  Layers, 
  Filter, 
  Download, 
  RefreshCw,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Settings,
  Eye,
  EyeOff,
  Square,
  Circle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import MapboxMap from '@/components/MapboxMap';

// Mock data for administrative map
const ADMIN_MAP_ISSUES = [
  {
    id: 'NRK-123456',
    title: 'Water Main Break',
    category: 'utilities',
    status: 'urgent',
    priority: 'high',
    location: { lat: 40.7128, lng: -74.0060 },
    address: 'Oak Street & 3rd Ave',
    reportedDate: '2024-01-15',
    photos: 3,
    upvotes: 25,
    meeTooCount: 18,
    shares: 5,
    assignedDepartment: 'Water & Sewage',
    estimatedResolution: '2024-01-16'
  },
  {
    id: 'NRK-123457',
    title: 'Traffic Light Malfunction',
    category: 'infrastructure',
    status: 'in-progress',
    priority: 'medium',
    location: { lat: 40.7158, lng: -74.0050 },
    address: 'Main St & 5th Ave',
    reportedDate: '2024-01-14',
    photos: 2,
    upvotes: 12,
    meeTooCount: 8,
    shares: 2,
    assignedDepartment: 'Traffic Management',
    estimatedResolution: '2024-01-17'
  },
  {
    id: 'NRK-123458',
    title: 'Illegal Dumping Site',
    category: 'sanitation',
    status: 'open',
    priority: 'low',
    location: { lat: 40.7098, lng: -74.0070 },
    address: 'Industrial District',
    reportedDate: '2024-01-13',
    photos: 4,
    upvotes: 7,
    meeTooCount: 3,
    shares: 1,
    assignedDepartment: 'Sanitation',
    estimatedResolution: '2024-01-20'
  }
];

const DEPARTMENT_BOUNDARIES = [
  { name: 'Downtown District', color: '#1e40af', visible: true },
  { name: 'Industrial Area', color: '#059669', visible: true },
  { name: 'Residential Zone', color: '#dc2626', visible: false },
  { name: 'Commercial District', color: '#6b7280', visible: true }
];

const MAP_LAYERS = [
  { name: 'Issue Density Heat Map', type: 'heatmap', visible: false },
  { name: 'Department Boundaries', type: 'boundaries', visible: true },
  { name: 'Traffic Layer', type: 'traffic', visible: false },
  { name: 'Satellite View', type: 'satellite', visible: false }
];

const AdminMap = () => {
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [mapLayers, setMapLayers] = useState(MAP_LAYERS);
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showClusters, setShowClusters] = useState(true);
  const [selectedDepartments, setSelectedDepartments] = useState(DEPARTMENT_BOUNDARIES);

  const toggleMapLayer = (layerName: string) => {
    setMapLayers(layers =>
      layers.map(layer =>
        layer.name === layerName
          ? { ...layer, visible: !layer.visible }
          : layer
      )
    );
  };

  const toggleDepartmentBoundary = (deptName: string) => {
    setSelectedDepartments(depts =>
      depts.map(dept =>
        dept.name === deptName
          ? { ...dept, visible: !dept.visible }
          : dept
      )
    );
  };

  const handleBulkSelection = () => {
    // Implement bulk selection logic for map markers
    console.log('Bulk selection for map markers');
  };

  const filteredIssues = ADMIN_MAP_ISSUES.filter(issue => {
    const matchesDepartment = departmentFilter === 'all' || issue.assignedDepartment.toLowerCase().includes(departmentFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || issue.priority === priorityFilter;
    
    return matchesDepartment && matchesStatus && matchesPriority;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Administrative Map</h1>
          <p className="text-muted-foreground">
            Comprehensive geographic view of all city issues and departments
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Controls Panel */}
        <div className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Department</Label>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="water">Water & Sewage</SelectItem>
                    <SelectItem value="traffic">Traffic Management</SelectItem>
                    <SelectItem value="sanitation">Sanitation</SelectItem>
                    <SelectItem value="roads">Roads Department</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Priority</Label>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Show Clusters</Label>
                <Switch
                  checked={showClusters}
                  onCheckedChange={setShowClusters}
                />
              </div>
            </CardContent>
          </Card>

          {/* Map Layers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Map Layers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mapLayers.map((layer) => (
                <div key={layer.name} className="flex items-center justify-between">
                  <Label className="text-sm font-medium">{layer.name}</Label>
                  <Switch
                    checked={layer.visible}
                    onCheckedChange={() => toggleMapLayer(layer.name)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Department Boundaries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Square className="h-5 w-5" />
                Department Boundaries
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedDepartments.map((dept) => (
                <div key={dept.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: dept.color }}
                    />
                    <Label className="text-sm font-medium">{dept.name}</Label>
                  </div>
                  <Switch
                    checked={dept.visible}
                    onCheckedChange={() => toggleDepartmentBoundary(dept.name)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Bulk Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full" onClick={handleBulkSelection}>
                Select All Visible
              </Button>
              <Button variant="outline" className="w-full">
                Assign Department
              </Button>
              <Button variant="outline" className="w-full">
                Update Priority
              </Button>
              <Button variant="outline" className="w-full">
                Export Selected
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Map Area */}
        <div className="lg:col-span-3">
          <Card className="h-[800px]">
            <CardContent className="p-0 h-full">
              <div className="relative h-full">
                {/* Map Component */}
                <MapboxMap 
                  issues={filteredIssues}
                  onIssueSelect={(issue) => console.log('Selected issue:', issue)}
                  filters={{ status: statusFilter, category: '', search: '' }}
                />

                {/* Map Controls */}
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                  <Button size="icon" variant="outline" className="bg-background/95">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" className="bg-background/95">
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" className="bg-background/95">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" className="bg-background/95">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>

                {/* Selected Issues Counter */}
                {selectedIssues.length > 0 && (
                  <div className="absolute bottom-4 left-4 z-10">
                    <Card>
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="default">
                            {selectedIssues.length} issues selected
                          </Badge>
                          <Button size="sm" variant="outline">
                            Clear Selection
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Map Statistics */}
                <div className="absolute bottom-4 right-4 z-10">
                  <Card>
                    <CardContent className="p-3">
                      <div className="text-sm space-y-1">
                        <div>Total Issues: {filteredIssues.length}</div>
                        <div>Visible: {filteredIssues.length}</div>
                        <div>Selected: {selectedIssues.length}</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Map Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">
              {filteredIssues.filter(i => i.status === 'urgent' || i.status === 'open').length}
            </div>
            <div className="text-sm text-muted-foreground">Critical Issues</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {filteredIssues.filter(i => i.status === 'in-progress').length}
            </div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">
              {Math.round(filteredIssues.reduce((avg, issue) => avg + (issue.upvotes || 0), 0) / filteredIssues.length) || 0}
            </div>
            <div className="text-sm text-muted-foreground">Avg Community Score</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">
              {new Set(filteredIssues.map(i => i.assignedDepartment)).size}
            </div>
            <div className="text-sm text-muted-foreground">Active Departments</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminMap;