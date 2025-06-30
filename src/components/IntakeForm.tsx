import React, { useState } from 'react';
import { useCMS } from '../contexts/CMSContext';
import { Send, User, Mail, Phone, Target, Activity, Calendar, AlertCircle } from 'lucide-react';

const IntakeForm = () => {
  const { addIntakeSubmission } = useCMS();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    fitnessLevel: '',
    goals: '',
    injuries: '',
    availability: [] as string[],
    preferredService: '',
    budget: '',
    additionalInfo: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      availability: checked
        ? [...prev.availability, value]
        : prev.availability.filter(item => item !== value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Add to CMS
      addIntakeSubmission({
        ...formData,
        age: parseInt(formData.age),
        status: 'new'
      });
      
      setSubmitStatus('success');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        age: '',
        fitnessLevel: '',
        goals: '',
        injuries: '',
        availability: [],
        preferredService: '',
        budget: '',
        additionalInfo: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="intake" className="py-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-astros-navy">
            Start Your Fitness Journey
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Complete this intake form to help me understand your goals and create a personalized training plan just for you.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <User className="w-6 h-6 text-astros-orange" />
                <h3 className="text-xl font-semibold text-astros-navy">Personal Information</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange transition-colors"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange transition-colors"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-slate-700 mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    required
                    min="16"
                    max="80"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="fitnessLevel" className="block text-sm font-medium text-slate-700 mb-2">
                    <Activity className="w-4 h-4 inline mr-2" />
                    Current Fitness Level *
                  </label>
                  <select
                    id="fitnessLevel"
                    name="fitnessLevel"
                    required
                    value={formData.fitnessLevel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange transition-colors"
                  >
                    <option value="">Select fitness level</option>
                    <option value="beginner">Beginner (New to exercise)</option>
                    <option value="intermediate">Intermediate (Some experience)</option>
                    <option value="advanced">Advanced (Regular exercise routine)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Goals & Health */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <Target className="w-6 h-6 text-astros-orange" />
                <h3 className="text-xl font-semibold text-astros-navy">Goals & Health Information</h3>
              </div>

              <div>
                <label htmlFor="goals" className="block text-sm font-medium text-slate-700 mb-2">
                  Primary Fitness Goals *
                </label>
                <textarea
                  id="goals"
                  name="goals"
                  required
                  rows={4}
                  value={formData.goals}
                  onChange={handleInputChange}
                  placeholder="e.g., lose weight, build muscle, improve endurance, get stronger..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange transition-colors resize-none"
                />
              </div>

              <div>
                <label htmlFor="injuries" className="block text-sm font-medium text-slate-700 mb-2">
                  <AlertCircle className="w-4 h-4 inline mr-2" />
                  Injuries or Physical Limitations
                </label>
                <textarea
                  id="injuries"
                  name="injuries"
                  rows={3}
                  value={formData.injuries}
                  onChange={handleInputChange}
                  placeholder="Please describe any injuries, pain, or physical limitations I should know about..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange transition-colors resize-none"
                />
              </div>
            </div>

            {/* Availability & Preferences */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <Calendar className="w-6 h-6 text-astros-orange" />
                <h3 className="text-xl font-semibold text-astros-navy">Availability & Preferences</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  When are you typically available? (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Early Morning (6-9 AM)', 'Morning (9-12 PM)', 'Afternoon (12-5 PM)', 'Evening (5-8 PM)', 'Weekends Only', 'Flexible Schedule'].map((time) => (
                    <label key={time} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value={time}
                        checked={formData.availability.includes(time)}
                        onChange={handleCheckboxChange}
                        className="rounded border-slate-300 text-astros-orange focus:ring-astros-orange"
                      />
                      <span className="text-sm text-slate-700">{time}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="preferredService" className="block text-sm font-medium text-slate-700 mb-2">
                    Preferred Service *
                  </label>
                  <select
                    id="preferredService"
                    name="preferredService"
                    required
                    value={formData.preferredService}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange transition-colors"
                  >
                    <option value="">Select preferred service</option>
                    <option value="personal">Personal Training</option>
                    <option value="group">Small Group Training</option>
                    <option value="virtual">Virtual Training</option>
                    <option value="nutrition">Nutrition Coaching</option>
                    <option value="consultation">Free Consultation First</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-slate-700 mb-2">
                    Monthly Budget Range
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange transition-colors"
                  >
                    <option value="">Select budget range</option>
                    <option value="under-200">Under $200</option>
                    <option value="200-400">$200 - $400</option>
                    <option value="400-600">$400 - $600</option>
                    <option value="600-plus">$600+</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="additionalInfo" className="block text-sm font-medium text-slate-700 mb-2">
                  Additional Information
                </label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  rows={4}
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  placeholder="Anything else you'd like me to know? Questions about training? Special considerations?"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange transition-colors resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center pt-6">
              {submitStatus === 'success' && (
                <div className="bg-astros-orange/10 border border-astros-orange/20 rounded-lg p-4 mb-6">
                  <p className="text-astros-navy font-medium">
                    Thank you! Your intake form has been submitted successfully. I'll review your information and get back to you within 24 hours.
                  </p>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800 font-medium">
                    There was an error submitting your form. Please try again or contact me directly.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-astros-orange hover:bg-astros-orange-dark disabled:bg-astros-orange/60 text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center mx-auto transition-colors duration-200 min-w-[200px]"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Submitting...
                  </div>
                ) : (
                  <>
                    Submit Intake Form
                    <Send className="ml-2 w-5 h-5" />
                  </>
                )}
              </button>
              
              <p className="text-sm text-slate-600 mt-4">
                By submitting this form, you agree to receive communications about your fitness journey. Your information is kept confidential.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default IntakeForm;