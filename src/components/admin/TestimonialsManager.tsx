import React, { useState, useEffect } from 'react';
import { useCMS } from '../../contexts/CMSContext';
import { Plus, Edit, Trash2, Eye, EyeOff, Star, Play } from 'lucide-react';
import { Testimonial } from '../../types';

const TestimonialsManager = () => {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useCMS();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    image: '',
    videoThumb: '',
    videoUrl: '',
    quote: '',
    rating: 5,
    results: '',
    featured: false,
    active: true
  });

  // Listen for dashboard quick action events
  useEffect(() => {
    const handleOpenAddModal = () => {
      handleOpenModal();
    };

    window.addEventListener('openAddTestimonialModal', handleOpenAddModal);
    return () => {
      window.removeEventListener('openAddTestimonialModal', handleOpenAddModal);
    };
  }, []);

  const handleOpenModal = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        name: testimonial.name,
        title: testimonial.title,
        image: testimonial.image,
        videoThumb: testimonial.videoThumb,
        videoUrl: testimonial.videoUrl || '',
        quote: testimonial.quote,
        rating: testimonial.rating,
        results: testimonial.results,
        featured: testimonial.featured,
        active: testimonial.active
      });
    } else {
      setEditingTestimonial(null);
      setFormData({
        name: '',
        title: '',
        image: '',
        videoThumb: '',
        videoUrl: '',
        quote: '',
        rating: 5,
        results: '',
        featured: false,
        active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTestimonial(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTestimonial) {
      updateTestimonial(editingTestimonial.id, formData);
    } else {
      addTestimonial(formData);
    }
    handleCloseModal();
  };

  const toggleTestimonialStatus = (testimonial: Testimonial) => {
    updateTestimonial(testimonial.id, { active: !testimonial.active });
  };

  const toggleFeatured = (testimonial: Testimonial) => {
    updateTestimonial(testimonial.id, { featured: !testimonial.featured });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-astros-navy">Testimonials Management</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-astros-orange hover:bg-astros-orange-dark text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Testimonial
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="relative">
              <img
                src={testimonial.videoThumb}
                alt={`${testimonial.name} testimonial`}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Play className="w-12 h-12 text-white opacity-80" />
              </div>
              <div className="absolute top-2 right-2 flex space-x-1">
                {testimonial.featured && (
                  <span className="bg-astros-orange text-white px-2 py-1 rounded text-xs font-medium">
                    Featured
                  </span>
                )}
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  testimonial.active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {testimonial.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-astros-navy">{testimonial.name}</div>
                  <div className="text-sm text-slate-600">{testimonial.title}</div>
                </div>
              </div>

              <div className="flex items-center mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-astros-orange fill-current" />
                ))}
              </div>

              <p className="text-sm text-slate-600 mb-3 line-clamp-3">"{testimonial.quote}"</p>
              
              <div className="text-sm font-medium text-astros-orange mb-4">{testimonial.results}</div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleOpenModal(testimonial)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-astros-navy px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-colors"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => toggleFeatured(testimonial)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    testimonial.featured
                      ? 'bg-astros-orange/10 text-astros-orange hover:bg-astros-orange/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Star className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleTestimonialStatus(testimonial)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    testimonial.active ? 'text-astros-orange' : 'text-slate-400'
                  }`}
                >
                  {testimonial.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => deleteTestimonial(testimonial.id)}
                  className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-sm font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-astros-navy">
                {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Title/Occupation
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Profile Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Video Thumbnail URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.videoThumb}
                    onChange={(e) => setFormData({ ...formData, videoThumb: e.target.value })}
                    placeholder="https://example.com/thumbnail.jpg"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Video URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Testimonial Quote *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange resize-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Rating *
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange"
                  >
                    {[1, 2, 3, 4, 5].map(rating => (
                      <option key={rating} value={rating}>{rating} Star{rating > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Results Summary *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.results}
                    onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                    placeholder="e.g., Lost 30 lbs | Gained Confidence"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-slate-300 text-astros-orange focus:ring-astros-orange"
                  />
                  <span className="ml-2 text-sm text-slate-700">Featured Testimonial</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded border-slate-300 text-astros-orange focus:ring-astros-orange"
                  />
                  <span className="ml-2 text-sm text-slate-700">Active</span>
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-astros-orange hover:bg-astros-orange-dark text-white rounded-lg transition-colors"
                >
                  {editingTestimonial ? 'Update Testimonial' : 'Add Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsManager;