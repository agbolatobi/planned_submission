import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User, UserContextType } from '../typings';

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'memory_lane_user';

export function UserProvider({ children }: { children: ReactNode }) {
  // Initialize state from sessionStorage if it exists
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = sessionStorage.getItem(STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Update sessionStorage whenever user changes
  useEffect(() => {
    if (user) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 