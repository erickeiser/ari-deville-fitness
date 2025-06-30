import React, { useState, useRef, useEffect } from 'react';
import { useCMS } from '../../contexts/CMSContext';
import { supabase } from '../../lib/supabase';
import { Upload, Image, Video, File, Trash2, Search, Filter, RefreshCw } from 'lucide-react';

const MediaLibrary = () => {
  const { mediaFiles, uploadMedia, deleteMedia } = useCMS();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'document'>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [storageFiles, setStorageFiles] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadStorageFiles();
    
    // Listen for dashboard quick action events
    const handleOpenUpload = () => {
      fileInputRef.current?.click();
    };

    window.addEventListener('openMediaUpload', handleOpenUpload);
    return () => {
      window.removeEventListener('openMediaUpload', handleOpenUpload);
    };
  }, []);

  const loadStorageFiles = async () => {
    if (!supabase) return;
    
    setIsRefreshing(true);
    try {
      const { data: files, error } = await supabase.storage
        .from('media')
        .list('', {
          limit: 100,
          offset: 0,
        });

      if (error) {
        console.error('Error loading storage files:', error);
      } else {
        console.log('Storage files found:', files);
        setStorageFiles(files || []);
      }
    } catch (error) {
      console.error('Error accessing storage:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredMedia = mediaFiles.filter(media => {
    const matchesSearch = media.originalName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || media.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        await uploadMedia(file);
      }
      // Refresh storage files after upload
      await loadStorageFiles();
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="w-6 h-6" />;
      case 'video':
        return <Video className="w-6 h-6" />;
      default:
        return <File className="w-6 h-6" />;
    }
  };

  const getStorageFileUrl = (fileName: string) => {
    if (!supabase) return '';
    const { data } = supabase.storage.from('media').getPublicUrl(fileName);
    return data.publicUrl;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-astros-navy">Media Library</h1>
          <p className="text-slate-600">Upload and manage images, videos, and documents</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadStorageFiles}
            disabled={isRefreshing}
            className="bg-slate-100 hover:bg-slate-200 text-astros-navy px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
          >
            <RefreshCw className={`w-5 h-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-astros-orange hover:bg-astros-orange-dark disabled:bg-astros-orange/60 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
          >
            <Upload className="w-5 h-5 mr-2" />
            {isUploading ? 'Uploading...' : 'Upload Files'}
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,.pdf,.doc,.docx"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Storage Debug Info */}
      {supabase && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Storage Connection Status</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p>✅ Supabase connected</p>
            <p>📁 Storage files found: {storageFiles.length}</p>
            <p>💾 Database media records: {mediaFiles.length}</p>
            {storageFiles.length > 0 && (
              <div className="mt-2">
                <p className="font-medium">Files in storage bucket:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  {storageFiles.slice(0, 5).map((file, index) => (
                    <li key={index} className="text-xs">
                      {file.name} ({formatFileSize(file.metadata?.size || 0)})
                    </li>
                  ))}
                  {storageFiles.length > 5 && (
                    <li className="text-xs italic">...and {storageFiles.length - 5} more</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="pl-10 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange appearance-none bg-white"
          >
            <option value="all">All Files</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="document">Documents</option>
          </select>
        </div>
      </div>

      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 hover:border-astros-orange rounded-xl p-8 text-center cursor-pointer transition-colors"
      >
        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-slate-600 mb-2">Drop files here or click to upload</p>
        <p className="text-sm text-slate-500">Supports images, videos, and documents</p>
        <p className="text-xs text-slate-400 mt-2">
          Recommended video formats: MP4, WebM • Max file size: 100MB
        </p>
      </div>

      {/* Storage Files Section */}
      {storageFiles.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-astros-navy">Files in Storage Bucket</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {storageFiles.map((file, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden group">
                <div className="aspect-square bg-slate-100 flex items-center justify-center relative">
                  {file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                    <img
                      src={getStorageFileUrl(file.name)}
                      alt={file.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : file.name.match(/\.(mp4|webm|mov)$/i) ? (
                    <div className="relative w-full h-full">
                      <video
                        src={getStorageFileUrl(file.name)}
                        className="w-full h-full object-cover"
                        muted
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Video className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-400">
                      <File className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <div className="text-sm font-medium text-astros-navy truncate" title={file.name}>
                    {file.name}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {formatFileSize(file.metadata?.size || 0)}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {new Date(file.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Database Media Files */}
      {filteredMedia.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-astros-navy">Database Media Records</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredMedia.map((media) => (
              <div key={media.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden group">
                <div className="aspect-square bg-slate-100 flex items-center justify-center relative">
                  {media.type === 'image' ? (
                    <img
                      src={media.url}
                      alt={media.originalName}
                      className="w-full h-full object-cover"
                    />
                  ) : media.type === 'video' ? (
                    <div className="relative w-full h-full">
                      <video
                        src={media.url}
                        className="w-full h-full object-cover"
                        muted
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Video className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-400">
                      {getFileIcon(media.type)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                    <button
                      onClick={() => deleteMedia(media.id)}
                      className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-sm font-medium text-astros-navy truncate" title={media.originalName}>
                    {media.originalName}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
                    <span>{formatFileSize(media.size)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      media.type === 'image' ? 'bg-blue-100 text-blue-800' :
                      media.type === 'video' ? 'bg-purple-100 text-purple-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {media.type}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {new Date(media.uploadedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Image className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-lg text-slate-500 mb-2">No media files found in database</p>
          <p className="text-slate-400">Upload some files to get started</p>
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;