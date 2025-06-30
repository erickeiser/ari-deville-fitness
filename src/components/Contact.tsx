import React, { useState } from 'react';
import { useCMS } from '../contexts/CMSContext';
import { Send, Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';

const Contact = () => {
  const { addContactMessage, getSiteContent } = useCMS();
  const [messageData, setMessageData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Get contact information from CMS
  const contactEmail = getSiteContent('contact', 'email') || 'alex@fitprotrainer.com';
  const contactPhone = getSiteContent('contact', 'phone') || '(555) 123-4567';
  const contactAddress = getSiteContent('contact', 'address') || 'Downtown Fitness Center';
  const contactAddressLine2 = getSiteContent('contact', 'addressLine2') || '123 Main Street, City State 12345';
  const businessHours = getSiteContent('contact', 'hours') || 'Monday - Friday: 6:00 AM - 8:00 PM\nSaturday: 7:00 AM - 6:00 PM\nSunday: 8:00 AM - 4:00 PM';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMessageData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Add to CMS
      addContactMessage({
        ...messageData,
        status: 'new',
        priority: 'medium'
      });
      
      setSubmitStatus('success');
      setMessageData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-astros-navy">
            Get In Touch
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Ready to start your fitness journey? Have questions about training? I'm here to help. Send me a message or give me a call.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-astros-navy flex items-center">
                <MessageCircle className="w-6 h-6 text-astros-orange mr-3" />
                Let's Connect
              </h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                I'm passionate about helping you achieve your fitness goals. Whether you're ready to get started or just have questions, I'd love to hear from you.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-astros-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-astros-orange" />
                </div>
                <div>
                  <h4 className="font-semibold text-astros-navy mb-1">Email</h4>
                  <p className="text-slate-600">{contactEmail}</p>
                  <p className="text-sm text-slate-500">I typically respond within 2-4 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-astros-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-astros-orange" />
                </div>
                <div>
                  <h4 className="font-semibold text-astros-navy mb-1">Phone</h4>
                  <p className="text-slate-600">{contactPhone}</p>
                  <p className="text-sm text-slate-500">Call or text for immediate assistance</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-astros-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-astros-orange" />
                </div>
                <div>
                  <h4 className="font-semibold text-astros-navy mb-1">Location</h4>
                  <p className="text-slate-600">{contactAddress}</p>
                  <p className="text-slate-600">{contactAddressLine2}</p>
                  <p className="text-sm text-slate-500">Also available for home/virtual sessions</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-astros-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-astros-orange" />
                </div>
                <div>
                  <h4 className="font-semibold text-astros-navy mb-1">Availability</h4>
                  <div className="text-slate-600 space-y-1">
                    {businessHours.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-astros-orange/5 to-astros-orange/10 p-6 rounded-xl border border-astros-orange/20">
              <h4 className="font-semibold text-astros-navy mb-2 flex items-center">
                <MessageCircle className="w-5 h-5 text-astros-orange mr-2" />
                Quick Response Guarantee
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                I pride myself on quick, personalized responses. Reach out with any questions about training, availability, or just to say hello. I'm here to support your fitness journey every step of the way.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-slate-50 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-astros-navy mb-6">Send Me a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={messageData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange transition-colors bg-white"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={messageData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange transition-colors bg-white"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={messageData.subject}
                  onChange={handleInputChange}
                  placeholder="e.g., Questions about personal training"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange transition-colors bg-white"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={messageData.message}
                  onChange={handleInputChange}
                  placeholder="Tell me about your fitness goals, questions, or how I can help you..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange transition-colors resize-none bg-white"
                />
              </div>

              {submitStatus === 'success' && (
                <div className="bg-astros-orange/10 border border-astros-orange/20 rounded-lg p-4">
                  <p className="text-astros-navy font-medium">
                    Thank you for your message! I'll get back to you within 24 hours.
                  </p>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-medium">
                    There was an error sending your message. Please try again or call me directly.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-astros-orange hover:bg-astros-orange-dark disabled:bg-astros-orange/60 text-white px-6 py-4 rounded-lg font-semibold flex items-center justify-center transition-colors duration-200"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Sending...
                  </div>
                ) : (
                  <>
                    Send Message
                    <Send className="ml-2 w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;