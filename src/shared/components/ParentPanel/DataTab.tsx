import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSyncedStorage } from '../../hooks/useSyncedStorage';
import { useFamily } from '../../contexts/FamilyContext';
import type { Food } from '../../../apps/food-friends/foodDatabase';
import type { BathToy } from '../../../apps/bath-buddy/toyDatabase';
import type { TimerPreset } from '../../../apps/magic-timer/timerConfig';
import { defaultFoods } from '../../../apps/food-friends/foodDatabase';
import { defaultToys } from '../../../apps/bath-buddy/toyDatabase';
import { timerPresets as defaultTimerPresets } from '../../../apps/magic-timer/timerConfig';

export const DataTab: React.FC = () => {
  const [, setFoods] = useSyncedStorage<Food[]>('foods', defaultFoods);
  const [, setToys] = useSyncedStorage<BathToy[]>('bathToys', defaultToys);
  const [, setTimerPresets] = useSyncedStorage<TimerPreset[]>('timerPresets', defaultTimerPresets);

  const {
    familyCode,
    isConnected,
    isLoading,
    setFamilyCode,
    generateNewCode,
    disconnect,
  } = useFamily();

  const [connectCode, setConnectCode] = useState('');
  const [showConnectInput, setShowConnectInput] = useState(false);
  const [connectError, setConnectError] = useState('');

  const resetToDefaults = () => {
    if (!confirm('Reset ALL content to defaults? This cannot be undone!')) return;

    setFoods(defaultFoods);
    setToys(defaultToys);
    setTimerPresets(defaultTimerPresets);
  };

  const clearAllData = () => {
    if (!confirm('Clear ALL app data including stars, favorites, and progress? This cannot be undone!')) return;

    localStorage.clear();
    window.location.reload();
  };

  const handleEnableSync = async () => {
    await generateNewCode();
  };

  const handleConnect = async () => {
    if (connectCode.length !== 6) {
      setConnectError('Code must be 6 characters');
      return;
    }

    const success = await setFamilyCode(connectCode.toUpperCase());
    if (success) {
      setShowConnectInput(false);
      setConnectCode('');
      setConnectError('');
    } else {
      setConnectError('Failed to connect. Try again.');
    }
  };

  const handleDisconnect = () => {
    if (confirm('Disconnect from cloud sync? Your data will remain on this device but won\'t sync anymore.')) {
      disconnect();
    }
  };

  const copyToClipboard = () => {
    if (familyCode) {
      navigator.clipboard.writeText(familyCode);
    }
  };

  return (
    <motion.div
      key="data"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h3 className="text-2xl font-bold mb-4 text-gray-800">Data Management</h3>

      <div className="space-y-4">
        {/* Cloud Sync Section */}
        <div className="bg-purple-100 border-2 border-purple-400 rounded-2xl p-4">
          <h4 className="font-bold text-lg mb-2">Cloud Sync</h4>

          {isLoading ? (
            <div className="text-gray-600">
              <span className="animate-pulse">Connecting...</span>
            </div>
          ) : familyCode && isConnected ? (
            // Connected state
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-semibold">Synced</span>
                <span className="text-green-500">✓</span>
              </div>

              <div className="bg-white rounded-lg p-3">
                <div className="text-sm text-gray-500 mb-1">Family Code:</div>
                <div className="flex items-center gap-2">
                  <code className="text-2xl font-mono font-bold tracking-wider">{familyCode}</code>
                  <button
                    onClick={copyToClipboard}
                    className="text-purple-600 hover:text-purple-800 p-1"
                    title="Copy code"
                  >
                    📋
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Use this code on another device to sync your data
                </p>
              </div>

              <button
                onClick={handleDisconnect}
                className="w-full bg-gray-500 text-white py-2 rounded-lg font-semibold hover:bg-gray-600"
              >
                Disconnect
              </button>
            </div>
          ) : (
            // Not connected state
            <div className="space-y-3">
              <p className="text-sm text-gray-700">
                Enable sync to share your settings across devices.
              </p>

              <button
                onClick={handleEnableSync}
                className="w-full bg-purple-500 text-white py-3 rounded-lg font-bold hover:bg-purple-600"
              >
                Enable Sync
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-purple-100 text-gray-500">or</span>
                </div>
              </div>

              {!showConnectInput ? (
                <button
                  onClick={() => setShowConnectInput(true)}
                  className="w-full text-purple-600 py-2 font-semibold hover:text-purple-800"
                >
                  Have a family code? Connect here
                </button>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={connectCode}
                    onChange={(e) => setConnectCode(e.target.value.toUpperCase().slice(0, 6))}
                    placeholder="Enter 6-letter code"
                    className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg text-center font-mono text-xl tracking-widest uppercase"
                    maxLength={6}
                  />
                  {connectError && (
                    <p className="text-red-500 text-sm">{connectError}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={handleConnect}
                      className="flex-1 bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600"
                    >
                      Connect
                    </button>
                    <button
                      onClick={() => {
                        setShowConnectInput(false);
                        setConnectCode('');
                        setConnectError('');
                      }}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="bg-yellow-100 border-2 border-yellow-400 rounded-2xl p-4">
          <h4 className="font-bold text-lg mb-2">Warning: Danger Zone</h4>
          <p className="text-gray-700 mb-4">
            These actions cannot be undone. Please be careful!
          </p>
        </div>

        <button
          onClick={resetToDefaults}
          className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600"
        >
          Reset All Content to Defaults
        </button>

        <button
          onClick={clearAllData}
          className="w-full bg-red-500 text-white py-3 rounded-lg font-bold hover:bg-red-600"
        >
          Clear ALL Data (Stars, Favorites, Progress, etc.)
        </button>

        <div className="bg-blue-100 border-2 border-blue-400 rounded-2xl p-4 mt-6">
          <h4 className="font-bold text-lg mb-2">Storage Info</h4>
          <p className="text-sm text-gray-700">
            {familyCode && isConnected
              ? 'Your data syncs to the cloud and is available on all connected devices.'
              : 'All data is stored locally in your browser. Enable sync to share across devices.'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
