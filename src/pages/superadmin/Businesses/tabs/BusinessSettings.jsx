import React from 'react';
import { Shield, Save } from 'lucide-react';

export default function BusinessSettings({ settings, setSettings, handleAction, businessStatus }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-400" />
            Superadmin Overrides
        </h2>
        
        <div className="space-y-8 max-w-3xl">
            {/* General Settings */}
            <div className="space-y-4">
               <h3 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-2">General Controls</h3>
               
               <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                      <h3 className="text-sm font-medium text-gray-900">Verified Business</h3>
                      <p className="text-sm text-gray-500">Mark this business as manually verified</p>
                  </div>
                  <button 
                    onClick={() => setSettings(prev => ({ ...prev, verifiedStatus: !prev.verifiedStatus }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.verifiedStatus ? 'bg-emerald-500' : 'bg-gray-200'}`}
                  >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.verifiedStatus ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
              </div>

               <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                      <h3 className="text-sm font-medium text-gray-900">Maintenance Mode</h3>
                      <p className="text-sm text-gray-500">Temporarily disable access for maintenance</p>
                  </div>
                  <button 
                    onClick={() => setSettings(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.maintenanceMode ? 'bg-emerald-600' : 'bg-gray-200'}`}
                  >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
              </div>
            </div>
            
            {/* Feature Access */}
             <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-2">Feature Access</h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                        <h3 className="text-sm font-medium text-gray-900">Beta Features Access</h3>
                        <p className="text-sm text-gray-500">Allow this business to access unreleased features</p>
                    </div>
                    <button 
                      onClick={() => setSettings(prev => ({ ...prev, betaFeatures: !prev.betaFeatures }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.betaFeatures ? 'bg-emerald-600' : 'bg-gray-200'}`}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.betaFeatures ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
    

             </div>

            <div className="flex justify-end pt-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">
                    <Save className="w-4 h-4" /> Save Changes
                </button>
            </div>


            {/* Danger Zone */}
            <div className="border border-red-200 rounded-lg overflow-hidden">
                <div className="bg-red-50 px-6 py-4 border-b border-red-100">
                    <h3 className="text-base font-semibold text-red-800">Danger Zone</h3>
                    <p className="text-sm text-red-600 mt-1">Irreversible actions for this business account.</p>
                </div>
                <div className="p-6 bg-white space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-medium text-gray-900">Suspend Business</h4>
                            <p className="text-sm text-gray-500">Temporarily block access. Data is preserved.</p>
                        </div>
                        <button 
                           onClick={() => handleAction('suspend')}
                           className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:text-red-600 hover:border-red-300 transition-colors"
                        >
                            {businessStatus === 'suspended' ? 'Activate' : 'Suspend'}
                        </button>
                    </div>
                    <hr className="border-gray-100" />
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-medium text-gray-900">Delete Business</h4>
                            <p className="text-sm text-gray-500">Permanently remove all data. This cannot be undone.</p>
                        </div>
                        <button 
                           onClick={() => handleAction('delete')}
                           className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Delete Business
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
