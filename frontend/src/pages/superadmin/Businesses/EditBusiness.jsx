import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader } from 'lucide-react';
import { PRICING_PLANS } from '../../../constants/plans';
import superadminService from '../../../services/superadminService';
import { showError, showSuccess } from '../../../utils/alerts';

const extractBusiness = (response) => {
  const payload = response?.data || response || {};

  if (payload?.business) return payload.business;
  if (payload?.data?.business) return payload.data.business;
  if (payload?.data && !Array.isArray(payload.data)) return payload.data;

  return payload;
};

const normalizeBusiness = (business) => ({
  name: business?.name || business?.businessName || '',
  email: business?.email || business?.ownerEmail || '',
  owner_name: business?.owner_name || business?.ownerName || business?.owner?.name || '',
  phone: business?.phone || business?.ownerPhone || '',
  industry: business?.industry || '',
  country: business?.country || '',
  subscription_plan: business?.subscription_plan || business?.subscriptionPlan || business?.plan || 'starter',
  status: String(business?.status || 'active').toLowerCase(),
  notes: business?.notes || '',
});

export default function EditBusiness() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    owner_name: '',
    phone: '',
    industry: '',
    country: '',
    subscription_plan: 'starter',
    status: 'active',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const industries = [
    'Technology',
    'Retail',
    'E-commerce',
    'Manufacturing',
    'Services',
    'Food & Beverage',
    'Healthcare',
    'Education',
    'Construction',
    'Fashion',
    'Finance',
    'Other'
  ];

  const countries = [
    'United States',
    'United Kingdom',
    'Canada',
    'Australia',
    'Germany',
    'France',
    'Spain',
    'Italy',
    'Netherlands',
    'Other'
  ];

  useEffect(() => {
    fetchBusinessData();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchBusinessData = async () => {
    try {
      setLoading(true);
      const response = await superadminService.getBusinessById(id);
      const business = extractBusiness(response);
      
      if (business) {
        setFormData(normalizeBusiness(business));
      } else {
        navigate('/superadmin/businesses');
      }
    } catch (error) {
      console.error('Error fetching business:', error);
      showError(error?.message || 'Failed to load business details');
      navigate('/superadmin/businesses');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Business name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.owner_name.trim()) {
      newErrors.owner_name = 'Owner name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.industry) {
      newErrors.industry = 'Industry is required';
    }

    if (!formData.country) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      await superadminService.updateBusiness(id, {
        name: formData.name,
        email: formData.email,
        ownerName: formData.owner_name,
        phone: formData.phone,
        industry: formData.industry,
        country: formData.country,
        subscriptionPlan: formData.subscription_plan,
        status: formData.status,
        notes: formData.notes || undefined,
      });
      showSuccess('Business updated successfully');
      
      // Navigate back to business details
      navigate(`/superadmin/businesses/${id}`);
    } catch (error) {
      console.error('Error updating business:', error);
      showError(error?.message || 'Failed to update business');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/superadmin/businesses/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleCancel}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Business</h1>
            <p className="text-gray-600 mt-1">Update business information</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Business Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Acme Innovations Inc."
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="contact@business.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner Name *
              </label>
              <input
                type="text"
                name="owner_name"
                value={formData.owner_name}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                  errors.owner_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="John Doe"
              />
              {errors.owner_name && (
                <p className="mt-1 text-sm text-red-600">{errors.owner_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+1-555-0123"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry *
              </label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                  errors.industry ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select industry</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
              {errors.industry && (
                <p className="mt-1 text-sm text-red-600">{errors.industry}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                  errors.country ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select country</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              {errors.country && (
                <p className="mt-1 text-sm text-red-600">{errors.country}</p>
              )}
            </div>
          </div>
        </div>

        {/* Subscription Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Subscription Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subscription Plan
              </label>
              <select
                name="subscription_plan"
                value={formData.subscription_plan}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
              >
                {PRICING_PLANS.map(plan => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} ({plan.limits?.maxUsers === -1 ? 'Unlimited' : plan.limits?.maxUsers || 0} users, 
                    {plan.limits?.maxProducts === -1 ? 'Unlimited' : (plan.limits?.maxProducts || 0).toLocaleString()} products)
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-gray-500">
                Changing the plan will update usage limits
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
              >
                <option value="active">Active</option>
                <option value="trial">Trial</option>
                <option value="suspended">Suspended</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <p className="mt-2 text-xs text-gray-500">
                Current account status
              </p>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Additional Notes</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors resize-none"
              placeholder="Add any additional notes about this business..."
            />
            <p className="mt-2 text-xs text-gray-500">
              Internal notes visible only to superadmins
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
