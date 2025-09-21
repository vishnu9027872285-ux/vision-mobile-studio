import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface NagrikDB extends DBSchema {
  reports: {
    key: string;
    value: {
      id: string;
      title: string;
      description: string;
      category: string;
      location: { lat: number; lng: number };
      address: string;
      photos: string[];
      voiceNote?: string;
      status: 'draft' | 'pending_sync';
      createdAt: string;
      updatedAt: string;
    };
    indexes: {
      'by_status': string;
      'by_category': string;
      'by_created_at': string;
    };
  };
  settings: {
    key: string;
    value: any;
  };
}

let db: IDBPDatabase<NagrikDB>;

export const initDB = async () => {
  db = await openDB<NagrikDB>('nagrik-db', 1, {
    upgrade(db) {
      // Reports store for offline functionality
      if (!db.objectStoreNames.contains('reports')) {
        const reportStore = db.createObjectStore('reports', { keyPath: 'id' });
        reportStore.createIndex('by_status', 'status');
        reportStore.createIndex('by_category', 'category');
        reportStore.createIndex('by_created_at', 'createdAt');
      }

      // Settings store for user preferences
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    },
  });
  return db;
};

export const saveReportOffline = async (report: NagrikDB['reports']['value']) => {
  if (!db) await initDB();
  await db.put('reports', { ...report, status: 'pending_sync' });
};

export const getOfflineReports = async () => {
  if (!db) await initDB();
  return db.getAll('reports');
};

export const deleteOfflineReport = async (id: string) => {
  if (!db) await initDB();
  await db.delete('reports', id);
};

export const saveSetting = async (key: string, value: any) => {
  if (!db) await initDB();
  await db.put('settings', { key, value });
};

export const getSetting = async (key: string) => {
  if (!db) await initDB();
  const result = await db.get('settings', key);
  return result?.value;
};

export const syncReports = async () => {
  if (!db) await initDB();
  const pendingReports = await db.getAllFromIndex('reports', 'by_status', 'pending_sync');
  
  // Here you would typically sync with your backend
  for (const report of pendingReports) {
    try {
      // Simulate API call
      console.log('Syncing report:', report.id);
      await deleteOfflineReport(report.id);
    } catch (error) {
      console.error('Failed to sync report:', report.id, error);
    }
  }
  
  return pendingReports.length;
};