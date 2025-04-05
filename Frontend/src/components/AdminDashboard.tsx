import React from 'react';
import { Users, FileText, Activity, TrendingUp } from 'lucide-react';
import useStore from '../store/useStore';

const AdminDashboard: React.FC = () => {
  const { users, scanResults, documents, getTopUsers } = useStore();
  const topUsers = getTopUsers();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-500" />
            <h3 className="ml-2 text-lg font-semibold">Total Users</h3>
          </div>
          <p className="mt-2 text-3xl font-bold">{users.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-green-500" />
            <h3 className="ml-2 text-lg font-semibold">Total Documents</h3>
          </div>
          <p className="mt-2 text-3xl font-bold">{documents.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-purple-500" />
            <h3 className="ml-2 text-lg font-semibold">Total Scans</h3>
          </div>
          <p className="mt-2 text-3xl font-bold">{scanResults.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-orange-500" />
            <h3 className="ml-2 text-lg font-semibold">Active Users Today</h3>
          </div>
          <p className="mt-2 text-3xl font-bold">
            {users.filter(u => u.scansToday > 0).length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Top Users</h2>
          <div className="space-y-4">
            {topUsers.map((user, index) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-bold text-gray-500">#{index + 1}</span>
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-gray-500">Total Scans: {user.totalScans}</p>
                  </div>
                </div>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={() => useStore.getState().updateUserCredits(user.id, user.credits + 10)}
                >
                  Add Credits
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Scans</h2>
          <div className="space-y-4">
            {scanResults.slice(-5).map((result, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {result.document1} ↔ {result.document2}
                    </p>
                    <p className="text-sm text-gray-500">
                      Method: {result.method} | Similarity: {(result.similarity * 100).toFixed(2)}%
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(result.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;