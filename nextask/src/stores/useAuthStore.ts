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
        
        // Ensure passkey is unique
        let existingUser = await db.users.where('passkey').equals(passkey).first();
        while (existingUser) {
          passkey = generateRandomPasskey();
          existingUser = await db.users.where('passkey').equals(passkey).first();
        }
        
        const newUser: Omit<User, 'id'> = {
          passkey,
          name,
          dob,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };
        
        await db.users.add(newUser);
        
        // Don't auto-login, return passkey to show to user
        return passkey;
      },
      
      login: async (passkey: string) => {
        const user = await db.users.where('passkey').equals(passkey).first();
        
        if (user) {
          // Update last login
          await db.users.update(user.id!, {
            lastLogin: new Date().toISOString(),
          });
          
          const updatedUser = await db.users.get(user.id!);
          set({ currentUser: updatedUser || user, isAuthenticated: true });
          
          // Send login data to server
          try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            await fetch(`${apiUrl}/api/save-user-data`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                passkey: user.passkey,
                name: user.name,
                dob: user.dob,
                createdAt: user.createdAt,
                lastLogin: new Date().toISOString(),
              }),
            });
          } catch (error) {
            console.warn('Could not save to admin file:', error);
          }
          
          return true;
        }
        
        return false;
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
