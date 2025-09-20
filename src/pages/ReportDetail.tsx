import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Camera, MessageSquare, Share2, Download, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

// Mock data for demonstration
const MOCK_REPORT = {
  id: 'NRK-123456',
  category: 'roads',
  title: 'Pothole on Main Street',
  description: 'Large pothole causing traffic issues near the shopping center intersection. The hole is approximately 2 feet wide and 6 inches deep, making it dangerous for vehicles and motorcycles. Multiple drivers have had to swerve to avoid it, creating potential safety hazards.',
  status: 'in-progress',
  priority: 'high',
  location: 'Main Street, Downtown (intersection with 5th Avenue)',
  coordinates: { lat: 40.7128, lng: -74.0060 },
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-16T14:20:00Z',
  estimatedResolution: '2-3 business days',
  assignedDepartment: 'Public Works Department',
  reporterName: 'John Doe',
  photos: [
    { id: 1, url: '/placeholder.svg', caption: 'Overview of the pothole' },
    { id: 2, url: '/placeholder.svg', caption: 'Close-up showing depth' },
    { id: 3, url: '/placeholder.svg', caption: 'Traffic impact during rush hour' }
  ],
  timeline: [
    {
      id: 1,
      date: '2024-01-16T14:20:00Z',
      status: 'in-progress',
      title: 'Work Scheduled',
      description: 'Road repair crew has been assigned and work is scheduled for tomorrow morning.',
      author: 'Public Works Dept',
      isPublic: true
    },
    {
      id: 2,
      date: '2024-01-15T16:45:00Z',
      status: 'under-review',
      title: 'Report Reviewed',
      description: 'Report has been reviewed and forwarded to the appropriate department.',
      author: 'City Administrator',
      isPublic: true
    },
    {
      id: 3,
      date: '2024-01-15T10:30:00Z',
      status: 'open',
      title: 'Report Submitted',
      description: 'Initial report submitted by citizen.',
      author: 'System',
      isPublic: true
    }
  ],
  comments: [
    {
      id: 1,
      date: '2024-01-16T09:15:00Z',
      author: 'Traffic Management',
      message: 'We\'ve placed temporary warning cones around the area to alert drivers.',
      isOfficial: true
    }
  ]
};

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

const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<typeof MOCK_REPORT.photos[0] | null>(null);

  // In a real app, fetch report by ID
  const report = MOCK_REPORT;

  if (!report) {
    return (
      <div className="min-h-screen bg-background p-4 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Report Not Found</h1>
          <Button onClick={() => navigate('/reports')}>
            Back to Reports
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Nagrik Report: ${report.title}`,
        text: `Check out this civic issue report: ${report.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      // In a real app, submit comment to API
      console.log('Adding comment:', newComment);
      setNewComment('');
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/reports')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">{report.title}</h1>
            <p className="text-sm text-muted-foreground">Report ID: {report.id}</p>
          </div>
          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Status and Details */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant={STATUS_CONFIG[report.status as keyof typeof STATUS_CONFIG].variant}>
                {STATUS_CONFIG[report.status as keyof typeof STATUS_CONFIG].label}
              </Badge>
              <Badge variant={PRIORITY_CONFIG[report.priority as keyof typeof PRIORITY_CONFIG].variant}>
                {PRIORITY_CONFIG[report.priority as keyof typeof PRIORITY_CONFIG].label}
              </Badge>
              <Badge variant="outline">
                {CATEGORY_LABELS[report.category as keyof typeof CATEGORY_LABELS]}
              </Badge>
            </div>
            <CardTitle>Issue Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-foreground mb-2">Description</h4>
              <p className="text-muted-foreground">{report.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-foreground mb-2">Location</h4>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-muted-foreground">{report.location}</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-2">Reported</h4>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{formatDate(report.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-foreground mb-2">Assigned Department</h4>
                <p className="text-muted-foreground">{report.assignedDepartment}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-2">Estimated Resolution</h4>
                <p className="text-muted-foreground">{report.estimatedResolution}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Photos */}
        {report.photos.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Photos ({report.photos.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {report.photos.map((photo) => (
                  <Dialog key={photo.id}>
                    <DialogTrigger asChild>
                      <div className="relative group cursor-pointer">
                        <img
                          src={photo.url}
                          alt={photo.caption}
                          className="w-full h-32 object-cover rounded border"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded flex items-center justify-center">
                          <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-auto max-h-[70vh] object-contain"
                      />
                      <p className="text-center text-muted-foreground">{photo.caption}</p>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Timeline */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Status Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {report.timeline.map((event, index) => (
                <div key={event.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-primary' : 'bg-muted'
                    }`} />
                    {index < report.timeline.length - 1 && (
                      <div className="w-px h-8 bg-border mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-foreground">{event.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {STATUS_CONFIG[event.status as keyof typeof STATUS_CONFIG].label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatDate(event.date)}</span>
                      <span>•</span>
                      <span>{event.author}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Comments */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Comments & Updates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {report.comments.map((comment) => (
              <div key={comment.id} className="border-l-2 border-primary/20 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-foreground">{comment.author}</span>
                  {comment.isOfficial && (
                    <Badge variant="secondary" className="text-xs">Official</Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {formatDate(comment.date)}
                  </span>
                </div>
                <p className="text-muted-foreground">{comment.message}</p>
              </div>
            ))}
            
            <Separator className="my-4" />
            
            <div className="space-y-3">
              <Label className="text-sm font-medium">Add a comment</Label>
              <Textarea
                placeholder="Share additional information or ask a question..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button 
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="w-full md:w-auto"
              >
                Post Comment
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={() => navigate('/reports')}>
            Back to Reports
          </Button>
          <Button onClick={() => navigate('/report/new')}>
            Report Similar Issue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;