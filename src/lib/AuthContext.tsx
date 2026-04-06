import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export type UserRole = 'client' | 'merchant' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: 'active' | 'blocked' | 'pending';
  level?: 'bronze' | 'silver' | 'gold';
  availableCashback?: number;
  totalCashback?: number;
  storeId?: string;
  cpf?: string;
  birthDate?: string;
  phone?: string;
  termsAcceptedAt?: string;
  referralCode?: string;
  address?: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isMerchant: boolean;
  isClient: boolean;
  isProfileComplete: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  isMerchant: false,
  isClient: false,
  isProfileComplete: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        // Listen for profile changes
        const unsubscribeProfile = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            setProfile(data);
            
            // RN-12: Check if profile is complete (CPF, birthDate, phone, address, terms)
            if (data.role === 'client') {
              const complete = !!(
                data.cpf && 
                data.birthDate && 
                data.phone && 
                data.address && 
                data.termsAcceptedAt
              );
              setIsProfileComplete(complete);
            } else {
              setIsProfileComplete(true);
            }
          } else {
            setProfile(null);
            setIsProfileComplete(false);
          }
          setLoading(false);
        }, (error) => {
          console.error("Error fetching profile:", error);
          setLoading(false);
        });

        return () => unsubscribeProfile();
      } else {
        setProfile(null);
        setIsProfileComplete(false);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const value = {
    user,
    profile,
    loading,
    isAdmin: profile?.role === 'admin',
    isMerchant: profile?.role === 'merchant',
    isClient: profile?.role === 'client',
    isProfileComplete,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
