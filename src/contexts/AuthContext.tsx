import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  addUser: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLoginAt'>) => void;
  updateUser: (id: string, userData: Partial<User>) => void;
  deleteUser: (id: string) => void;
  isLoading: boolean;
  authMode: 'supabase' | 'demo';
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'trainer' | 'user';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authMode, setAuthMode] = useState<'supabase' | 'demo'>('demo');

  useEffect(() => {
    loadInitialData();
    
    // Set up Supabase auth state listener if configured
    if (isSupabaseConfigured()) {
      const { data: { subscription } } = supabase!.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            // Map Supabase user to our User interface
            const mappedUser: User = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || session.user.email || '',
              role: session.user.user_metadata?.role || 'admin',
              avatar: session.user.user_metadata?.avatar,
              active: true,
              createdAt: session.user.created_at,
              updatedAt: new Date().toISOString(),
              lastLoginAt: new Date().toISOString()
            };
            setUser(mappedUser);
            setAuthMode('supabase');
          } else if (authMode === 'supabase') {
            setUser(null);
          }
          setIsLoading(false);
        }
      );

      return () => subscription.unsubscribe();
    } else {
      setIsLoading(false);
    }
  }, [authMode]);

  const loadInitialData = async () => {
    // Check for existing Supabase session
    if (isSupabaseConfigured()) {
      try {
        const { data: { session } } = await supabase!.auth.getSession();
        if (session?.user) {
          const mappedUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email || '',
            role: session.user.user_metadata?.role || 'admin',
            avatar: session.user.user_metadata?.avatar,
            active: true,
            createdAt: session.user.created_at,
            updatedAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString()
          };
          setUser(mappedUser);
          setAuthMode('supabase');
        }
      } catch (error) {
        console.error('Error getting session:', error);
      }
    }

    // Check localStorage for demo mode
    if (!user) {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');
      
      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
          setAuthMode('demo');
        } catch (error) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
        }
      }
    }

    // Load users from localStorage for user management
    const storedUsers = localStorage.getItem('app_users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      // Initialize with default admin user
      const defaultUsers: User[] = [
        {
          id: '1',
          email: 'ari@aridevillefitness.com',
          name: 'Ari Deville',
          role: 'admin',
          avatar: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=400',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          active: true
        }
      ];
      setUsers(defaultUsers);
      localStorage.setItem('app_users', JSON.stringify(defaultUsers));
    }
  };

  const loginWithLocalStorage = (email: string, password: string): boolean => {
    const foundUser = users.find(u => u.email === email && u.active);
    
    const validCredentials = (
      (email === 'ari@aridevillefitness.com' && password === 'admin123') ||
      (foundUser && password === 'password123')
    );

    if (validCredentials && foundUser) {
      const updatedUser = {
        ...foundUser,
        lastLoginAt: new Date().toISOString()
      };
      
      setUser(updatedUser);
      setAuthMode('demo');
      localStorage.setItem('auth_token', `token_${foundUser.id}`);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      
      const updatedUsers = users.map(u => 
        u.id === foundUser.id ? updatedUser : u
      );
      setUsers(updatedUsers);
      localStorage.setItem('app_users', JSON.stringify(updatedUsers));
      
      return true;
    }
    return false;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      if (isSupabaseConfigured()) {
        // Try Supabase authentication first
        try {
          const { data, error } = await supabase!.auth.signInWithPassword({
            email,
            password
          });

          if (error) {
            // If it's invalid credentials and we have demo credentials, try localStorage fallback
            if (error.message === 'Invalid login credentials' && 
                (email === 'ari@aridevillefitness.com' || users.some(u => u.email === email))) {
              console.log('Supabase login failed, trying demo mode fallback...');
              return loginWithLocalStorage(email, password);
            }
            console.error('Supabase login error:', error.message);
            return false;
          }

          if (data.user) {
            // User state will be updated by the auth state change listener
            return true;
          }
          return false;
        } catch (supabaseError) {
          console.error('Supabase connection error:', supabaseError);
          // Fall back to localStorage if Supabase is unreachable
          return loginWithLocalStorage(email, password);
        }
      } else {
        // Use localStorage authentication for demo
        return loginWithLocalStorage(email, password);
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; message: string }> => {
    try {
      if (isSupabaseConfigured()) {
        // Use Supabase authentication
        const { data, error } = await supabase!.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: {
              name: userData.name,
              role: userData.role || 'user'
            }
          }
        });

        if (error) {
          return { success: false, message: error.message };
        }

        if (data.user) {
          return { success: true, message: 'User registered successfully' };
        }
        return { success: false, message: 'Registration failed' };
      } else {
        // Fallback to localStorage for demo
        const existingUser = users.find(u => u.email === userData.email);
        if (existingUser) {
          return { success: false, message: 'User with this email already exists' };
        }

        const newUser: User = {
          id: Date.now().toString(),
          email: userData.email,
          name: userData.name,
          role: userData.role || 'user',
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        localStorage.setItem('app_users', JSON.stringify(updatedUsers));

        return { success: true, message: 'User registered successfully' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Registration failed' };
    }
  };

  const addUser = (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLoginAt'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('app_users', JSON.stringify(updatedUsers));
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    const updatedUsers = users.map(user =>
      user.id === id
        ? { ...user, ...userData, updatedAt: new Date().toISOString() }
        : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('app_users', JSON.stringify(updatedUsers));

    // Update current user if it's the same user
    if (user && user.id === id) {
      const updatedCurrentUser = { ...user, ...userData, updatedAt: new Date().toISOString() };
      setUser(updatedCurrentUser);
      if (authMode === 'demo') {
        localStorage.setItem('user_data', JSON.stringify(updatedCurrentUser));
      }
    }
  };

  const deleteUser = (id: string) => {
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem('app_users', JSON.stringify(updatedUsers));
  };

  const logout = async () => {
    if (authMode === 'supabase' && isSupabaseConfigured()) {
      try {
        await supabase!.auth.signOut();
        // User state will be updated by the auth state change listener
      } catch (error) {
        console.error('Logout error:', error);
      }
    } else {
      // Fallback for localStorage
      setUser(null);
      setAuthMode('demo');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      users,
      login, 
      register,
      logout, 
      addUser,
      updateUser,
      deleteUser,
      isLoading,
      authMode
    }}>
      {children}
    </AuthContext.Provider>
  );
};