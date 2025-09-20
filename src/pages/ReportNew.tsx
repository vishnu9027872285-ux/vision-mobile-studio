import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Mic, MicOff, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const ISSUE_CATEGORIES = [
  { value: 'sanitation', label: 'Sanitation' },
  { value: 'roads', label: 'Roads & Transportation' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'public-safety', label: 'Public Safety' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'environment', label: 'Environment' },
];

const ReportNew = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    location: '',
    latitude: null as number | null,
    longitude: null as number | null,
  });
  
  const [photos, setPhotos] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraMode, setIsCameraMode] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const totalSteps = 4;
  const progressPercentage = (currentStep / totalSteps) * 100;

  // Location Services
  const getCurrentLocation = useCallback(() => {
    setLocationStatus('loading');
    
    if (!navigator.geolocation) {
      setLocationStatus('error');
      toast({
        title: "Location Error",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          location: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`,
        }));
        setLocationStatus('success');
        toast({
          title: "Location Captured",
          description: "Your current location has been recorded.",
        });
      },
      (error) => {
        setLocationStatus('error');
        toast({
          title: "Location Error",
          description: "Unable to get your location. Please enter manually.",
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, [toast]);

  // Camera Functions
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      });
      setStream(mediaStream);
      setIsCameraMode(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please upload a photo instead.",
        variant: "destructive",
      });
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context?.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
          setPhotos(prev => [...prev, file]);
          stopCamera();
        }
      }, 'image/jpeg', 0.8);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraMode(false);
  };

  // Voice Recording
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        // Here you would typically send to voice-to-text service
        toast({
          title: "Voice Recorded",
          description: "Voice recording saved. Transcription would be implemented here.",
        });
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "Recording Error",
        description: "Unable to access microphone.",
        variant: "destructive",
      });
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setMediaRecorder(null);
    }
    setIsRecording(false);
  };

  // File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      setPhotos(prev => [...prev, ...imageFiles]);
      toast({
        title: "Photos Added",
        description: `${imageFiles.length} photo(s) uploaded successfully.`,
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  // Form Submission
  const handleSubmit = () => {
    if (!formData.category || !formData.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Generate report ID and navigate to confirmation
    const reportId = `NRK-${Date.now().toString().slice(-6)}`;
    navigate('/report/confirmation', { 
      state: { 
        reportId, 
        formData, 
        photoCount: photos.length 
      } 
    });
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-lg mx-auto">
        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-xl font-semibold text-foreground">Report Issue</h1>
            <Badge variant="outline">{currentStep} of {totalSteps}</Badge>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Camera Modal */}
        {isCameraMode && (
          <div className="fixed inset-0 bg-black z-50 flex flex-col">
            <div className="flex justify-between items-center p-4 text-white">
              <Button variant="ghost" size="icon" onClick={stopCamera}>
                <X className="h-6 w-6" />
              </Button>
              <span>Take Photo</span>
              <div></div>
            </div>
            <div className="flex-1 relative">
              <video 
                ref={videoRef}
                autoPlay 
                playsInline
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="p-6 flex justify-center">
              <Button 
                size="lg"
                onClick={capturePhoto}
                className="rounded-full w-16 h-16 bg-white text-black hover:bg-gray-200"
              >
                <Camera className="h-6 w-6" />
              </Button>
            </div>
          </div>
        )}

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "Category & Description"}
              {currentStep === 2 && "Add Photos"}
              {currentStep === 3 && "Location"}
              {currentStep === 4 && "Review & Submit"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Step 1: Category & Description */}
            {currentStep === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="category">Issue Category *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select issue category" />
                    </SelectTrigger>
                    <SelectContent>
                      {ISSUE_CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the issue in detail..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant={isRecording ? "destructive" : "outline"}
                    size="sm"
                    onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                  >
                    {isRecording ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                    {isRecording ? "Stop Recording" : "Voice Input"}
                  </Button>
                  {isRecording && (
                    <Badge variant="destructive" className="animate-pulse">Recording...</Badge>
                  )}
                </div>
              </>
            )}

            {/* Step 2: Photos */}
            {currentStep === 2 && (
              <>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={startCamera}
                      className="h-24 flex flex-col items-center justify-center"
                    >
                      <Camera className="h-6 w-6 mb-2" />
                      Take Photo
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-24 flex flex-col items-center justify-center"
                    >
                      <Upload className="h-6 w-6 mb-2" />
                      Upload Photo
                    </Button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {/* Photo Preview */}
                  {photos.length > 0 && (
                    <div className="space-y-2">
                      <Label>Photos ({photos.length})</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {photos.map((photo, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(photo)}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-20 object-cover rounded border"
                            />
                            <Button
                              size="icon"
                              variant="destructive"
                              className="absolute -top-2 -right-2 h-6 w-6"
                              onClick={() => removePhoto(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Step 3: Location */}
            {currentStep === 3 && (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Location</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={getCurrentLocation}
                      disabled={locationStatus === 'loading'}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      {locationStatus === 'loading' ? 'Getting Location...' : 'Use Current Location'}
                    </Button>
                  </div>

                  <Input
                    placeholder="Enter location manually"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  />

                  {formData.latitude && formData.longitude && (
                    <div className="p-3 bg-accent/50 rounded border">
                      <div className="text-sm text-muted-foreground">
                        GPS Coordinates: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Category</Label>
                      <p className="text-foreground">{ISSUE_CATEGORIES.find(c => c.value === formData.category)?.label}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Description</Label>
                      <p className="text-foreground">{formData.description}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Photos</Label>
                      <p className="text-foreground">{photos.length} photo(s) attached</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Location</Label>
                      <p className="text-foreground">{formData.location || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && (!formData.category || !formData.description))
                  }
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-primary hover:bg-primary/90"
                >
                  Submit Report
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportNew;