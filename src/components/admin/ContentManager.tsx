import React, { useState } from 'react';
import { useCMS } from '../../contexts/CMSContext';
import { Save, Image, Type, Edit3, Eye, Upload, Grid, X, Video, Play } from 'lucide-react';

const ContentManager = () => {
  const { siteContent, updateSiteContent, getSiteContent, mediaFiles } = useCMS();
  const [activeSection, setActiveSection] = useState('hero');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ [key: string]: string }>({});
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [currentMediaField, setCurrentMediaField] = useState<string | null>(null);
  const [mediaPickerType, setMediaPickerType] = useState<'image' | 'video' | 'all'>('all');

  const contentSections = {
    hero: {
      title: 'Hero Section',
      icon: Image,
      fields: [
        { key: 'title', label: 'Main Title', type: 'text', placeholder: 'Transform Your Body, Transform Your Life' },
        { key: 'subtitle', label: 'Subtitle', type: 'textarea', placeholder: 'Professional personal training with proven results...' },
        { key: 'heroMediaType', label: 'Media Type', type: 'select', options: [
          { value: 'image', label: 'Image' },
          { value: 'video', label: 'Video' }
        ], placeholder: 'Select media type' },
        { key: 'heroImage', label: 'Hero Image', type: 'media', mediaType: 'image', placeholder: 'Select image from media library or enter URL' },
        { key: 'heroVideo', label: 'Hero Video URL', type: 'media', mediaType: 'video', placeholder: 'Select video from media library or enter URL' },
        { key: 'ctaText', label: 'Call to Action Text', type: 'text', placeholder: 'Start Your Journey' },
        { key: 'secondaryCtaText', label: 'Secondary CTA Text', type: 'text', placeholder: 'Learn More' }
      ]
    },
    about: {
      title: 'About Section',
      icon: Type,
      fields: [
        { key: 'title', label: 'Section Title', type: 'text', placeholder: 'Meet Your Dedicated Fitness Partner' },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Hi, I\'m Alex Johnson...' },
        { key: 'trainerImage', label: 'Trainer Image', type: 'media', mediaType: 'image', placeholder: 'Select from media library or enter URL' },
        { key: 'trainerName', label: 'Trainer Name', type: 'text', placeholder: 'Alex Johnson' },
        { key: 'experience', label: 'Years of Experience', type: 'text', placeholder: '5+' }
      ]
    },
    contact: {
      title: 'Contact Information',
      icon: Edit3,
      fields: [
        { key: 'email', label: 'Email Address', type: 'email', placeholder: 'alex@fitprotrainer.com' },
        { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '(555) 123-4567' },
        { key: 'address', label: 'Address', type: 'text', placeholder: 'Downtown Fitness Center' },
        { key: 'addressLine2', label: 'Address Line 2', type: 'text', placeholder: '123 Main Street, City State 12345' },
        { key: 'hours', label: 'Business Hours', type: 'textarea', placeholder: 'Monday - Friday: 6:00 AM - 8:00 PM...' }
      ]
    },
    social: {
      title: 'Social Media',
      icon: Eye,
      fields: [
        { key: 'instagram', label: 'Instagram URL', type: 'url', placeholder: 'https://instagram.com/...' },
        { key: 'facebook', label: 'Facebook URL', type: 'url', placeholder: 'https://facebook.com/...' },
        { key: 'youtube', label: 'YouTube URL', type: 'url', placeholder: 'https://youtube.com/...' },
        { key: 'linkedin', label: 'LinkedIn URL', type: 'url', placeholder: 'https://linkedin.com/...' }
      ]
    }
  };

  const handleEdit = (section: string, key: string) => {
    const currentValue = getSiteContent(section, key);
    setEditValues({ [`${section}_${key}`]: currentValue });
    setIsEditing(`${section}_${key}`);
  };

  const handleSave = (section: string, key: string) => {
    const value = editValues[`${section}_${key}`] || '';
    updateSiteContent(section, key, value);
    setIsEditing(null);
    setEditValues({});
  };

  const handleCancel = () => {
    setIsEditing(null);
    setEditValues({});
  };

  const handleMediaSelect = (mediaUrl: string) => {
    if (currentMediaField) {
      setEditValues({ ...editValues, [currentMediaField]: mediaUrl });
      setShowMediaPicker(false);
      setCurrentMediaField(null);
      setMediaPickerType('all');
    }
  };

  const openMediaPicker = (fieldKey: string, mediaType: 'image' | 'video' | 'all' = 'all') => {
    setCurrentMediaField(fieldKey);
    setMediaPickerType(mediaType);
    setShowMediaPicker(true);
  };

  const getFilteredMediaFiles = () => {
    if (mediaPickerType === 'all') return mediaFiles;
    return mediaFiles.filter(file => file.type === mediaPickerType);
  };

  const renderMediaPreview = (url: string, type: 'image' | 'video' | 'url') => {
    if (!url) return null;

    if (type === 'video' || url.match(/\.(mp4|webm|mov)$/i)) {
      return (
        <div className="relative">
          <video
            src={url}
            className="w-full max-w-md h-48 object-cover rounded-lg border border-slate-200"
            controls
            muted
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
            Video
          </div>
        </div>
      );
    } else {
      return (
        <img
          src={url}
          alt="Preview"
          className="w-full max-w-md h-48 object-cover rounded-lg border border-slate-200"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      );
    }
  };

  const renderField = (section: string, field: any) => {
    const fieldKey = `${section}_${field.key}`;
    const isCurrentlyEditing = isEditing === fieldKey;
    const currentValue = getSiteContent(section, field.key);
    const editValue = editValues[fieldKey] || currentValue;

    return (
      <div key={field.key} className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-astros-navy">{field.label}</h3>
            <p className="text-sm text-slate-600 mt-1">
              Current: {currentValue || 'Not set'}
            </p>
          </div>
          {!isCurrentlyEditing && (
            <button
              onClick={() => handleEdit(section, field.key)}
              className="text-astros-orange hover:text-astros-orange-dark p-2 hover:bg-astros-orange/10 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
        </div>

        {isCurrentlyEditing ? (
          <div className="space-y-4">
            {field.type === 'textarea' ? (
              <textarea
                value={editValue}
                onChange={(e) => setEditValues({ ...editValues, [fieldKey]: e.target.value })}
                placeholder={field.placeholder}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange resize-none"
              />
            ) : field.type === 'select' ? (
              <select
                value={editValue}
                onChange={(e) => setEditValues({ ...editValues, [fieldKey]: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange"
              >
                <option value="">{field.placeholder}</option>
                {field.options?.map((option: any) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === 'media' ? (
              <div className="space-y-4">
                <div className="flex space-x-3">
                  <input
                    type="url"
                    value={editValue}
                    onChange={(e) => setEditValues({ ...editValues, [fieldKey]: e.target.value })}
                    placeholder={field.placeholder}
                    className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange"
                  />
                  <button
                    type="button"
                    onClick={() => openMediaPicker(fieldKey, field.mediaType)}
                    className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-astros-navy rounded-lg transition-colors flex items-center"
                  >
                    {field.mediaType === 'video' ? (
                      <Video className="w-4 h-4 mr-2" />
                    ) : (
                      <Image className="w-4 h-4 mr-2" />
                    )}
                    Select {field.mediaType}
                  </button>
                </div>
                {editValue && renderMediaPreview(editValue, field.mediaType)}
              </div>
            ) : (
              <input
                type={field.type}
                value={editValue}
                onChange={(e) => setEditValues({ ...editValues, [fieldKey]: e.target.value })}
                placeholder={field.placeholder}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange"
              />
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave(section, field.key)}
                className="px-4 py-2 bg-astros-orange hover:bg-astros-orange-dark text-white rounded-lg transition-colors flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 p-4 rounded-lg">
            {(field.type === 'url' || field.type === 'media') && currentValue ? (
              <div className="space-y-2">
                {renderMediaPreview(currentValue, field.mediaType || 'image')}
                <p className="text-sm text-slate-600 break-all">{currentValue}</p>
              </div>
            ) : (
              <p className="text-slate-700 whitespace-pre-wrap">
                {currentValue || <span className="text-slate-400 italic">Click edit to add content</span>}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-astros-navy">Content Management</h1>
          <p className="text-slate-600">Edit website content, images, videos, and text</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Section Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h2 className="font-semibold text-astros-navy mb-4">Sections</h2>
            <nav className="space-y-2">
              {Object.entries(contentSections).map(([key, section]) => {
                const IconComponent = section.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveSection(key)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === key
                        ? 'bg-astros-orange/10 text-astros-orange'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mr-3" />
                    {section.title}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content Editor */}
        <div className="lg:col-span-3">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center mb-6">
                {React.createElement(contentSections[activeSection].icon, {
                  className: "w-6 h-6 text-astros-orange mr-3"
                })}
                <h2 className="text-xl font-semibold text-astros-navy">
                  {contentSections[activeSection].title}
                </h2>
              </div>

              <div className="space-y-6">
                {contentSections[activeSection].fields.map((field) =>
                  renderField(activeSection, field)
                )}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-r from-astros-orange/5 to-astros-orange/10 rounded-xl p-6 border border-astros-orange/20">
              <h3 className="font-semibold text-astros-navy mb-3 flex items-center">
                <Upload className="w-5 h-5 mr-2 text-astros-orange" />
                Content Tips
              </h3>
              <div className="space-y-2 text-sm text-slate-700">
                <p>• <strong>Hero Media:</strong> Choose between image or video for the hero section background</p>
                <p>• <strong>Video Format:</strong> Use MP4 or WebM format for best compatibility and performance</p>
                <p>• <strong>Video Size:</strong> Keep videos under 50MB for fast loading. Consider compression for web</p>
                <p>• <strong>Media Library:</strong> Upload videos to Media Library first, then select them here</p>
                <p>• <strong>Fallback:</strong> Always set a hero image as fallback even when using video</p>
                <p>• <strong>Auto-play:</strong> Videos will auto-play, loop, and be muted for better user experience</p>
                <p>• <strong>Mobile:</strong> Consider that videos may not auto-play on some mobile devices</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Media Picker Modal */}
      {showMediaPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-astros-navy">
                Select {mediaPickerType === 'all' ? 'Media' : mediaPickerType} from Library
              </h2>
              <button
                onClick={() => {
                  setShowMediaPicker(false);
                  setCurrentMediaField(null);
                  setMediaPickerType('all');
                }}
                className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {getFilteredMediaFiles().length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {getFilteredMediaFiles().map((media) => (
                    <div
                      key={media.id}
                      onClick={() => handleMediaSelect(media.url)}
                      className="relative bg-slate-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-astros-orange transition-all group"
                    >
                      {media.type === 'image' ? (
                        <img
                          src={media.url}
                          alt={media.originalName}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : media.type === 'video' ? (
                        <div className="relative">
                          <video
                            src={media.url}
                            className="w-full h-32 object-cover"
                            muted
                          />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <Play className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-32 flex items-center justify-center">
                          <Upload className="w-8 h-8 text-slate-400" />
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 bg-white rounded-full p-2 transition-opacity duration-200">
                          {media.type === 'video' ? (
                            <Video className="w-4 h-4 text-astros-orange" />
                          ) : (
                            <Image className="w-4 h-4 text-astros-orange" />
                          )}
                        </div>
                      </div>
                      
                      <div className="p-2">
                        <div className="text-xs font-medium text-astros-navy truncate" title={media.originalName}>
                          {media.originalName}
                        </div>
                        <div className="text-xs text-slate-500">
                          {new Date(media.uploadedAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            media.type === 'image' ? 'bg-blue-100 text-blue-800' :
                            media.type === 'video' ? 'bg-purple-100 text-purple-800' :
                            'bg-slate-100 text-slate-800'
                          }`}>
                            {media.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  {mediaPickerType === 'video' ? (
                    <Video className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  ) : (
                    <Image className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  )}
                  <p className="text-lg text-slate-500 mb-2">
                    No {mediaPickerType === 'all' ? 'media files' : `${mediaPickerType}s`} in library
                  </p>
                  <p className="text-slate-400 mb-4">
                    Upload some {mediaPickerType === 'all' ? 'files' : `${mediaPickerType}s`} to the media library first
                  </p>
                  <button
                    onClick={() => {
                      setShowMediaPicker(false);
                      setCurrentMediaField(null);
                      setMediaPickerType('all');
                    }}
                    className="bg-astros-orange hover:bg-astros-orange-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Go to Media Library
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManager;