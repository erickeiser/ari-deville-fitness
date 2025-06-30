export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'trainer' | 'user';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  active: boolean;
}

export interface Service {
  id: string;
  title: string;
  price: string;
  description: string;
  features: string[];
  icon: string;
  popular: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  title: string;
  image: string;
  videoThumb: string;
  videoUrl?: string;
  quote: string;
  rating: number;
  results: string;
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: number;
  uploadedAt: string;
  uploadedBy: string;
}

export interface SiteContent {
  id: string;
  section: string;
  key: string;
  value: string;
  type: 'text' | 'html' | 'image' | 'json';
  updatedAt: string;
  updatedBy: string;
}

export interface IntakeSubmission {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  fitnessLevel: string;
  goals: string;
  injuries?: string;
  availability: string[];
  preferredService: string;
  budget?: string;
  additionalInfo?: string;
  status: 'new' | 'contacted' | 'scheduled' | 'converted' | 'declined';
  notes?: string;
  submittedAt: string;
  lastContactedAt?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  priority: 'low' | 'medium' | 'high';
  submittedAt: string;
  repliedAt?: string;
}