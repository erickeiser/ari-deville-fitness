import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCMS } from '../../contexts/CMSContext';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Settings,
  Image,
  Star,
  FileText,
  LogOut,
  Menu,
  X,
  Bell,
  User,
  UserCheck,
  Wifi,
  WifiOff,
  Database,
  AlertCircle,
  Crown,
  Shield
} from 'lucide-react';

const AdminLayout = () => {
  const { user, logout, authMode } = useAuth();
  const { isOnline, contactMessages, intakeSubmissions } = useCMS();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Calculate dynamic counts for notifications
  const unreadMessages = contactMessages.filter(m => m.status === 'new').length;
  const newIntakes = intakeSubmissions.filter(s => s.status === 'new').length;
  const totalNotifications = unreadMessages + newIntakes;

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Services', href: '/admin/services', icon: FileText },
    { name: 'Testimonials', href: '/admin/testimonials', icon: Star },
    { name: 'Media Library', href: '/admin/media', icon: Image },
    { name: 'User Management', href: '/admin/users', icon: UserCheck },
    { 
      name: 'Intake Forms', 
      href: '/admin/intake', 
      icon: Users,
      badge: newIntakes > 0 ? newIntakes : undefined
    },
    { 
      name: 'Messages', 
      href: '/admin/messages', 
      icon: MessageSquare,
      badge: unreadMessages > 0 ? unreadMessages : undefined
    },
    { name: 'Site Content', href: '/admin/content', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-astros-orange" />;
      case 'trainer':
        return <Shield className="w-4 h-4 text-blue-600" />;
      default:
        return <User className="w-4 h-4 text-slate-600" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (role) {
      case 'admin':
        return `${baseClasses} bg-astros-orange/10 text-astros-orange`;
      case 'trainer':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-slate-100 text-slate-800`;
    }
  };

  const formatLastLogin = (lastLoginAt?: string) => {
    if (!lastLoginAt) return 'First login';
    const date = new Date(lastLoginAt);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-slate-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
          <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-astros-orange rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-lg font-semibold text-astros-navy">Ari Deville Admin</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-astros-orange/10 text-astros-orange'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </div>
                  {item.badge && (
                    <span className="bg-astros-orange text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-slate-200">
          <div className="flex h-16 items-center px-4 border-b border-slate-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-astros-orange rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-lg font-semibold text-astros-navy">Ari Deville Admin</span>
            </div>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-astros-orange/10 text-astros-orange'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </div>
                  {item.badge && (
                    <span className="bg-astros-orange text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          
          {/* User Profile Section */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center mb-3">
              <img
                src={user?.avatar || 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=400'}
                alt={user?.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-slate-200"
              />
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <div className="text-sm font-medium text-astros-navy truncate">{user?.name}</div>
                  {getRoleIcon(user?.role || 'user')}
                </div>
                <div className="text-xs text-slate-500 truncate">{user?.email}</div>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={getRoleBadge(user?.role || 'user')}>
                    {user?.role?.charAt(0).toUpperCase()}{user?.role?.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* User Stats */}
            <div className="bg-slate-50 rounded-lg p-3 mb-3 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Last login:</span>
                <span className="text-slate-900 font-medium">{formatLastLogin(user?.lastLoginAt)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Mode:</span>
                <span className={`font-medium ${authMode === 'supabase' ? 'text-green-600' : 'text-blue-600'}`}>
                  {authMode === 'supabase' ? 'Production' : 'Demo'}
                </span>
              </div>
              {user?.createdAt && (
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Member since:</span>
                  <span className="text-slate-900 font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 bg-white border-b border-slate-200 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-4 text-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-astros-orange lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex flex-1 justify-between px-4 lg:px-6">
            <div className="flex flex-1 items-center">
              <h1 className="text-lg font-semibold text-astros-navy">
                {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                {isOnline ? (
                  <div className="flex items-center text-green-600">
                    <Database className="w-4 h-4 mr-1" />
                    <span className="text-xs font-medium">Connected</span>
                  </div>
                ) : (
                  <div className="flex items-center text-amber-600">
                    <WifiOff className="w-4 h-4 mr-1" />
                    <span className="text-xs font-medium">Local Only</span>
                  </div>
                )}
              </div>
              
              {/* Notifications */}
              <div className="relative">
                <button className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors">
                  <Bell className="w-5 h-5" />
                  {totalNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-astros-orange text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {totalNotifications}
                    </span>
                  )}
                </button>
              </div>
              
              {/* User Avatar */}
              <div className="flex items-center space-x-3">
                <img
                  src={user?.avatar || 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-slate-200"
                />
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-astros-navy">{user?.name}</div>
                  <div className="text-xs text-slate-500">{user?.role}</div>
                </div>
              </div>
              
              <Link to="/" className="text-sm text-astros-orange hover:text-astros-orange-dark font-medium">
                View Site
              </Link>
            </div>
          </div>
        </div>

        {/* Connection Status Banner */}
        {!isOnline && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-amber-600 mr-3" />
              <div className="text-sm text-amber-800">
                <strong>Database Not Connected:</strong> You need to set up Supabase to sync data across devices and enable production features.
                <a 
                  href="https://supabase.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-2 underline hover:no-underline"
                >
                  Get started with Supabase →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Demo Mode Banner */}
        {authMode === 'demo' && (
          <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-blue-600 mr-3" />
              <div className="text-sm text-blue-800">
                <strong>Demo Mode:</strong> You're using local storage. Set up Supabase for production features and data persistence.
              </div>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;