import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import StatusView from '@/components/StatusView/StatusView';

export default function ProfileView() {
  // start on “status” tab by default
  const [activeView, setActiveView] = useState('status');

  // Decide what to render in the right pane
  let content;
  switch (activeView) {
    case 'status':
      content = <StatusView />;
      break;
    // you can add more cases here if you later add OrdersView, HelpView, etc.
    default:
      content = <StatusView />;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar is fixed width */}
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      {/* Main content sits to the right of the 16rem sidebar */}
      <main className="ml-64 flex-grow p-6 bg-gray-50">
        {content}
      </main>
    </div>
  );
}
