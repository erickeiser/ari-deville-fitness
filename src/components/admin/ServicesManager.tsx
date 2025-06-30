import React, { useState, useEffect } from 'react';
import { useCMS } from '../../contexts/CMSContext';
import { Plus, Edit, Trash2, Eye, EyeOff, Star } from 'lucide-react';
import { Service } from '../../types';

const ServicesManager = () => {
  const { services, addService, updateService, deleteService } = useCMS();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    features: [''],
    icon: 'User',
    popular: false,
    active: true
  });

  const iconOptions = [
    'User', 'Users', 'Video', 'Utensils', 'Dumbbell', 'Heart', 'Target', 'Zap'
  ];

  // Listen for dashboard quick action events
  useEffect(() => {
    const handleOpenAddModal = () => {
      handleOpenModal();
    };

    window.addEventListener('openAddServiceModal', handleOpenAddModal);
    return () => {
      window.removeEventListener('openAddServiceModal', handleOpenAddModal);
    };
  }, []);

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        price: service.price,
        description: service.description,
        features: service.features,
        icon: service.icon,
        popular: service.popular,
        active: service.active
      });
    } else {
      setEditingService(null);
      setFormData({
        title: '',
        price: '',
        description: '',
        features: [''],
        icon: 'User',
        popular: false,
        active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const serviceData = {
      ...formData,
      features: formData.features.filter(f => f.trim() !== '')
    };

    if (editingService) {
      updateService(editingService.id, serviceData);
    } else {
      addService(serviceData);
    }
    handleCloseModal();
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const toggleServiceStatus = (service: Service) => {
    updateService(service.id, { active: !service.active });
  };

  const togglePopular = (service: Service) => {
    updateService(service.id, { popular: !service.popular });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-astros-navy">Services Management</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-astros-orange hover:bg-astros-orange-dark text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Service
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-astros-navy">{service.title}</h3>
                <div className="flex items-center space-x-2">
                  {service.popular && (
                    <Star className="w-5 h-5 text-astros-orange fill-current" />
                  )}
                  <button
                    onClick={() => toggleServiceStatus(service)}
                    className={`p-1 rounded ${service.active ? 'text-astros-orange' : 'text-slate-400'}`}
                  >
                    {service.active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div className="text-2xl font-bold text-astros-orange mb-2">{service.price}</div>
              <p className="text-slate-600 text-sm mb-4">{service.description}</p>
              
              <div className="space-y-2 mb-4">
                {service.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="text-sm text-slate-600 flex items-center">
                    <div className="w-1.5 h-1.5 bg-astros-orange rounded-full mr-2"></div>
                    {feature}
                  </div>
                ))}
                {service.features.length > 3 && (
                  <div className="text-sm text-slate-500">+{service.features.length - 3} more features</div>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleOpenModal(service)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-astros-navy px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-colors"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => togglePopular(service)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    service.popular
                      ? 'bg-astros-orange/10 text-astros-orange hover:bg-astros-orange/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Star className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteService(service.id)}
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
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Price *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g., $80/session"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Features
                </label>
                <div className="space-y-3">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        placeholder="Enter feature"
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFeature}
                    className="text-astros-orange hover:text-astros-orange-dark text-sm font-medium"
                  >
                    + Add Feature
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Icon
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-astros-orange focus:border-astros-orange"
                  >
                    {iconOptions.map((icon) => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.popular}
                      onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                      className="rounded border-slate-300 text-astros-orange focus:ring-astros-orange"
                    />
                    <span className="ml-2 text-sm text-slate-700">Mark as Popular</span>
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
                  {editingService ? 'Update Service' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManager;