import React from 'react';
import { useCMS } from '../../contexts/CMSContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  MessageSquare,
  Star,
  FileText,
  TrendingUp,
  Calendar,
  DollarSign,
  Activity,
  Clock,
  Eye,
  UserCheck,
  Award,
  Target
} from 'lucide-react';

const Dashboard = () => {
  const { services, testimonials, intakeSubmissions, contactMessages } = useCMS();
  const { user, authMode } = useAuth();
  const navigate = useNavigate();

  // Calculate dynamic stats
  const activeServices = services.filter(s => s.active);
  const newInquiries = intakeSubmissions.filter(s => s.status === 'new');
  const activeTestimonials = testimonials.filter(t => t.active);
  const unreadMessages = contactMessages.filter(m => m.status === 'new');
  
  // Calculate recent activity (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentIntakes = intakeSubmissions.filter(s => 
    new Date(s.submittedAt) > sevenDaysAgo
  );
  const recentMessages = contactMessages.filter(m => 
    new Date(m.submittedAt) > sevenDaysAgo
  );

  const stats = [
    {
      name: 'Active Services',
      value: activeServices.length,
      icon: FileText,
      color: 'bg-blue-500',
      change: `${services.filter(s => s.popular).length} popular`,
      trend: 'up'
    },
    {
      name: 'New Inquiries',
      value: newInquiries.length,
      icon: Users,
      color: 'bg-astros-orange',
      change: `+${recentIntakes.length} this week`,
      trend: recentIntakes.length > 0 ? 'up' : 'neutral'
    },
    {
      name: 'Testimonials',
      value: activeTestimonials.length,
      icon: Star,
      color: 'bg-yellow-500',
      change: `${testimonials.filter(t => t.featured).length} featured`,
      trend: 'up'
    },
    {
      name: 'Unread Messages',
      value: unreadMessages.length,
      icon: MessageSquare,
      color: 'bg-purple-500',
      change: `+${recentMessages.length} this week`,
      trend: recentMessages.length > 0 ? 'up' : 'neutral'
    }
  ];

  const recentIntakesList = intakeSubmissions
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);

  const recentMessagesList = contactMessages
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'converted':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'replied':
        return 'bg-astros-orange/10 text-astros-orange';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  // Quick action handlers
  const handleAddService = () => {
    navigate('/admin/services');
    // Small delay to ensure navigation completes, then trigger add modal
    setTimeout(() => {
      // This will be handled by the ServicesManager component
      window.dispatchEvent(new CustomEvent('openAddServiceModal'));
    }, 100);
  };

  const handleAddTestimonial = () => {
    navigate('/admin/testimonials');
    // Small delay to ensure navigation completes, then trigger add modal
    setTimeout(() => {
      // This will be handled by the TestimonialsManager component
      window.dispatchEvent(new CustomEvent('openAddTestimonialModal'));
    }, 100);
  };

  const handleUploadMedia = () => {
    navigate('/admin/media');
    // Small delay to ensure navigation completes, then trigger file picker
    setTimeout(() => {
      // This will be handled by the MediaLibrary component
      window.dispatchEvent(new CustomEvent('openMediaUpload'));
    }, 100);
  };

  const handleViewSite = () => {
    // Open the public site in a new tab
    window.open('/', '_blank');
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-astros-orange to-astros-orange-dark rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name?.split(' ')[0] || 'Admin'}! 👋
            </h1>
            <p className="text-orange-100 text-lg">
              Here's what's happening with your fitness business today.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{new Date().getDate()}</div>
              <div className="text-sm opacity-90">
                {new Date().toLocaleDateString('en-US', { month: 'short' })}
              </div>
            </div>
          </div>
        </div>
        
        {/* User Info */}
        <div className="mt-6 flex items-center space-x-6 text-sm">
          <div className="flex items-center">
            <UserCheck className="w-4 h-4 mr-2" />
            <span>Role: {user?.role?.charAt(0).toUpperCase()}{user?.role?.slice(1)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>Last login: {user?.lastLoginAt ? getTimeAgo(user.lastLoginAt) : 'First time'}</span>
          </div>
          <div className="flex items-center">
            <Activity className="w-4 h-4 mr-2" />
            <span>Mode: {authMode === 'supabase' ? 'Production' : 'Demo'}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{stat.name}</p>
                <p className="text-3xl font-bold text-astros-navy mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500 mr-1" />}
                  <p className="text-sm text-slate-600">{stat.change}</p>
                </div>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Intake Forms */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-astros-navy flex items-center">
                <Users className="w-5 h-5 mr-2 text-astros-orange" />
                Recent Intake Forms
              </h2>
              <span className="text-sm text-slate-500">
                {intakeSubmissions.length} total
              </span>
            </div>
          </div>
          <div className="p-6">
            {recentIntakesList.length > 0 ? (
              <div className="space-y-4">
                {recentIntakesList.map((intake) => (
                  <div key={intake.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="flex-1">
                      <div className="font-medium text-astros-navy">
                        {intake.firstName} {intake.lastName}
                      </div>
                      <div className="text-sm text-slate-600">{intake.email}</div>
                      <div className="text-sm text-slate-500 mt-1">
                        Goal: {intake.goals.substring(0, 50)}
                        {intake.goals.length > 50 && '...'}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {getTimeAgo(intake.submittedAt)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(intake.status)}`}>
                        {intake.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No intake forms yet</p>
                <p className="text-sm text-slate-400">New client submissions will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-astros-navy flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-astros-orange" />
                Recent Messages
              </h2>
              <span className="text-sm text-slate-500">
                {contactMessages.length} total
              </span>
            </div>
          </div>
          <div className="p-6">
            {recentMessagesList.length > 0 ? (
              <div className="space-y-4">
                {recentMessagesList.map((message) => (
                  <div key={message.id} className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-astros-navy">{message.name}</div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                        {message.status}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600 mb-1 font-medium">{message.subject}</div>
                    <div className="text-sm text-slate-500 line-clamp-2">
                      {message.message.substring(0, 100)}
                      {message.message.length > 100 && '...'}
                    </div>
                    <div className="text-xs text-slate-400 mt-2">
                      {getTimeAgo(message.submittedAt)} • {message.email}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No messages yet</p>
                <p className="text-sm text-slate-400">Contact form submissions will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-astros-navy mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={handleAddService}
            className="p-4 bg-astros-orange/5 hover:bg-astros-orange/10 rounded-lg text-center transition-colors group"
          >
            <FileText className="w-8 h-8 text-astros-orange mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-sm font-medium text-astros-navy">Add Service</div>
            <div className="text-xs text-slate-500 mt-1">Create new training service</div>
          </button>
          
          <button 
            onClick={handleAddTestimonial}
            className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors group"
          >
            <Star className="w-8 h-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-sm font-medium text-astros-navy">Add Testimonial</div>
            <div className="text-xs text-slate-500 mt-1">Share client success story</div>
          </button>
          
          <button 
            onClick={handleUploadMedia}
            className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors group"
          >
            <Activity className="w-8 h-8 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-sm font-medium text-astros-navy">Upload Media</div>
            <div className="text-xs text-slate-500 mt-1">Add images or videos</div>
          </button>
          
          <button 
            onClick={handleViewSite}
            className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-center transition-colors group"
          >
            <Eye className="w-8 h-8 text-yellow-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-sm font-medium text-astros-navy">View Site</div>
            <div className="text-xs text-slate-500 mt-1">See public website</div>
          </button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-green-900">Conversion Rate</h3>
            <Award className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-900 mb-2">
            {intakeSubmissions.length > 0 
              ? Math.round((intakeSubmissions.filter(s => s.status === 'converted').length / intakeSubmissions.length) * 100)
              : 0
            }%
          </div>
          <p className="text-sm text-green-700">
            {intakeSubmissions.filter(s => s.status === 'converted').length} of {intakeSubmissions.length} inquiries converted
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-blue-900">Response Time</h3>
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-900 mb-2">
            {unreadMessages.length === 0 ? 'Up to date' : `${unreadMessages.length} pending`}
          </div>
          <p className="text-sm text-blue-700">
            {unreadMessages.length === 0 
              ? 'All messages have been addressed'
              : 'Messages waiting for response'
            }
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-purple-900">Active Content</h3>
            <Target className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-900 mb-2">
            {activeServices.length + activeTestimonials.length}
          </div>
          <p className="text-sm text-purple-700">
            {activeServices.length} services, {activeTestimonials.length} testimonials
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;