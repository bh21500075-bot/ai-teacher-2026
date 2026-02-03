-- Create guest_documents table for storing UTB document content
CREATE TABLE public.guest_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_name TEXT NOT NULL,
  document_title TEXT NOT NULL,
  section_title TEXT,
  content_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.guest_documents ENABLE ROW LEVEL SECURITY;

-- Allow public read access for guest chat
CREATE POLICY "Anyone can read guest documents" 
ON public.guest_documents 
FOR SELECT 
USING (true);

-- Create a full-text search index for better search performance
CREATE INDEX idx_guest_documents_content_search 
ON public.guest_documents 
USING gin(to_tsvector('english', content_text));

-- Create index for document name lookups
CREATE INDEX idx_guest_documents_name 
ON public.guest_documents(document_name);