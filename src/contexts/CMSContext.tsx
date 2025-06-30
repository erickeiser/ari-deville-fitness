import React, { createContext, useContext, useState, useEffect } from 'react';
import { Service, Testimonial, MediaFile, SiteContent, IntakeSubmission, ContactMessage } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface CMSContextType {
  // Services
  services: Service[];
  addService: (service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  
  // Testimonials
  testimonials: Testimonial[];
  addTestimonial: (testimonial: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTestimonial: (id: string, testimonial: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;
  
  // Media
  mediaFiles: MediaFile[];
  uploadMedia: (file: File) => Promise<MediaFile>;
  deleteMedia: (id: string) => void;
  
  // Site Content
  siteContent: SiteContent[];
  updateSiteContent: (section: string, key: string, value: string, type?: string) => void;
  getSiteContent: (section: string, key: string) => string;
  
  // Intake Submissions
  intakeSubmissions: IntakeSubmission[];
  addIntakeSubmission: (submission: Omit<IntakeSubmission, 'id' | 'submittedAt'>) => void;
  updateIntakeStatus: (id: string, status: IntakeSubmission['status'], notes?: string) => void;
  
  // Contact Messages
  contactMessages: ContactMessage[];
  addContactMessage: (message: Omit<ContactMessage, 'id' | 'submittedAt'>) => void;
  updateMessageStatus: (id: string, status: ContactMessage['status']) => void;
  
  // Loading states
  isLoading: boolean;
  isOnline: boolean;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (context === undefined) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent[]>([]);
  const [intakeSubmissions, setIntakeSubmissions] = useState<IntakeSubmission[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(isSupabaseConfigured());

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    if (isSupabaseConfigured()) {
      await loadFromSupabase();
    } else {
      loadFromLocalStorage();
    }
    setIsLoading(false);
  };

  const loadFromSupabase = async () => {
    try {
      // Load services
      const { data: servicesData } = await supabase!.from('services').select('*').eq('active', true);
      if (servicesData) setServices(servicesData);

      // Load testimonials
      const { data: testimonialsData } = await supabase!.from('testimonials').select('*').eq('active', true);
      if (testimonialsData) setTestimonials(testimonialsData);

      // Load media files
      const { data: mediaData } = await supabase!.from('media_files').select('*');
      if (mediaData) setMediaFiles(mediaData);

      // Load site content
      const { data: contentData } = await supabase!.from('site_content').select('*');
      if (contentData) setSiteContent(contentData);

      // Load intake submissions
      const { data: intakeData } = await supabase!.from('intake_submissions').select('*');
      if (intakeData) setIntakeSubmissions(intakeData);

      // Load contact messages
      const { data: messagesData } = await supabase!.from('contact_messages').select('*');
      if (messagesData) setContactMessages(messagesData);

    } catch (error) {
      console.error('Error loading from Supabase:', error);
      // Fallback to localStorage
      loadFromLocalStorage();
      setIsOnline(false);
    }
  };

  const loadFromLocalStorage = () => {
    // Load from localStorage for demo purposes
    const storedServices = localStorage.getItem('cms_services');
    const storedTestimonials = localStorage.getItem('cms_testimonials');
    const storedMedia = localStorage.getItem('cms_media');
    const storedContent = localStorage.getItem('cms_content');
    const storedIntake = localStorage.getItem('cms_intake');
    const storedMessages = localStorage.getItem('cms_messages');

    if (storedServices) {
      setServices(JSON.parse(storedServices));
    } else {
      // Initialize with default services
      const defaultServices: Service[] = [
        {
          id: '1',
          title: 'Personal Training',
          price: '$80/session',
          description: 'One-on-one personalized training sessions tailored to your specific goals and fitness level.',
          features: ['Customized workout plans', 'Form correction & technique', 'Progress tracking', 'Flexible scheduling', 'Nutritional guidance'],
          icon: 'User',
          popular: true,
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Small Group Training',
          price: '$45/session',
          description: 'Train with 2-4 people in a motivating group environment while receiving personalized attention.',
          features: ['Groups of 2-4 people', 'Cost-effective training', 'Social motivation', 'Varied workout styles', 'Team building'],
          icon: 'Users',
          popular: false,
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Virtual Training',
          price: '$60/session',
          description: 'Get professional training from anywhere with live virtual sessions via video call.',
          features: ['Train from home', 'Live video sessions', 'Equipment adaptations', 'Digital workout plans', 'Progress monitoring'],
          icon: 'Video',
          popular: false,
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '4',
          title: 'Nutrition Coaching',
          price: '$120/month',
          description: 'Comprehensive nutrition guidance to complement your training and accelerate results.',
          features: ['Personalized meal plans', 'Macro tracking guidance', 'Supplement recommendations', 'Weekly check-ins', 'Recipe suggestions'],
          icon: 'Utensils',
          popular: false,
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      setServices(defaultServices);
      localStorage.setItem('cms_services', JSON.stringify(defaultServices));
    }

    if (storedTestimonials) {
      setTestimonials(JSON.parse(storedTestimonials));
    } else {
      // Initialize with default testimonials
      const defaultTestimonials: Testimonial[] = [
        {
          id: '1',
          name: 'Sarah Chen',
          title: 'Marketing Manager',
          image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
          videoThumb: 'https://images.pexels.com/photos/4761792/pexels-photo-4761792.jpeg?auto=compress&cs=tinysrgb&w=600',
          quote: 'Lost 30 pounds in 4 months while building the strongest I\'ve ever been. Alex\'s approach is sustainable and actually enjoyable!',
          rating: 5,
          results: 'Lost 30 lbs | Gained Confidence',
          featured: true,
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Michael Rodriguez',
          title: 'Software Engineer',
          image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
          videoThumb: 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=600',
          quote: 'As a busy dad, I thought I\'d never find time for fitness. Alex helped me create a routine that works with my schedule.',
          rating: 5,
          results: 'Built Muscle | Better Energy',
          featured: false,
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Jessica Thompson',
          title: 'Teacher',
          image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
          videoThumb: 'https://images.pexels.com/photos/4058316/pexels-photo-4058316.jpeg?auto=compress&cs=tinysrgb&w=600',
          quote: 'After my injury, I was afraid to exercise. Alex guided me back to full strength safely and confidently.',
          rating: 5,
          results: 'Injury Recovery | Strength Gained',
          featured: false,
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      setTestimonials(defaultTestimonials);
      localStorage.setItem('cms_testimonials', JSON.stringify(defaultTestimonials));
    }

    if (storedMedia) setMediaFiles(JSON.parse(storedMedia));
    if (storedContent) setSiteContent(JSON.parse(storedContent));
    if (storedIntake) setIntakeSubmissions(JSON.parse(storedIntake));
    if (storedMessages) setContactMessages(JSON.parse(storedMessages));
  };

  // Services methods
  const addService = async (service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newService: Service = {
      ...service,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isSupabaseConfigured() && isOnline) {
      try {
        const { error } = await supabase!.from('services').insert([newService]);
        if (error) throw error;
      } catch (error) {
        console.error('Error adding service to Supabase:', error);
        setIsOnline(false);
      }
    }

    const updatedServices = [...services, newService];
    setServices(updatedServices);
    localStorage.setItem('cms_services', JSON.stringify(updatedServices));
  };

  const updateService = async (id: string, serviceUpdate: Partial<Service>) => {
    const updatedService = { ...serviceUpdate, updatedAt: new Date().toISOString() };

    if (isSupabaseConfigured() && isOnline) {
      try {
        const { error } = await supabase!.from('services').update(updatedService).eq('id', id);
        if (error) throw error;
      } catch (error) {
        console.error('Error updating service in Supabase:', error);
        setIsOnline(false);
      }
    }

    const updatedServices = services.map(service =>
      service.id === id ? { ...service, ...updatedService } : service
    );
    setServices(updatedServices);
    localStorage.setItem('cms_services', JSON.stringify(updatedServices));
  };

  const deleteService = async (id: string) => {
    if (isSupabaseConfigured() && isOnline) {
      try {
        const { error } = await supabase!.from('services').delete().eq('id', id);
        if (error) throw error;
      } catch (error) {
        console.error('Error deleting service from Supabase:', error);
        setIsOnline(false);
      }
    }

    const updatedServices = services.filter(service => service.id !== id);
    setServices(updatedServices);
    localStorage.setItem('cms_services', JSON.stringify(updatedServices));
  };

  // Testimonials methods
  const addTestimonial = async (testimonial: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTestimonial: Testimonial = {
      ...testimonial,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isSupabaseConfigured() && isOnline) {
      try {
        const { error } = await supabase!.from('testimonials').insert([newTestimonial]);
        if (error) throw error;
      } catch (error) {
        console.error('Error adding testimonial to Supabase:', error);
        setIsOnline(false);
      }
    }

    const updatedTestimonials = [...testimonials, newTestimonial];
    setTestimonials(updatedTestimonials);
    localStorage.setItem('cms_testimonials', JSON.stringify(updatedTestimonials));
  };

  const updateTestimonial = async (id: string, testimonialUpdate: Partial<Testimonial>) => {
    const updatedTestimonial = { ...testimonialUpdate, updatedAt: new Date().toISOString() };

    if (isSupabaseConfigured() && isOnline) {
      try {
        const { error } = await supabase!.from('testimonials').update(updatedTestimonial).eq('id', id);
        if (error) throw error;
      } catch (error) {
        console.error('Error updating testimonial in Supabase:', error);
        setIsOnline(false);
      }
    }

    const updatedTestimonials = testimonials.map(testimonial =>
      testimonial.id === id ? { ...testimonial, ...updatedTestimonial } : testimonial
    );
    setTestimonials(updatedTestimonials);
    localStorage.setItem('cms_testimonials', JSON.stringify(updatedTestimonials));
  };

  const deleteTestimonial = async (id: string) => {
    if (isSupabaseConfigured() && isOnline) {
      try {
        const { error } = await supabase!.from('testimonials').delete().eq('id', id);
        if (error) throw error;
      } catch (error) {
        console.error('Error deleting testimonial from Supabase:', error);
        setIsOnline(false);
      }
    }

    const updatedTestimonials = testimonials.filter(testimonial => testimonial.id !== id);
    setTestimonials(updatedTestimonials);
    localStorage.setItem('cms_testimonials', JSON.stringify(updatedTestimonials));
  };

  // Media methods
  const uploadMedia = async (file: File): Promise<MediaFile> => {
    let fileUrl = URL.createObjectURL(file); // Fallback for localStorage
    let fileName = `${Date.now()}_${file.name}`;

    if (isSupabaseConfigured() && isOnline && user) {
      try {
        // Upload file to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase!.storage
          .from('media')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Storage upload error:', uploadError);
          throw uploadError;
        }

        // Get public URL
        const { data: urlData } = supabase!.storage
          .from('media')
          .getPublicUrl(fileName);

        fileUrl = urlData.publicUrl;
        console.log('File uploaded successfully to:', fileUrl);
      } catch (error) {
        console.error('Error uploading to Supabase Storage:', error);
        setIsOnline(false);
        // Continue with local fallback
      }
    }

    const mediaFile: MediaFile = {
      id: Date.now().toString(),
      filename: fileName,
      originalName: file.name,
      url: fileUrl,
      type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document',
      size: file.size,
      uploadedAt: new Date().toISOString(),
      uploadedBy: user?.id || 'anonymous'
    };

    if (isSupabaseConfigured() && isOnline && user) {
      try {
        const { error } = await supabase!.from('media_files').insert([mediaFile]);
        if (error) {
          console.error('Database insert error:', error);
          throw error;
        }
        console.log('Media file record saved to database');
      } catch (error) {
        console.error('Error saving media file to Supabase:', error);
        setIsOnline(false);
        // Continue with local fallback
      }
    }

    const updatedMedia = [...mediaFiles, mediaFile];
    setMediaFiles(updatedMedia);
    localStorage.setItem('cms_media', JSON.stringify(updatedMedia));
    return mediaFile;
  };

  const deleteMedia = async (id: string) => {
    if (isSupabaseConfigured() && isOnline) {
      try {
        const { error } = await supabase!.from('media_files').delete().eq('id', id);
        if (error) throw error;
      } catch (error) {
        console.error('Error deleting media from Supabase:', error);
        setIsOnline(false);
      }
    }

    const updatedMedia = mediaFiles.filter(media => media.id !== id);
    setMediaFiles(updatedMedia);
    localStorage.setItem('cms_media', JSON.stringify(updatedMedia));
  };

  // Site content methods
  const updateSiteContent = async (section: string, key: string, value: string, type: string = 'text') => {
    const existingIndex = siteContent.findIndex(content => content.section === section && content.key === key);
    let updatedContent;

    if (existingIndex >= 0) {
      const updatedItem = { ...siteContent[existingIndex], value, updatedAt: new Date().toISOString() };
      updatedContent = siteContent.map((content, index) =>
        index === existingIndex ? updatedItem : content
      );

      if (isSupabaseConfigured() && isOnline) {
        try {
          const { error } = await supabase!.from('site_content')
            .update({ value, updatedAt: new Date().toISOString() })
            .eq('section', section)
            .eq('key', key);
          if (error) throw error;
        } catch (error) {
          console.error('Error updating site content in Supabase:', error);
          setIsOnline(false);
        }
      }
    } else {
      const newContent: SiteContent = {
        id: Date.now().toString(),
        section,
        key,
        value,
        type: type as 'text' | 'html' | 'image' | 'json',
        updatedAt: new Date().toISOString(),
        updatedBy: user?.id || 'anonymous'
      };
      updatedContent = [...siteContent, newContent];

      if (isSupabaseConfigured() && isOnline) {
        try {
          const { error } = await supabase!.from('site_content').insert([newContent]);
          if (error) throw error;
        } catch (error) {
          console.error('Error adding site content to Supabase:', error);
          setIsOnline(false);
        }
      }
    }

    setSiteContent(updatedContent);
    localStorage.setItem('cms_content', JSON.stringify(updatedContent));
  };

  const getSiteContent = (section: string, key: string): string => {
    const content = siteContent.find(content => content.section === section && content.key === key);
    return content?.value || '';
  };

  // Intake methods
  const addIntakeSubmission = async (submission: Omit<IntakeSubmission, 'id' | 'submittedAt'>) => {
    const newSubmission: IntakeSubmission = {
      ...submission,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString()
    };

    if (isSupabaseConfigured() && isOnline) {
      try {
        const { error } = await supabase!.from('intake_submissions').insert([newSubmission]);
        if (error) throw error;
      } catch (error) {
        console.error('Error adding intake submission to Supabase:', error);
        setIsOnline(false);
      }
    }

    const updatedSubmissions = [...intakeSubmissions, newSubmission];
    setIntakeSubmissions(updatedSubmissions);
    localStorage.setItem('cms_intake', JSON.stringify(updatedSubmissions));
  };

  const updateIntakeStatus = async (id: string, status: IntakeSubmission['status'], notes?: string) => {
    const updateData = { status, notes, lastContactedAt: new Date().toISOString() };

    if (isSupabaseConfigured() && isOnline) {
      try {
        const { error } = await supabase!.from('intake_submissions').update(updateData).eq('id', id);
        if (error) throw error;
      } catch (error) {
        console.error('Error updating intake status in Supabase:', error);
        setIsOnline(false);
      }
    }

    const updatedSubmissions = intakeSubmissions.map(submission =>
      submission.id === id ? { ...submission, ...updateData } : submission
    );
    setIntakeSubmissions(updatedSubmissions);
    localStorage.setItem('cms_intake', JSON.stringify(updatedSubmissions));
  };

  // Contact methods
  const addContactMessage = async (message: Omit<ContactMessage, 'id' | 'submittedAt'>) => {
    const newMessage: ContactMessage = {
      ...message,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString()
    };

    if (isSupabaseConfigured() && isOnline) {
      try {
        const { error } = await supabase!.from('contact_messages').insert([newMessage]);
        if (error) throw error;
      } catch (error) {
        console.error('Error adding contact message to Supabase:', error);
        setIsOnline(false);
      }
    }

    const updatedMessages = [...contactMessages, newMessage];
    setContactMessages(updatedMessages);
    localStorage.setItem('cms_messages', JSON.stringify(updatedMessages));
  };

  const updateMessageStatus = async (id: string, status: ContactMessage['status']) => {
    const updateData = { 
      status, 
      repliedAt: status === 'replied' ? new Date().toISOString() : undefined 
    };

    if (isSupabaseConfigured() && isOnline) {
      try {
        const { error } = await supabase!.from('contact_messages').update(updateData).eq('id', id);
        if (error) throw error;
      } catch (error) {
        console.error('Error updating message status in Supabase:', error);
        setIsOnline(false);
      }
    }

    const updatedMessages = contactMessages.map(message =>
      message.id === id ? { ...message, ...updateData } : message
    );
    setContactMessages(updatedMessages);
    localStorage.setItem('cms_messages', JSON.stringify(updatedMessages));
  };

  return (
    <CMSContext.Provider value={{
      services,
      addService,
      updateService,
      deleteService,
      testimonials,
      addTestimonial,
      updateTestimonial,
      deleteTestimonial,
      mediaFiles,
      uploadMedia,
      deleteMedia,
      siteContent,
      updateSiteContent,
      getSiteContent,
      intakeSubmissions,
      addIntakeSubmission,
      updateIntakeStatus,
      contactMessages,
      addContactMessage,
      updateMessageStatus,
      isLoading,
      isOnline
    }}>
      {children}
    </CMSContext.Provider>
  );
};