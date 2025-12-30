import React from 'react';
import { motion } from 'framer-motion';
import { useSyncedStorage } from '../../hooks/useSyncedStorage';
import { apps } from '../../../HomePage';

export const AppsTab: React.FC = () => {
  const [archivedApps, setArchivedApps] = useSyncedStorage<string[]>('archivedApps', []);
  const [appLastUsed] = useSyncedStorage<Record<string, number>>('appLastUsed', {});

  const toggleArchive = (appId: string) => {
    if (archivedApps.includes(appId)) {
      setArchivedApps(archivedApps.filter(id => id !== appId));
    } else {
      setArchivedApps([...archivedApps, appId]);
    }
  };

  const formatLastUsed = (timestamp: number | undefined) => {
    if (!timestamp) return 'Never used';
    const days = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Used today';
    if (days === 1) return 'Used yesterday';
    if (days < 7) return `Used ${days} days ago`;
    if (days < 30) return `Used ${Math.floor(days / 7)} weeks ago`;
    return `Used ${Math.floor(days / 30)} months ago`;
  };

  // Sort apps: active first, then archived (both sorted by last used)
  const sortedApps = [...apps].sort((a, b) => {
    const aArchived = archivedApps.includes(a.id);
    const bArchived = archivedApps.includes(b.id);
    if (aArchived !== bArchived) return aArchived ? 1 : -1;
    const aTime = appLastUsed[a.id] || 0;
    const bTime = appLastUsed[b.id] || 0;
    return bTime - aTime;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h3 className="text-xl font-bold text-gray-700 mb-4">Manage Apps</h3>
      <p className="text-gray-600 mb-6">
        Toggle apps to show or hide them from the home screen. Hidden apps appear in the "More Apps" section.
      </p>

      <div className="space-y-3">
        {sortedApps.map(app => {
          const isArchived = archivedApps.includes(app.id);
          const lastUsed = appLastUsed[app.id];

          return (
            <div
              key={app.id}
              className={`
                flex items-center justify-between p-4 rounded-2xl border-2 transition-all
                ${isArchived
                  ? 'bg-gray-50 border-gray-200 opacity-60'
                  : 'bg-white border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{app.emoji}</span>
                <div>
                  <div className={`font-bold text-lg ${isArchived ? 'text-gray-500' : 'text-gray-800'}`}>
                    {app.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatLastUsed(lastUsed)}
                  </div>
                </div>
              </div>

              <button
                onClick={() => toggleArchive(app.id)}
                className={`
                  px-4 py-2 rounded-xl font-semibold text-sm transition-all
                  ${isArchived
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                {isArchived ? '👁️ Show' : '📁 Hide'}
              </button>
            </div>
          );
        })}
      </div>

      {archivedApps.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <p className="text-blue-700 text-sm">
            <strong>{archivedApps.length} app{archivedApps.length > 1 ? 's' : ''}</strong> hidden.
            They'll appear in the "More Apps" section on the home screen.
          </p>
        </div>
      )}
    </motion.div>
  );
};
