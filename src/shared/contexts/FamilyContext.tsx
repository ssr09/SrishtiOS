import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

interface FamilyData {
  theme?: string;
  archivedApps?: string[];
  appLastUsed?: Record<string, number>;
  foods?: unknown[];
  bathToys?: unknown[];
  timerPresets?: unknown[];
  timerMuted?: boolean;
  starRewards?: unknown;
  completedRoutines?: unknown;
  updatedAt?: number;
}

interface FamilyContextType {
  familyCode: string | null;
  isConnected: boolean;
  isLoading: boolean;
  familyData: FamilyData;
  setFamilyCode: (code: string) => Promise<boolean>;
  generateNewCode: () => Promise<string>;
  updateFamilyData: (key: keyof FamilyData, value: unknown) => Promise<void>;
  disconnect: () => void;
}

const FamilyContext = createContext<FamilyContextType | null>(null);

// Generate a random 6-character code
function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars like 0,O,1,I
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export const FamilyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [familyCode, setFamilyCodeState] = useState<string | null>(() => {
    return localStorage.getItem('srishti-family-code');
  });
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [familyData, setFamilyData] = useState<FamilyData>({});

  // Listen to Firestore changes when we have a family code
  useEffect(() => {
    if (!familyCode) {
      setIsLoading(false);
      setIsConnected(false);
      return;
    }

    setIsLoading(true);
    const docRef = doc(db, 'families', familyCode);

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setFamilyData(docSnap.data() as FamilyData);
          setIsConnected(true);
        } else {
          // Document doesn't exist yet, create it
          setDoc(docRef, { createdAt: Date.now(), updatedAt: Date.now() });
        }
        setIsLoading(false);
      },
      (error) => {
        console.error('Firestore listener error:', error);
        setIsConnected(false);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [familyCode]);

  // Set family code (for connecting to existing family)
  const setFamilyCode = useCallback(async (code: string): Promise<boolean> => {
    const normalizedCode = code.toUpperCase().trim();

    try {
      const docRef = doc(db, 'families', normalizedCode);
      const docSnap = await getDoc(docRef);

      // Code exists or we can create it
      localStorage.setItem('srishti-family-code', normalizedCode);
      setFamilyCodeState(normalizedCode);

      if (!docSnap.exists()) {
        // Create the document if it doesn't exist
        await setDoc(docRef, { createdAt: Date.now(), updatedAt: Date.now() });
      }

      return true;
    } catch (error) {
      console.error('Error setting family code:', error);
      return false;
    }
  }, []);

  // Generate a new family code
  const generateNewCode = useCallback(async (): Promise<string> => {
    let code = generateCode();
    let attempts = 0;

    // Make sure the code doesn't already exist
    while (attempts < 10) {
      const docRef = doc(db, 'families', code);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        break;
      }
      code = generateCode();
      attempts++;
    }

    // Save and set the new code
    localStorage.setItem('srishti-family-code', code);
    setFamilyCodeState(code);

    // Create the document
    const docRef = doc(db, 'families', code);
    await setDoc(docRef, { createdAt: Date.now(), updatedAt: Date.now() });

    return code;
  }, []);

  // Update a specific key in family data
  const updateFamilyData = useCallback(async (key: keyof FamilyData, value: unknown): Promise<void> => {
    if (!familyCode) return;

    try {
      const docRef = doc(db, 'families', familyCode);
      await setDoc(docRef, {
        [key]: value,
        updatedAt: Date.now()
      }, { merge: true });
    } catch (error) {
      console.error('Error updating family data:', error);
    }
  }, [familyCode]);

  // Disconnect from family (local only, doesn't delete cloud data)
  const disconnect = useCallback(() => {
    localStorage.removeItem('srishti-family-code');
    setFamilyCodeState(null);
    setFamilyData({});
    setIsConnected(false);
  }, []);

  return (
    <FamilyContext.Provider value={{
      familyCode,
      isConnected,
      isLoading,
      familyData,
      setFamilyCode,
      generateNewCode,
      updateFamilyData,
      disconnect,
    }}>
      {children}
    </FamilyContext.Provider>
  );
};

export function useFamily(): FamilyContextType {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
}
