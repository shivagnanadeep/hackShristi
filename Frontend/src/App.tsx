import { useState } from 'react';
import { FileText, Settings, LogOut } from 'lucide-react';
import useStore from './store/useStore';
import DocumentList from './components/DocumentList';
import Scanner from './components/Scanner';
import AdminDashboard from './components/AdminDashboard';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';

function App() {
  const { isAuthenticated, currentUser, logout } = useStore();
  const [showLogin, setShowLogin] = useState(true);

  if (!isAuthenticated) {
    return showLogin ? (
      <LoginForm onToggleForm={() => setShowLogin(false)} />
    ) : (
      <RegisterForm onToggleForm={() => setShowLogin(true)} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold">DocScanner</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Credits: {currentUser?.credits} | Scans today: {currentUser?.scansToday}/20
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-gray-700 mr-4">{currentUser?.email}</span>
                <button
                  onClick={logout}
                  className="ml-4 flex items-center text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentUser?.role === 'admin' ? (
          <AdminDashboard />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <Scanner />
            </div>
            <DocumentList />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;