import React from 'react';

export default function BusinessStats({ businesses }) {
  // Defensive check to ensure businesses is an array
  const businessList = Array.isArray(businesses) ? businesses : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg border border-gray-100 p-4">
        <p className="text-sm text-gray-600">Total Businesses</p>
        <p className="text-2xl font-bold text-gray-900">{businessList.length}</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-100 p-4">
        <p className="text-sm text-gray-600">Active</p>
        <p className="text-2xl font-bold text-emerald-600">
          {businessList.filter(b => b.status === 'active').length}
        </p>
      </div>
      <div className="bg-white rounded-lg border border-gray-100 p-4">
        <p className="text-sm text-gray-600">On Trial</p>
        <p className="text-2xl font-bold text-blue-600">
          {businessList.filter(b => b.status === 'trial').length}
        </p>
      </div>
      <div className="bg-white rounded-lg border border-gray-100 p-4">
        <p className="text-sm text-gray-600">Suspended</p>
        <p className="text-2xl font-bold text-amber-600">
          {businessList.filter(b => b.status === 'suspended').length}
        </p>
      </div>
    </div>
  );
}
