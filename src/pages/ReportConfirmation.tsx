import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Home, FileText, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ReportConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { reportId, formData, photoCount } = location.state || {};

  if (!reportId) {
    navigate('/');
    return null;
  }

  const estimatedResolution = '3-5 business days';
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Nagrik Report Submitted',
        text: `I just reported an issue via Nagrik app. Report ID: ${reportId}`,
        url: window.location.origin,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const text = `I just reported an issue via Nagrik app. Report ID: ${reportId}`;
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Report Submitted Successfully!</h1>
          <p className="text-muted-foreground">Your civic issue has been reported and will be reviewed by the relevant department.</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Report Details</span>
              <Badge variant="outline" className="text-primary border-primary">
                {reportId}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge variant="secondary">Under Review</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Priority</p>
                <Badge variant="outline">Medium</Badge>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Category</p>
              <p className="text-foreground">{formData?.category || 'Not specified'}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <p className="text-foreground line-clamp-3">{formData?.description || 'No description provided'}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Photos</p>
                <p className="text-foreground">{photoCount || 0} attached</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <p className="text-foreground">{formData?.location ? 'GPS Captured' : 'Not provided'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold text-foreground mb-2">What happens next?</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Your report will be reviewed within 24 hours</p>
                <p>• The relevant department will be notified</p>
                <p>• You'll receive updates via push notifications</p>
                <p>• Estimated resolution: <span className="font-medium text-foreground">{estimatedResolution}</span></p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Button 
            onClick={handleShare}
            variant="outline" 
            className="w-full"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Report
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={() => navigate('/report/new')}
              variant="outline"
            >
              <FileText className="h-4 w-4 mr-2" />
              Report Another
            </Button>
            
            <Button 
              onClick={() => navigate('/')}
              className="bg-primary hover:bg-primary/90"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </div>
          
          <Button 
            onClick={() => navigate('/reports')}
            variant="ghost" 
            className="w-full"
          >
            View My Reports
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportConfirmation;