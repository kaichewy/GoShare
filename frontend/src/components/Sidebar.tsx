
import { Package, Truck, Activity, HelpCircle } from 'lucide-react';
import React from 'react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const Sidebar = ({ activeView, setActiveView }: SidebarProps) => {
  const navItems = [
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'delivery', label: 'Delivery', icon: Truck },
    { id: 'status', label: 'Status', icon: Activity },
    { id: 'help', label: 'Help', icon: HelpCircle },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white/80 backdrop-blur-sm border-r border-blue-100 shadow-lg z-10">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;