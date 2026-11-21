import React from 'react';

export default function BusinessUsers({ users }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
            <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700">Export List</button>
        </div>
        <table className="w-full">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Last Active</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                    <div className="text-xs text-gray-500">{user.email}</div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{user.role}</td>
                        <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${user.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
                                {user.status}
                            </span>
                        </td>
                         <td className="px-6 py-4 text-right text-sm text-gray-500">{user.lastActive}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );
}
