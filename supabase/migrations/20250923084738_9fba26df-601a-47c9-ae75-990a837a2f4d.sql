-- Create enum for report statuses
CREATE TYPE public.report_status AS ENUM (
  'submitted',
  'under_review', 
  'in_progress',
  'resolved',
  'closed',
  'rejected'
);

-- Create enum for report priorities
CREATE TYPE public.report_priority AS ENUM (
  'low',
  'medium', 
  'high',
  'urgent'
);

-- Create categories table for issue classification
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create departments table for organizational structure
CREATE TABLE public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  email TEXT,
  phone TEXT,
  head_user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reports table for civic issues
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category_id UUID REFERENCES public.categories(id),
  department_id UUID REFERENCES public.departments(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  location_address TEXT,
  status public.report_status NOT NULL DEFAULT 'submitted',
  priority public.report_priority NOT NULL DEFAULT 'medium',
  photos TEXT[], -- Array of file URLs
  upvotes INTEGER NOT NULL DEFAULT 0,
  assigned_to UUID,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create comments table for administrative updates
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  internal_only BOOLEAN NOT NULL DEFAULT false,
  attachments TEXT[], -- Array of file URLs
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Insert default categories
INSERT INTO public.categories (name, description, icon, color) VALUES
('Roads & Transportation', 'Potholes, traffic signals, road maintenance', 'road', '#DC2626'),
('Sanitation & Waste', 'Garbage collection, street cleaning, drainage', 'trash-2', '#059669'),
('Utilities', 'Water supply, electricity, gas issues', 'zap', '#1E40AF'),
('Public Safety', 'Street lighting, security concerns', 'shield-check', '#DC2626'),
('Parks & Recreation', 'Park maintenance, recreational facilities', 'tree-pine', '#059669'),
('Building & Construction', 'Illegal construction, building violations', 'building', '#6B7280');

-- Insert default departments
INSERT INTO public.departments (name, description, email) VALUES
('Roads Department', 'Responsible for road maintenance and traffic management', 'roads@city.gov'),
('Sanitation Department', 'Handles waste management and street cleaning', 'sanitation@city.gov'),
('Utilities Department', 'Manages water, electricity, and gas services', 'utilities@city.gov'),
('Public Safety Department', 'Ensures public safety and security', 'safety@city.gov'),
('Parks Department', 'Maintains parks and recreational facilities', 'parks@city.gov'),
('Building Department', 'Regulates construction and building compliance', 'building@city.gov');

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES 
('report-photos', 'report-photos', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
('comment-attachments', 'comment-attachments', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);

-- RLS Policies for categories
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage categories" 
ON public.categories FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for departments
CREATE POLICY "Departments are viewable by everyone" 
ON public.departments FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage departments" 
ON public.departments FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for reports
CREATE POLICY "Users can view all reports" 
ON public.reports FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own reports" 
ON public.reports FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports" 
ON public.reports FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins and staff can update all reports" 
ON public.reports FOR UPDATE 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'department_staff'::app_role)
);

CREATE POLICY "Users can delete their own reports within 24 hours" 
ON public.reports FOR DELETE 
USING (
  auth.uid() = user_id AND 
  created_at > now() - interval '24 hours' AND
  status = 'submitted'
);

CREATE POLICY "Admins can delete any report" 
ON public.reports FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for comments
CREATE POLICY "Users can view public comments and their own" 
ON public.comments FOR SELECT 
USING (
  NOT internal_only OR 
  auth.uid() = user_id OR
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'department_staff'::app_role)
);

CREATE POLICY "Authenticated users can create comments" 
ON public.comments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON public.comments FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can update any comment" 
ON public.comments FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can delete their own comments" 
ON public.comments FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete any comment" 
ON public.comments FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Storage policies for report photos
CREATE POLICY "Report photos are publicly viewable" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'report-photos');

CREATE POLICY "Authenticated users can upload report photos" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'report-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own report photos" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'report-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own report photos" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'report-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies for comment attachments
CREATE POLICY "Comment attachments viewable by authorized users" 
ON storage.objects FOR SELECT 
USING (
  bucket_id = 'comment-attachments' AND (
    auth.uid()::text = (storage.foldername(name))[1] OR
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'department_staff'::app_role)
  )
);

CREATE POLICY "Authenticated users can upload comment attachments" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'comment-attachments' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create indexes for performance optimization
CREATE INDEX idx_reports_user_id ON public.reports(user_id);
CREATE INDEX idx_reports_category_id ON public.reports(category_id);
CREATE INDEX idx_reports_department_id ON public.reports(department_id);
CREATE INDEX idx_reports_status ON public.reports(status);
CREATE INDEX idx_reports_priority ON public.reports(priority);
CREATE INDEX idx_reports_created_at ON public.reports(created_at DESC);
CREATE INDEX idx_reports_location ON public.reports(location_lat, location_lng);
CREATE INDEX idx_comments_report_id ON public.comments(report_id);
CREATE INDEX idx_comments_user_id ON public.comments(user_id);
CREATE INDEX idx_comments_created_at ON public.comments(created_at DESC);

-- Create triggers for updated_at columns
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_departments_updated_at
  BEFORE UPDATE ON public.departments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for reports and comments
ALTER TABLE public.reports REPLICA IDENTITY FULL;
ALTER TABLE public.comments REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reports;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;