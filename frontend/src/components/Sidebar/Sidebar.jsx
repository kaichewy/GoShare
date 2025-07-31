// Import with import Sidebar from '@/components/Sidebar/Sidebar';
import React from 'react';
import { Package, Truck, Activity, HelpCircle, Home, ShoppingCart, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'orders', label: 'Orders', icon: Package, path: '/orders' },
    { id: 'delivery', label: 'Delivery', icon: Truck, path: '/delivery' },
    { id: 'cart', label: 'Cart', icon: ShoppingCart, path: '/cart' },
    { id: 'status', label: 'Status', icon: Activity, path: '/status' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
    { id: 'help', label: 'Help', icon: HelpCircle, path: '/help' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed left-0 top-0 h-full w-72 bg-white border-r border-gray-200 shadow-xl z-20">
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-100">
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group mb-2 ${
                  active
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;