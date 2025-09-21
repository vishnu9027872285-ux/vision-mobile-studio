import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, Upload, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getOfflineReports, syncReports } from '@/utils/offlineStorage';

interface OfflineReport {
  id: string;
  title: string;
  category: string;
  status: 'draft' | 'pending_sync';
  createdAt: string;
}

const Offline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineReports, setOfflineReports] = useState<OfflineReport[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
      if (navigator.onLine) {
        handleSync();
      }
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    loadOfflineReports();

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const loadOfflineReports = async () => {
    try {
      const reports = await getOfflineReports();
      setOfflineReports(reports as OfflineReport[]);
    } catch (error) {
      console.error('Failed to load offline reports:', error);
    }
  };

  const handleSync = async () => {
    if (!isOnline) return;
    
    setSyncing(true);
    try {
      const syncedCount = await syncReports();
      setLastSync(new Date());
      await loadOfflineReports();
      
      if (syncedCount > 0) {
        // You would typically show a toast notification here
        console.log(`Successfully synced ${syncedCount} reports`);
      }
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Connection Status */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isOnline ? (
                  <Wifi className="h-6 w-6 text-secondary" />
                ) : (
                  <WifiOff className="h-6 w-6 text-destructive" />
                )}
                <div>
                  <h2 className="text-lg font-semibold">
                    {isOnline ? 'Connected' : 'Offline Mode'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {isOnline 
                      ? 'Your reports will sync automatically'
                      : 'Reports will be saved locally and synced when connected'
                    }
                  </p>
                </div>
              </div>
              
              {isOnline && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSync}
                  disabled={syncing}
                >
                  {syncing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Sync
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sync Status */}
        {lastSync && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-secondary" />
                <div>
                  <p className="font-medium">Last Sync</p>
                  <p className="text-sm text-muted-foreground">
                    {lastSync.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Offline Reports Queue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Queued Reports ({offlineReports.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {offlineReports.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-secondary mx-auto mb-4" />
                <p className="text-muted-foreground">All reports are synced</p>
              </div>
            ) : (
              <div className="space-y-3">
                {offlineReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {report.id}
                        </Badge>
                        <Badge 
                          variant={report.status === 'draft' ? 'secondary' : 'default'}
                          className="text-xs"
                        >
                          {report.status === 'draft' ? 'Draft' : 'Pending Sync'}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-sm">{report.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {report.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(report.createdAt)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {report.status === 'pending_sync' && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Upload className="h-3 w-3" />
                          Ready to sync
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Offline Capabilities */}
        <Card>
          <CardHeader>
            <CardTitle>Offline Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-secondary mt-0.5" />
              <div>
                <p className="font-medium">Create Reports</p>
                <p className="text-sm text-muted-foreground">
                  Take photos, record voice notes, and submit reports offline
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-secondary mt-0.5" />
              <div>
                <p className="font-medium">View Previous Reports</p>
                <p className="text-sm text-muted-foreground">
                  Access your report history and cached data
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-secondary mt-0.5" />
              <div>
                <p className="font-medium">Auto-Sync</p>
                <p className="text-sm text-muted-foreground">
                  Reports automatically sync when connection is restored
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Storage Info */}
        <Card>
          <CardHeader>
            <CardTitle>Storage Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Offline Reports</span>
                <span>{offlineReports.length} items</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Storage Used</span>
                <span>~{(offlineReports.length * 0.5).toFixed(1)} MB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Available Space</span>
                <span>Checking...</span>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Offline;