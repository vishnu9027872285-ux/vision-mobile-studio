import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Mock Mapbox token placeholder - in production, this would come from Supabase secrets
const MAPBOX_TOKEN = 'your-mapbox-token-here';

interface Issue {
  id: string;
  title: string;
  category: string;
  status: string;
  priority: string;
  location: { lat: number; lng: number };
  address: string;
  reportedDate: string;
  photos: number;
  upvotes?: number;
  meeTooCount?: number;
  shares?: number;
}

interface MapboxMapProps {
  issues: Issue[];
  onIssueSelect?: (issue: Issue) => void;
  filters: {
    status: string;
    category: string;
    search: string;
  };
}

const STATUS_COLORS = {
  'open': '#dc2626',
  'under-review': '#6b7280',
  'in-progress': '#1e40af',
  'resolved': '#059669'
};

const MapboxMap: React.FC<MapboxMapProps> = ({ issues, onIssueSelect, filters }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapToken, setMapToken] = useState<string>('');

  // Get user location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          if (map.current) {
            map.current.flyTo({
              center: [location.lng, location.lat],
              zoom: 14
            });
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  useEffect(() => {
    // In production, you would get this from Supabase secrets
    // For now, show placeholder for Mapbox integration
    if (!mapContainer.current) return;

    // Mock map initialization (placeholder)
    const initMap = () => {
      if (!MAPBOX_TOKEN || MAPBOX_TOKEN === 'your-mapbox-token-here') {
        // Show placeholder when no token is available
        return;
      }

      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-74.0060, 40.7128], // Default to NYC
        zoom: 12
      });

      map.current.addControl(new mapboxgl.NavigationControl());

      // Add markers for issues
      issues.forEach((issue) => {
        const marker = new mapboxgl.Marker({
          color: STATUS_COLORS[issue.status as keyof typeof STATUS_COLORS]
        })
          .setLngLat([issue.location.lng, issue.location.lat])
          .addTo(map.current!);

        marker.getElement().addEventListener('click', () => {
          setSelectedIssue(issue);
          onIssueSelect?.(issue);
        });
      });

      // Add user location marker if available
      if (userLocation) {
        new mapboxgl.Marker({ color: '#059669' })
          .setLngLat([userLocation.lng, userLocation.lat])
          .addTo(map.current!);
      }
    };

    initMap();

    return () => {
      map.current?.remove();
    };
  }, [issues, userLocation, onIssueSelect]);

  if (!MAPBOX_TOKEN || MAPBOX_TOKEN === 'your-mapbox-token-here') {
    return (
      <div className="relative h-full bg-muted rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
          <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Interactive Map</h3>
          <p className="text-muted-foreground text-center mb-4">
            Mapbox integration ready - add your token to enable
          </p>
          <div className="text-center max-w-md">
            <p className="text-sm text-muted-foreground mb-4">
              To enable the interactive map, add your Mapbox public token via Supabase secrets.
            </p>
            <Button onClick={getUserLocation} variant="outline">
              Get My Location
            </Button>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(STATUS_COLORS).map(([status, color]) => (
                <div key={status} className="flex items-center gap-2 bg-background/80 p-2 rounded">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: color }}
                  />
                  <span className="capitalize">{status.replace('-', ' ')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg overflow-hidden" />
      
      {selectedIssue && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <Badge variant="outline" className="text-xs mb-1">
                    {selectedIssue.id}
                  </Badge>
                  <h4 className="font-medium">{selectedIssue.title}</h4>
                  <p className="text-sm text-muted-foreground">{selectedIssue.address}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedIssue(null)}
                >
                  ✕
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Badge variant="secondary">
                    {selectedIssue.category}
                  </Badge>
                  <Badge variant="outline">
                    {selectedIssue.status}
                  </Badge>
                </div>
                <Button size="sm" onClick={() => onIssueSelect?.(selectedIssue)}>
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Button
        className="absolute top-4 right-4 z-10"
        variant="outline"
        size="sm"
        onClick={getUserLocation}
      >
        My Location
      </Button>
    </div>
  );
};

export default MapboxMap;