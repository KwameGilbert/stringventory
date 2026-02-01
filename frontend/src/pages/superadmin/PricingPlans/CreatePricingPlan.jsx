import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save, Loader, HelpCircle } from 'lucide-react';
import { PRICING_PLANS } from '../../../constants/plans';

export default function CreatePricingPlan() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priceMonthly: '',
    priceYearly: '',
    trialDays: 14,
    popular: false,
    color: 'gray',
    features: [''],
    limits: {
      maxUsers: -1,
      maxProducts: -1,
      maxOrdersPerMonth: -1,
      maxStorageMB: 1024,
      maxLocations: 1,
      maxCategories: -1,
      maxSuppliers: -1,
      maxCustomers: -1
    },
    featureFlags: []
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      const plan = PRICING_PLANS.find(p => p.id === id);
      if (plan) {
        setFormData({
            ...plan,
            // Ensure limits are merged correctly if schema differs slightly, but here it matches
            limits: { ...plan.limits },
            features: [...plan.features], 
            featureFlags: [...plan.featureFlags]
        });
      }
    }
  }, [id, isEditing]);

  const colors = [
    { name: 'Gray', value: 'gray', class: 'bg-gray-500' },
    { name: 'emerald ', value: 'emerald ', class: 'bg-emerald-500' },
    { name: 'Emerald', value: 'emerald', class: 'bg-emerald-500' },
    { name: 'Blue', value: 'blue', class: 'bg-blue-500' },
    { name: 'Amber', value: 'amber', class: 'bg-amber-500' },
    { name: 'Rose', value: 'rose', class: 'bg-rose-500' },
  ];

  const availableFeatureFlags = [
    { id: 'dashboard', label: 'Dashboard Access' },
    { id: 'products', label: 'Product Management' },
    { id: 'orders', label: 'Order Management' },
    { id: 'customers', label: 'Customer Management' },
    { id: 'inventory', label: 'Inventory Tracking' },
    { id: 'suppliers', label: 'Supplier Management' },
    { id: 'purchases', label: 'Purchase Orders' },
    { id: 'expenses', label: 'Expense Tracking' },
    { id: 'categories', label: 'Category Management' },
    { id: 'users', label: 'Team Management' },
    { id: 'settings', label: 'Settings Access' },
    { id: 'multi_location', label: 'Multi-Location Support' },
    { id: 'advanced_analytics', label: 'Advanced Analytics' },
    { id: 'advanced_reports', label: 'Advanced Reports' },
    { id: 'api_access', label: 'API Access' },
    { id: 'bulk_operations', label: 'Bulk Operations' },
    { id: 'custom_branding', label: 'Custom Branding' },
    { id: 'webhooks', label: 'Webhooks' },
    { id: 'audit_logs', label: 'Audit Logs' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('limit_')) {
      const limitName = name.replace('limit_', '');
      setFormData(prev => ({
        ...prev,
        limits: {
          ...prev.limits,
          [limitName]: type === 'checkbox' ? (checked ? -1 : 0) : parseInt(value) || 0
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const toggleFeatureFlag = (flagId) => {
    setFormData(prev => {
      const flags = prev.featureFlags.includes(flagId)
        ? prev.featureFlags.filter(f => f !== flagId)
        : [...prev.featureFlags, flagId];
      return { ...prev, featureFlags: flags };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Plan name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.priceMonthly === '') newErrors.priceMonthly = 'Monthly price is required';
    if (formData.priceYearly === '') newErrors.priceYearly = 'Yearly price is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Create new plan object
      const newPlan = {
        id: formData.name.toLowerCase().replace(/\s+/g, '_'),
        slug: formData.name.toLowerCase().replace(/\s+/g, '_'),
        ...formData,
        priceMonthly: Number(formData.priceMonthly),
        priceYearly: Number(formData.priceYearly),
        features: formData.features.filter(f => f.trim() !== '')
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(isEditing ? 'Updated Plan:' : 'Created Plan:', newPlan);
      
      navigate('/superadmin/pricing-plans');
    } catch (error) {
      console.error('Error creating plan:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/superadmin/pricing-plans')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{isEditing ? 'Edit Pricing Plan' : 'Create Pricing Plan'}</h1>
            <p className="text-gray-600 mt-1">{isEditing ? 'Update subscription tier details' : 'Add a new subscription tier'}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Plan Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plan Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g., Ultra Premium"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Brief description of the plan"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Theme Color</label>
              <div className="flex gap-3">
                {colors.map(color => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                    className={`w-8 h-8 rounded-full ${color.class} ${formData.color === color.value ? 'ring-2 ring-offset-2 ring-emerald-600' : ''}`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="popular"
                name="popular"
                checked={formData.popular}
                onChange={handleChange}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <label htmlFor="popular" className="text-sm font-medium text-gray-700">
                Mark as Popular Plan
              </label>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Pricing Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Price ($) *</label>
              <input
                type="number"
                name="priceMonthly"
                value={formData.priceMonthly}
                onChange={handleChange}
                min="0"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${errors.priceMonthly ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Yearly Price ($) *</label>
              <input
                type="number"
                name="priceYearly"
                value={formData.priceYearly}
                onChange={handleChange}
                min="0"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${errors.priceYearly ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trial Days</label>
              <input
                type="number"
                name="trialDays"
                value={formData.trialDays}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Limits */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Usage Limits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Max Users', key: 'maxUsers' },
              { label: 'Max Products', key: 'maxProducts' },
              { label: 'Max Orders/Mo', key: 'maxOrdersPerMonth' },
              { label: 'Max Categories', key: 'maxCategories' },
              { label: 'Max Suppliers', key: 'maxSuppliers' },
              { label: 'Max Customers', key: 'maxCustomers' },
              { label: 'Max Locations', key: 'maxLocations' },
            ].map((limit) => (
              <div key={limit.key}>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">{limit.label}</label>
                  <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
                    <input
                      type="checkbox"
                      name={`limit_${limit.key}`}
                      checked={formData.limits[limit.key] === -1}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    Unlimited
                  </label>
                </div>
                <input
                  type="number"
                  name={`limit_${limit.key}`}
                  value={formData.limits[limit.key] === -1 ? '' : formData.limits[limit.key]}
                  disabled={formData.limits[limit.key] === -1}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors disabled:bg-gray-100 disabled:text-gray-400"
                  placeholder={formData.limits[limit.key] === -1 ? 'Unlimited' : '0'}
                />
              </div>
            ))}
            
            {/* Storage Special Case */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Max Storage (MB)</label>
                <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
                  <input
                    type="checkbox"
                    name="limit_maxStorageMB"
                    checked={formData.limits.maxStorageMB === -1}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  Unlimited
                </label>
              </div>
              <input
                type="number"
                name="limit_maxStorageMB"
                value={formData.limits.maxStorageMB === -1 ? '' : formData.limits.maxStorageMB}
                disabled={formData.limits.maxStorageMB === -1}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors disabled:bg-gray-100 disabled:text-gray-400"
                placeholder={formData.limits.maxStorageMB === -1 ? 'Unlimited' : '0'}
              />
              {formData.limits.maxStorageMB !== -1 && (
                <p className="mt-1 text-xs text-gray-500">
                  Allows ~{(formData.limits.maxStorageMB / 1024).toFixed(1)} GB
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Features & Flags */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Marketing Features</h2>
            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g., 24/7 Priority Support"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-700"
              >
                <Plus className="w-4 h-4" /> Add Feature
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">System Capabilities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableFeatureFlags.map((flag) => (
                <label key={flag.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featureFlags.includes(flag.id)}
                    onChange={() => toggleFeatureFlag(flag.id)}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">{flag.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/superadmin/pricing-plans')}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {isEditing ? 'Update Pricing Plan' : 'Create Pricing Plan'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
