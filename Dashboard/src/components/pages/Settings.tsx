import React from 'react';
import { Bell, Lock, Eye, Globe, Moon } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

      {/* Account Settings */}
      <div className="bg-gray-900 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-white mb-4">Account Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center">
              <Lock className="w-5 h-5 text-blue-400 mr-3" />
              <div>
                <p className="text-white font-medium">Password</p>
                <p className="text-sm text-gray-400">Change your password</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-900 transition-colors">
              Update
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center">
              <Bell className="w-5 h-5 text-blue-400 mr-3" />
              <div>
                <p className="text-white font-medium">Notifications</p>
                <p className="text-sm text-gray-400">Manage notification preferences</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-gray-900 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-white mb-4">Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center">
              <Moon className="w-5 h-5 text-blue-400 mr-3" />
              <div>
                <p className="text-white font-medium">Dark Mode</p>
                <p className="text-sm text-gray-400">Toggle dark/light theme</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center">
              <Globe className="w-5 h-5 text-blue-400 mr-3" />
              <div>
                <p className="text-white font-medium">Language</p>
                <p className="text-sm text-gray-400">Select your preferred language</p>
              </div>
            </div>
            <select className="bg-gray-900 text-white rounded-lg p-2 border border-gray-600">
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center">
              <Eye className="w-5 h-5 text-blue-400 mr-3" />
              <div>
                <p className="text-white font-medium">Display Density</p>
                <p className="text-sm text-gray-400">Adjust the display density</p>
              </div>
            </div>
            <select className="bg-gray-900 text-white rounded-lg p-2 border border-gray-600">
              <option value="comfortable">Comfortable</option>
              <option value="compact">Compact</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="bg-gray-900 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-white mb-4">Data & Privacy</h2>
        <div className="space-y-4">
          <div className="p-4 bg-gray-800 rounded-lg">
            <p className="text-white font-medium mb-2">Data Export</p>
            <p className="text-sm text-gray-400 mb-4">Download a copy of your data</p>
            <button className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-900 transition-colors">
              Export Data
            </button>
          </div>

          <div className="p-4 bg-gray-800 rounded-lg">
            <p className="text-white font-medium mb-2">Account Deletion</p>
            <p className="text-sm text-gray-400 mb-4">Permanently delete your account and all data</p>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;