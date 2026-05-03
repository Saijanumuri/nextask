import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db, type User } from '../db/db';

interface AuthStore {
  currentUser: User | null;
  isAuthenticated: boolean;
  
  generatePasskey: () => string;
  register: (name: string, dob: string) => Promise<string>;
  login: (passkey: string) => Promise<boolean>;
  logout: () => void;
  updateLastLogin: () => Promise<void>;
}

const generateRandomPasskey = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,
      
      generatePasskey: () => {
        return generateRandomPasskey();
      },
      
      register: async (name: string, dob: string) => {
        let passkey = generateRandomPasskey();
        
        // Check if passkey exists on backend
        let isUnique = false;
        let attempts = 0;
        
        while (!isUnique && attempts < 10) {
          try {
            const response = await fetch(`${API_URL}/api/auth/check-passkey`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ passkey }),
            });
            
            const data = await response.json();
            
            if (!data.exists) {
              isUnique = true;
            } else {
              passkey = generateRandomPasskey();
              attempts++;
            }
          } catch (error) {
            console.warn('Could not check passkey uniqueness, using local check:', error);
            // Fallback to local check
            const existingUser = await db.users.where('passkey').equals(passkey).first();
            if (!existingUser) {
              isUnique = true;
            } else {
              passkey = generateRandomPasskey();
              attempts++;
            }
          }
        }
        
        // Register on backend
        try {
          const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, dob, passkey }),
          });
          
          const data = await response.json();
          
          if (!data.success) {
            throw new Error(data.error || 'Registration failed');
          }
          
          console.log('✅ User registered on backend');
        } catch (error) {
          console.warn('⚠️ Backend registration failed, saving locally only:', error);
        }
        
        // Also save to local IndexedDB for offline access
        const newUser: Omit<User, 'id'> = {
          passkey,
          name,
          dob,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };
        
        await db.users.add(newUser);
        
        return passkey;
      },
      
      login: async (passkey: string) => {
        try {
          // Try backend authentication first
          const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ passkey }),
          });
          
          const data = await response.json();
          
          if (data.success && data.user) {
            // Backend authentication successful
            console.log('✅ Authenticated via backend');
            
            // Sync user to local IndexedDB
            const localUser = await db.users.where('passkey').equals(passkey).first();
            
            if (localUser) {
              // Update existing local user
              await db.users.update(localUser.id!, {
                name: data.user.name,
                dob: data.user.dob,
                lastLogin: new Date().toISOString(),
              });
              
              const updatedUser = await db.users.get(localUser.id!);
              set({ currentUser: updatedUser || null, isAuthenticated: true });
            } else {
              // Add user to local IndexedDB
              const newUser: Omit<User, 'id'> = {
                passkey: data.user.passkey,
                name: data.user.name,
                dob: data.user.dob,
                createdAt: data.user.createdAt,
                lastLogin: new Date().toISOString(),
              };
              
              const id = await db.users.add(newUser);
              const addedUser = await db.users.get(id);
              set({ currentUser: addedUser || null, isAuthenticated: true });
            }
            
            return true;
          } else {
            console.log('❌ Backend authentication failed:', data.error);
            return false;
          }
        } catch (error) {
          console.warn('⚠️ Backend unavailable, trying local authentication:', error);
          
          // Fallback to local IndexedDB authentication
          const user = await db.users.where('passkey').equals(passkey).first();
          
          if (user) {
            await db.users.update(user.id!, {
              lastLogin: new Date().toISOString(),
            });
            
            const updatedUser = await db.users.get(user.id!);
            set({ currentUser: updatedUser || user, isAuthenticated: true });
            
            console.log('✅ Authenticated via local storage (offline mode)');
            return true;
          }
          
          return false;
        }
      },
      
      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
      },
      
      updateLastLogin: async () => {
        const { currentUser } = get();
        if (currentUser?.id) {
          await db.users.update(currentUser.id, {
            lastLogin: new Date().toISOString(),
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
