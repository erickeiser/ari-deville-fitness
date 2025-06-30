import React, { useState } from 'react';
import { useCMS } from '../../contexts/CMSContext';
import { Users, Eye, MessageSquare, Calendar, Phone, Mail, Target, AlertCircle } from 'lucide-react';
import { IntakeSubmission } from '../../types';

const IntakeManager = () => {
  const { intakeSubmissions, updateIntakeStatus } = useCMS();
  const [selectedSubmission, setSelectedSubmission] = useState<IntakeSubmission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | IntakeSubmission['status']>('all');

  const filteredSubmissions = intakeSubmissions.filter(submission => 
    filterStatus === 'all' || submission.status === filterStatus
  );

  const handleViewSubmission = (submission: IntakeSubmission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
    
    // Mark as read if it's new
    if (submission.status === 'new') {
      updateIntakeStatus(submission.id, 'contacted');
    }
  };

  const handleStatusUpdate = (id: string, status: IntakeSubmission['status'], notes?: string) => {
    updateIntakeStatus(id, status, notes);
    if (selectedSubmission && selectedSubmission.id === id) {
      setSelectedSubmission({ ...selectedSubmission, status, notes });
    }
  };

  const getStatusBadge = (status: IntakeSubmission['status']) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'new':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'contacted':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'scheduled':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'converted':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'declined':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-slate-100 text-slate-800`;
    }
  };

  const getPriorityColor = (submission: IntakeSubmission) => {
    const goals = submission.goals.toLowerCase();
    if (goals.includes('urgent') || goals.includes('asap') || goals.includes('immediately')) {
      return 'border-l-red-500';
    }
    if (submission.preferredService === 'consultation') {
      return 'border-l-astros-orange';
    }
    return 'border-l-slate-200';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-astros-navy">Intake Forms</h1>
          <p className="text-slate-600">Manage client intake submissions and follow-ups</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="scheduled">Scheduled</option>
            <option value="converted">Converted</option>
            <option value="declined">Declined</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', count: intakeSubmissions.length, color: 'bg-slate-100 text-slate-800' },
          { label: 'New', count: intakeSubmissions.filter(s => s.status === 'new').length, color: 'bg-blue-100 text-blue-800' },
          { label: 'Contacted', count: intakeSubmissions.filter(s => s.status === 'contacted').length, color: 'bg-yellow-100 text-yellow-800' },
          { label: 'Scheduled', count: intakeSubmissions.filter(s => s.status === 'scheduled').length, color: 'bg-purple-100 text-purple-800' },
          { label: 'Converted', count: intakeSubmissions.filter(s => s.status === 'converted').length, color: 'bg-green-100 text-green-800' }
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="text-2xl font-bold text-astros-navy">{stat.count}</div>
            <div className={`text-sm px-2 py-1 rounded-full inline-block mt-1 ${stat.color}`}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Submissions List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {filteredSubmissions.length > 0 ? (
          <div className="divide-y divide-slate-200">
            {filteredSubmissions.map((submission) => (
              <div
                key={submission.id}
                className={`p-6 hover:bg-slate-50 cursor-pointer border-l-4 ${getPriorityColor(submission)}`}
                onClick={() => handleViewSubmission(submission)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-lg font-semibold text-astros-navy">
                        {submission.firstName} {submission.lastName}
                      </h3>
                      <span className={getStatusBadge(submission.status)}>
                        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-600">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-astros-orange" />
                        {submission.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-astros-orange" />
                        {submission.phone}
                      </div>
                      <div className="flex items-center">
                        <Target className="w-4 h-4 mr-2 text-astros-orange" />
                        {submission.preferredService}
                      </div>
                    </div>
                    
                    <div className="mt-2 text-sm text-slate-600">
                      <span className="font-medium">Goals:</span> {submission.goals.substring(0, 100)}
                      {submission.goals.length > 100 && '...'}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-slate-500">
                      {new Date(submission.submittedAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {new Date(submission.submittedAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-lg text-slate-500 mb-2">No intake forms found</p>
            <p className="text-slate-400">
              {filterStatus === 'all' 
                ? 'Intake forms will appear here when clients submit them'
                : `No submissions with status "${filterStatus}"`
              }
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {isModalOpen && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-astros-navy">
                    {selectedSubmission.firstName} {selectedSubmission.lastName}
                  </h2>
                  <p className="text-slate-600">Submitted {new Date(selectedSubmission.submittedAt).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-astros-navy flex items-center">
                    <Users className="w-5 h-5 mr-2 text-astros-orange" />
                    Contact Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Email:</span> {selectedSubmission.email}</div>
                    <div><span className="font-medium">Phone:</span> {selectedSubmission.phone}</div>
                    <div><span className="font-medium">Age:</span> {selectedSubmission.age}</div>
                    <div><span className="font-medium">Fitness Level:</span> {selectedSubmission.fitnessLevel}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-astros-navy flex items-center">
                    <Target className="w-5 h-5 mr-2 text-astros-orange" />
                    Preferences
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Preferred Service:</span> {selectedSubmission.preferredService}</div>
                    <div><span className="font-medium">Budget:</span> {selectedSubmission.budget || 'Not specified'}</div>
                    <div><span className="font-medium">Availability:</span></div>
                    <div className="ml-4">
                      {selectedSubmission.availability.length > 0 ? (
                        <ul className="list-disc list-inside">
                          {selectedSubmission.availability.map((time, index) => (
                            <li key={index}>{time}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-slate-500">Not specified</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Goals and Health */}
              <div className="space-y-4">
                <h3 className="font-semibold text-astros-navy flex items-center">
                  <Target className="w-5 h-5 mr-2 text-astros-orange" />
                  Fitness Goals
                </h3>
                <p className="text-sm bg-slate-50 p-4 rounded-lg">{selectedSubmission.goals}</p>
              </div>

              {selectedSubmission.injuries && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-astros-navy flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                    Injuries/Limitations
                  </h3>
                  <p className="text-sm bg-red-50 p-4 rounded-lg border border-red-200">{selectedSubmission.injuries}</p>
                </div>
              )}

              {selectedSubmission.additionalInfo && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-astros-navy">Additional Information</h3>
                  <p className="text-sm bg-slate-50 p-4 rounded-lg">{selectedSubmission.additionalInfo}</p>
                </div>
              )}

              {/* Status Management */}
              <div className="space-y-4 border-t border-slate-200 pt-6">
                <h3 className="font-semibold text-astros-navy">Status Management</h3>
                <div className="flex flex-wrap gap-2">
                  {['new', 'contacted', 'scheduled', 'converted', 'declined'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(selectedSubmission.id, status as IntakeSubmission['status'])}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedSubmission.status === status
                          ? 'bg-astros-orange text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
                
                {selectedSubmission.notes && (
                  <div className="mt-4">
                    <h4 className="font-medium text-astros-navy mb-2">Notes:</h4>
                    <p className="text-sm bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      {selectedSubmission.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
                <a
                  href={`mailto:${selectedSubmission.email}?subject=Re: Your Fitness Training Inquiry&body=Hi ${selectedSubmission.firstName},%0D%0A%0D%0AThank you for your interest in personal training...`}
                  className="bg-astros-orange hover:bg-astros-orange-dark text-white px-6 py-2 rounded-lg font-medium flex items-center transition-colors"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </a>
                <a
                  href={`tel:${selectedSubmission.phone}`}
                  className="bg-slate-100 hover:bg-slate-200 text-astros-navy px-6 py-2 rounded-lg font-medium flex items-center transition-colors"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Client
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntakeManager;