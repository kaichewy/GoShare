// Import with '@/components/StatusView';
import React from 'react';
import { TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const StatusView = () => {
  const stats = [
    { label: 'Total Orders Today',    value: 47,      icon: CheckCircle,   color: 'green'  },
    { label: 'Orders in Progress',     value: 12,      icon: Clock,         color: 'blue'   },
    { label: 'Pending Orders',         value: 5,       icon: AlertCircle,   color: 'orange' },
    { label: 'Revenue Today',          value: '$1,245', icon: TrendingUp,    color: 'purple' }
  ];

  const colorClasses = {
    green:  'bg-green-100 text-green-600',
    blue:   'bg-blue-100  text-blue-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">User Status</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${colorClasses[stat.color]}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">GoShare System Health</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Order Processing</span>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-600">Operational</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Payment Gateway</span>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-600">Operational</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Delivery Network</span>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm font-medium text-yellow-600">Minor Issues</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusView;
