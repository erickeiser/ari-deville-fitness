import React, { useState } from 'react';
import { useCMS } from '../../contexts/CMSContext';
import { 
  MessageSquare, 
  Eye, 
  Mail, 
  Phone, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Archive,
  Star,
  Search,
  Filter,
  Send,
  X,
  User,
  ExternalLink
} from 'lucide-react';
import { ContactMessage } from '../../types';

const MessagesManager = () => {
  const { contactMessages, updateMessageStatus } = useCMS();
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | ContactMessage['status']>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | ContactMessage['priority']>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  // Filter and search messages
  const filteredMessages = contactMessages.filter(message => {
    const matchesSearch = 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || message.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || message.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Sort messages by date (newest first)
  const sortedMessages = filteredMessages.sort((a, b) => 
    new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
    
    // Mark as read if it's new
    if (message.status === 'new') {
      updateMessageStatus(message.id, 'read');
      // Update the selected message status locally
      setSelectedMessage({ ...message, status: 'read' });
    }
  };

  const handleStatusUpdate = (id: string, status: ContactMessage['status']) => {
    updateMessageStatus(id, status);
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage({ ...selectedMessage, status });
    }
  };

  const handleReply = () => {
    if (!selectedMessage) return;
    
    const subject = `Re: ${selectedMessage.subject}`;
    const body = `Hi ${selectedMessage.name},\n\n${replyText}\n\nBest regards,\nAri Deville\nAri Deville Fitness\n\nOriginal message:\n"${selectedMessage.message}"`;
    
    const mailtoLink = `mailto:${selectedMessage.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
    
    // Mark as replied
    handleStatusUpdate(selectedMessage.id, 'replied');
    setIsReplying(false);
    setReplyText('');
  };

  const getStatusBadge = (status: ContactMessage['status']) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'new':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'read':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'replied':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'archived':
        return `${baseClasses} bg-slate-100 text-slate-800`;
      default:
        return `${baseClasses} bg-slate-100 text-slate-800`;
    }
  };

  const getPriorityBadge = (priority: ContactMessage['priority']) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (priority) {
      case 'high':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'medium':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'low':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-slate-100 text-slate-800`;
    }
  };

  const getStatusIcon = (status: ContactMessage['status']) => {
    switch (status) {
      case 'new':
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      case 'read':
        return <Eye className="w-4 h-4 text-yellow-600" />;
      case 'replied':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'archived':
        return <Archive className="w-4 h-4 text-slate-600" />;
      default:
        return <MessageSquare className="w-4 h-4 text-slate-600" />;
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

  const getPriorityColor = (priority: ContactMessage['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-astros-navy">Messages</h1>
          <p className="text-slate-600">Manage contact form submissions and customer inquiries</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600">Total:</span>
            <span className="font-semibold text-astros-navy">{contactMessages.length}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { 
            label: 'New', 
            count: contactMessages.filter(m => m.status === 'new').length, 
            color: 'bg-blue-100 text-blue-800',
            icon: AlertCircle
          },
          { 
            label: 'Read', 
            count: contactMessages.filter(m => m.status === 'read').length, 
            color: 'bg-yellow-100 text-yellow-800',
            icon: Eye
          },
          { 
            label: 'Replied', 
            count: contactMessages.filter(m => m.status === 'replied').length, 
            color: 'bg-green-100 text-green-800',
            icon: CheckCircle
          },
          { 
            label: 'High Priority', 
            count: contactMessages.filter(m => m.priority === 'high').length, 
            color: 'bg-red-100 text-red-800',
            icon: Star
          }
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-astros-navy">{stat.count}</div>
                <div className={`text-sm px-2 py-1 rounded-full inline-flex items-center mt-1 ${stat.color}`}>
                  <stat.icon className="w-3 h-3 mr-1" />
                  {stat.label}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange"
            />
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="pl-9 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as any)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange appearance-none bg-white"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {sortedMessages.length > 0 ? (
          <div className="divide-y divide-slate-200">
            {sortedMessages.map((message) => (
              <div
                key={message.id}
                className={`p-6 hover:bg-slate-50 cursor-pointer border-l-4 ${getPriorityColor(message.priority)} transition-colors`}
                onClick={() => handleViewMessage(message)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(message.status)}
                        <h3 className="text-lg font-semibold text-astros-navy">
                          {message.name}
                        </h3>
                      </div>
                      <span className={getStatusBadge(message.status)}>
                        {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                      </span>
                      <span className={getPriorityBadge(message.priority)}>
                        {message.priority.charAt(0).toUpperCase() + message.priority.slice(1)}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-slate-600">
                        <Mail className="w-4 h-4 mr-2 text-astros-orange" />
                        {message.email}
                      </div>
                      
                      <div className="font-medium text-astros-navy">
                        Subject: {message.subject}
                      </div>
                      
                      <div className="text-slate-600 line-clamp-2">
                        {message.message.substring(0, 150)}
                        {message.message.length > 150 && '...'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <div className="text-sm text-slate-500 mb-1">
                      {getTimeAgo(message.submittedAt)}
                    </div>
                    <div className="text-xs text-slate-400">
                      {new Date(message.submittedAt).toLocaleString()}
                    </div>
                    {message.repliedAt && (
                      <div className="text-xs text-green-600 mt-1">
                        Replied {getTimeAgo(message.repliedAt)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-lg text-slate-500 mb-2">No messages found</p>
            <p className="text-slate-400">
              {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                ? 'Try adjusting your filters or search terms'
                : 'Contact form submissions will appear here'
              }
            </p>
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {isModalOpen && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-astros-orange/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-astros-orange" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-astros-navy">
                      {selectedMessage.name}
                    </h2>
                    <p className="text-slate-600">{selectedMessage.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={getStatusBadge(selectedMessage.status)}>
                        {selectedMessage.status.charAt(0).toUpperCase() + selectedMessage.status.slice(1)}
                      </span>
                      <span className={getPriorityBadge(selectedMessage.priority)}>
                        {selectedMessage.priority.charAt(0).toUpperCase() + selectedMessage.priority.slice(1)} Priority
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsReplying(false);
                    setReplyText('');
                  }}
                  className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Message Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-astros-navy flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-astros-orange" />
                    Message Details
                  </h3>
                  <div className="text-sm text-slate-500">
                    Received {new Date(selectedMessage.submittedAt).toLocaleString()}
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="font-medium text-astros-navy mb-2">
                    Subject: {selectedMessage.subject}
                  </div>
                  <div className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.message}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-astros-navy">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-astros-orange mr-3" />
                      <span className="text-slate-700">{selectedMessage.email}</span>
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="ml-2 text-astros-orange hover:text-astros-orange-dark"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-astros-navy">Message Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-astros-orange mr-3" />
                      <span className="text-slate-700">
                        Submitted: {new Date(selectedMessage.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                    {selectedMessage.repliedAt && (
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                        <span className="text-slate-700">
                          Replied: {new Date(selectedMessage.repliedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Management */}
              <div className="space-y-4 border-t border-slate-200 pt-6">
                <h4 className="font-semibold text-astros-navy">Update Status</h4>
                <div className="flex flex-wrap gap-2">
                  {['new', 'read', 'replied', 'archived'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(selectedMessage.id, status as ContactMessage['status'])}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedMessage.status === status
                          ? 'bg-astros-orange text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reply Section */}
              <div className="space-y-4 border-t border-slate-200 pt-6">
                {!isReplying ? (
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-astros-navy">Quick Actions</h4>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setIsReplying(true)}
                        className="bg-astros-orange hover:bg-astros-orange-dark text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Reply via Email
                      </button>
                      <a
                        href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                        className="bg-slate-100 hover:bg-slate-200 text-astros-navy px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Open Email Client
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-astros-navy">Compose Reply</h4>
                      <button
                        onClick={() => {
                          setIsReplying(false);
                          setReplyText('');
                        }}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <div className="text-sm text-slate-600 mb-2">
                        <strong>To:</strong> {selectedMessage.email}<br />
                        <strong>Subject:</strong> Re: {selectedMessage.subject}
                      </div>
                    </div>
                    
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply here..."
                      rows={6}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange resize-none"
                    />
                    
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => {
                          setIsReplying(false);
                          setReplyText('');
                        }}
                        className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleReply}
                        disabled={!replyText.trim()}
                        className="px-4 py-2 bg-astros-orange hover:bg-astros-orange-dark disabled:bg-astros-orange/60 text-white rounded-lg transition-colors flex items-center"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesManager;