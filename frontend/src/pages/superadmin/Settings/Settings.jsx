import { useState, useEffect } from 'react';
import { 
  Save, 
  Globe, 
  Mail, 
  Bell,
  Shield,
  CreditCard,
  Database,
  Key,
  Palette,
  Monitor,
  Cpu,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Copy,
  Check,
  Info,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import superadminService from '../../../services/superadminService';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [copying, setCopying] = useState(null);
  
  const [settings, setSettings] = useState({
    general: {
      platformName: 'StringVentory',
      platformEmail: 'admin@stringventory.com',
      supportEmail: 'support@stringventory.com',
      companyName: 'StringTech Solutions',
      maintenanceMode: false,
    },
    appearance: {
      primaryColor: 'emerald',
      themeMode: 'light',
      density: 'comfortable',
    },
    notifications: {
      emailNotifications: true,
      newBusinessNotification: true,
      paymentNotification: true,
      systemAlerts: true,
      emailProvider: 'smtp',
      smtpConfig: {
        host: 'smtp.mailtrap.io',
        port: '587',
        user: 'user_123',
        password: '••••••••',
        senderName: 'StringVentory Admin',
        senderEmail: 'noreply@stringventory.com',
      }
    },
    billing: {
      currency: 'USD',
      taxRate: 15.0,
      invoicePrefix: 'SV-',
      enableTrials: true,
      trialDays: 14,
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAttempts: 5,
    },
    integrations: {
      apiKeys: [
        { id: '1', name: 'Frontend API', key: 'pk_live_****************', status: 'active', createdAt: '2026-01-01' }
      ],
      webhooks: [
        { id: '1', url: 'https://hooks.slack.com/services/...', event: 'business.signup', status: 'active' }
      ]
    }
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await superadminService.getSettings();
        if (response.data) {
          // Merge with default to ensure structure exists
          setSettings(prev => ({
            ...prev,
            ...response.data
          }));
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const tabs = [
    { id: 'general', name: 'General', icon: Globe },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'email', name: 'Email/SMTP', icon: Mail },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'integrations', name: 'Integrations', icon: Key },
    { id: 'database', name: 'Database', icon: Database },
  ];

  const handleSave = async () => {
    try {
      await superadminService.updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const updateNestedField = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const updateSmtpField = (field, value) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        smtpConfig: {
          ...prev.notifications.smtpConfig,
          [field]: value
        }
      }
    }));
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopying(id);
    setTimeout(() => setCopying(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-10 h-10 text-emerald-500 animate-spin" />
          <p className="text-gray-500 font-medium">Loading platform settings...</p>
        </div>
      </div>
    );
  }

  const themeColors = [
    { id: 'emerald', name: 'Emerald', bg: 'bg-emerald-500', text: 'text-emerald-600' },
    { id: 'blue', name: 'Blue', bg: 'bg-blue-500', text: 'text-blue-600' },
    { id: 'indigo', name: 'Indigo', bg: 'bg-indigo-500', text: 'text-indigo-600' },
    { id: 'rose', name: 'Rose', bg: 'bg-rose-500', text: 'text-rose-600' },
    { id: 'amber', name: 'Amber', bg: 'bg-amber-500', text: 'text-amber-600' },
    { id: 'slate', name: 'Slate', bg: 'bg-slate-700', text: 'text-slate-800' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Platform Settings</h1>
          <p className="text-gray-600">Global configuration for StringVentory platform</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-emerald-600 font-medium animate-in fade-in slide-in-from-right-4">
              <Check className="w-4 h-4" />
              Changes saved
            </span>
          )}
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
          >
            <Save className="w-5 h-5" />
            Save Configuration
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 sticky top-6">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left group
                      ${isActive 
                        ? 'bg-emerald-50 text-emerald-700 font-bold shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-emerald-600' : 'text-gray-400 group-hover:text-emerald-600'}`} />
                    <span className="text-sm">{tab.name}</span>
                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[600px] flex flex-col">
            <div className="p-8 flex-1">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <Globe className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">General Information</h2>
                      <p className="text-sm text-gray-500">Basic platform identity and status</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Platform Name</label>
                      <input
                        type="text"
                        value={settings.general.platformName}
                        onChange={(e) => updateNestedField('general', 'platformName', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                        placeholder="e.g. StringVentory"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Official Company Name</label>
                      <input
                        type="text"
                        value={settings.general.companyName}
                        onChange={(e) => updateNestedField('general', 'companyName', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Platform Email</label>
                      <input
                        type="email"
                        value={settings.general.platformEmail}
                        onChange={(e) => updateNestedField('general', 'platformEmail', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Support Email Address</label>
                      <input
                        type="email"
                        value={settings.general.supportEmail}
                        onChange={(e) => updateNestedField('general', 'supportEmail', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-4">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-amber-900">Platform Maintenance Mode</p>
                          <p className="text-sm text-amber-700">When enabled, all business users will see a maintenance page and will be unable to log in.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.general.maintenanceMode}
                            onChange={(e) => updateNestedField('general', 'maintenanceMode', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <Palette className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Platform Appearance</h2>
                      <p className="text-sm text-gray-500">Customize the look and feel of your admin panel</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-4 block">Primary Brand Color</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                        {themeColors.map((color) => (
                          <button
                            key={color.id}
                            onClick={() => updateNestedField('appearance', 'primaryColor', color.id)}
                            className={`
                              flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all
                              ${settings.appearance.primaryColor === color.id 
                                ? `border-${color.id === 'slate' ? 'slate-800' : color.id + '-500'} bg-${color.id === 'slate' ? 'slate-50' : color.id + '-50'}` 
                                : 'border-transparent bg-gray-50 hover:bg-gray-100'
                              }
                            `}
                          >
                            <div className={`w-8 h-8 rounded-full shadow-sm ${color.bg}`} />
                            <span className="text-xs font-bold">{color.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                      <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                          <Monitor className="w-4 h-4" />
                          Theme Mode
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {['light', 'dark', 'system'].map((mode) => (
                            <button
                              key={mode}
                              onClick={() => updateNestedField('appearance', 'themeMode', mode)}
                              className={`
                                py-2 px-3 rounded-lg border text-xs font-bold capitalize transition-all
                                ${settings.appearance.themeMode === mode 
                                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' 
                                  : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-300'
                                }
                              `}
                            >
                              {mode}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                          <Plus className="w-4 h-4" />
                          Interface Density
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {['comfortable', 'compact'].map((d) => (
                            <button
                              key={d}
                              onClick={() => updateNestedField('appearance', 'density', d)}
                              className={`
                                py-2 px-3 rounded-lg border text-xs font-bold capitalize transition-all
                                ${settings.appearance.density === d 
                                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' 
                                  : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-300'
                                }
                              `}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                      <Eye className="w-24 h-24" />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-lg font-bold mb-2">Live Preview</h3>
                      <p className="text-slate-400 text-sm mb-6">This is how your dashboard buttons and accents will look.</p>
                      <div className="flex flex-wrap gap-4">
                        <button className={`px-6 py-2 rounded-lg font-bold bg-${settings.appearance.primaryColor === 'slate' ? 'white text-slate-900' : settings.appearance.primaryColor + '-500'} shadow-lg`}>
                          Primary Button
                        </button>
                        <button className="px-6 py-2 rounded-lg font-bold bg-slate-800 border border-slate-700 hover:bg-slate-700">
                          Secondary
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Email/SMTP Settings */}
              {activeTab === 'email' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <Mail className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Email & SMTP</h2>
                      <p className="text-sm text-gray-500">Configure how the platform sends transactional emails</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['smtp', 'sendgrid', 'mailgun'].map((provider) => (
                      <button
                        key={provider}
                        onClick={() => updateNestedField('notifications', 'emailProvider', provider)}
                        className={`
                          p-4 rounded-xl border-2 transition-all text-left
                          ${settings.notifications.emailProvider === provider 
                            ? 'border-emerald-500 bg-emerald-50' 
                            : 'border-gray-100 bg-gray-50 hover:border-emerald-200'
                          }
                        `}
                      >
                        <p className="font-bold text-sm capitalize">{provider}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {provider === 'smtp' ? 'Custom SMTP Server' : `Native ${provider} integration`}
                        </p>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">SMTP Host</label>
                      <input
                        type="text"
                        value={settings.notifications.smtpConfig.host}
                        onChange={(e) => updateSmtpField('host', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">SMTP Port</label>
                      <input
                        type="text"
                        value={settings.notifications.smtpConfig.port}
                        onChange={(e) => updateSmtpField('port', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">SMTP Username</label>
                      <input
                        type="text"
                        value={settings.notifications.smtpConfig.user}
                        onChange={(e) => updateSmtpField('user', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">SMTP Password</label>
                      <div className="relative">
                        <input
                          type="password"
                          value={settings.notifications.smtpConfig.password}
                          onChange={(e) => updateSmtpField('password', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 italic">
                      <Info className="w-4 h-4" />
                      We recommend using a dedicated provider for better deliverability.
                    </div>
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                      Send Test Email
                    </button>
                  </div>
                </div>
              )}

              {/* Integrations Tab */}
              {activeTab === 'integrations' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-50 rounded-lg">
                        <Key className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">API & Integrations</h2>
                        <p className="text-sm text-gray-500">Manage platform access and external connections</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow-md transition-all active:scale-95">
                      <Plus className="w-4 h-4" />
                      New API Key
                    </button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Active API Keys</h3>
                    {settings.integrations?.apiKeys?.map((key) => (
                      <div key={key.id} className="flex items-center justify-between p-4 border border-gray-100 bg-gray-50 rounded-2xl group">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                            <Cpu className="w-5 h-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{key.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <code className="text-xs bg-gray-200 px-1.5 py-0.5 rounded text-gray-700">{key.key}</code>
                              <button 
                                onClick={() => handleCopy(key.key, `key-${key.id}`)}
                                className="text-gray-400 hover:text-emerald-600 transition-colors"
                              >
                                {copying === `key-${key.id}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="hidden sm:block text-right">
                            <p className="text-xs text-gray-500">Created</p>
                            <p className="text-xs font-bold text-gray-700">{key.createdAt}</p>
                          </div>
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-full tracking-wider">
                            {key.status}
                          </span>
                          <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl">
                    <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                      <RefreshCw className="w-5 h-5" />
                      Webhooks
                    </h3>
                    <p className="text-sm text-indigo-700 mb-4">Receive real-time notifications when important events happen on your platform.</p>
                    <div className="space-y-2 mb-6">
                      {settings.integrations?.webhooks?.map(hook => (
                        <div key={hook.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-indigo-200">
                          <span className="text-xs font-mono text-indigo-900 truncate max-w-[200px]">{hook.url}</span>
                          <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded uppercase">{hook.event}</span>
                        </div>
                      ))}
                    </div>
                    <button className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                      Configure Webhooks →
                    </button>
                  </div>
                </div>
              )}

              {/* Fallback for other tabs */}
              {['notifications', 'security', 'billing', 'database'].includes(activeTab) && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      {tabs.find(t => t.id === activeTab).icon && (
                        <div className="w-6 h-6 text-emerald-600">
                          {(() => {
                            const Icon = tabs.find(t => t.id === activeTab).icon;
                            return <Icon />;
                          })()}
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 capitalize">{activeTab} Settings</h2>
                      <p className="text-sm text-gray-500">Configure platform {activeTab} preferences</p>
                    </div>
                  </div>
                  
                  {/* Reuse existing logic for these tabs or slightly enhance */}
                  {activeTab === 'notifications' && (
                    <div className="space-y-4">
                      {Object.entries(settings.notifications).filter(([k]) => typeof settings.notifications[k] === 'boolean').map(([key, val]) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-white border border-transparent hover:border-gray-100 transition-all">
                          <div>
                            <p className="font-bold text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                            <p className="text-xs text-gray-500">Control system-wide alerts for this event type</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={val}
                              onChange={(e) => updateNestedField('notifications', key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'billing' && (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Platform Currency</label>
                          <select
                            value={settings.billing.currency}
                            onChange={(e) => updateNestedField('billing', 'currency', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                          >
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="GBP">GBP - British Pound</option>
                            <option value="GHS">GHS - Ghana Cedi</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Default Tax Rate (%)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={settings.billing.taxRate}
                            onChange={(e) => updateNestedField('billing', 'taxRate', parseFloat(e.target.value))}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <RefreshCw className="w-5 h-5 text-emerald-600" />
                            <h3 className="font-bold text-emerald-900">Free Trial Management</h3>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.billing.enableTrials}
                              onChange={(e) => updateNestedField('billing', 'enableTrials', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                          </label>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-emerald-700">Default Trial Period (Days)</label>
                            <input
                              type="number"
                              disabled={!settings.billing.enableTrials}
                              value={settings.billing.trialDays}
                              onChange={(e) => updateNestedField('billing', 'trialDays', parseInt(e.target.value))}
                              className="w-full px-4 py-2 bg-white border border-emerald-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'database' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-6 bg-blue-50 border border-blue-200 rounded-2xl hover:shadow-md transition-all">
                          <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
                            <Database className="w-5 h-5" />
                            Platform Backup
                          </h3>
                          <p className="text-sm text-blue-700 mb-6">Create a full snapshot of the platform database.</p>
                          <button className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
                            Backup Now
                          </button>
                        </div>
                        <div className="p-6 bg-purple-50 border border-purple-200 rounded-2xl hover:shadow-md transition-all">
                          <h3 className="font-bold text-purple-900 flex items-center gap-2 mb-2">
                            <RefreshCw className="w-5 h-5" />
                            Optimize DB
                          </h3>
                          <p className="text-sm text-purple-700 mb-6">Clean up unused indexes and vacuum tables.</p>
                          <button className="w-full py-2.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors">
                            Run Optimization
                          </button>
                        </div>
                      </div>

                      <div className="mt-8 p-8 bg-rose-50 border border-rose-100 rounded-2xl">
                        <h3 className="font-black text-rose-900 text-lg mb-2 flex items-center gap-2 uppercase tracking-tight">
                          <AlertTriangle className="w-6 h-6" />
                          Critical Infrastructure Zone
                        </h3>
                        <p className="text-rose-700 mb-6 font-medium">These actions are irreversible and will affect all businesses on the platform.</p>
                        <div className="flex flex-wrap gap-4">
                          <button className="px-6 py-3 bg-rose-600 text-white font-black rounded-xl hover:bg-rose-700 shadow-lg shadow-rose-600/20 active:scale-95 transition-all uppercase text-xs tracking-widest">
                            Flush All Caches
                          </button>
                          <button className="px-6 py-3 bg-white border-2 border-rose-200 text-rose-600 font-black rounded-xl hover:bg-rose-50 transition-all uppercase text-xs tracking-widest">
                            Reset System Constants
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'security' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-5 bg-gray-50 border border-gray-100 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-white rounded-xl shadow-sm">
                            <Shield className="w-6 h-6 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">Enforce 2FA</p>
                            <p className="text-sm text-gray-500">Require Two-Factor Authentication for all super admin users</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.security.twoFactorAuth}
                            onChange={(e) => updateNestedField('security', 'twoFactorAuth', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <Monitor className="w-4 h-4" />
                            Session Timeout (mins)
                          </label>
                          <input
                            type="number"
                            value={settings.security.sessionTimeout}
                            onChange={(e) => updateNestedField('security', 'sessionTimeout', parseInt(e.target.value))}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <Key className="w-4 h-4" />
                            Password Expiry (days)
                          </label>
                          <input
                            type="number"
                            value={settings.security.passwordExpiry}
                            onChange={(e) => updateNestedField('security', 'passwordExpiry', parseInt(e.target.value))}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 rounded-b-2xl flex items-center justify-between">
              <p className="text-xs text-gray-500 font-medium">
                Last updated: April 25, 2026 at 14:45 UTC
              </p>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setActiveTab('general')}
                  className="text-sm font-bold text-gray-500 hover:text-emerald-600 transition-colors"
                >
                  Reset to Defaults
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
