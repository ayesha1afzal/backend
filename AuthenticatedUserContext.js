import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from 'firebase/auth';
import { auth, database } from '../config/firebase';
import { useNotification } from "../../contexts/NotificationContext";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore"; // Added getDoc and setDoc

export const AuthenticatedUserContext = createContext({});

export const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { expoPushToken, notification, error } = useNotification();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (authenticatedUser) => {
      setUser(authenticatedUser || null);

      if (authenticatedUser && expoPushToken) {
        try {
          // Reference the user's document in Firestore using UID
          const userDocRef = doc(database, "users", authenticatedUser.email);
          
          // Check if document exists
          const docSnap = await getDoc(userDocRef);
          
          if (docSnap.exists()) {
            // Update existing document
            await updateDoc(userDocRef, { token: expoPushToken });
            console.log("Token updated in Firestore successfully.");
          } else {
            // Create document if it doesn't exist yet
            await setDoc(userDocRef, { 
              id: authenticatedUser.email,
              email: authenticatedUser.email,
              displayName: authenticatedUser.displayName || '',
              token: expoPushToken,
              about: 'Available'
            });
            console.log("New user document created with token in Firestore.");
          }
        } catch (error) {
          console.error("Error updating user profile:", error);
        }
      }
    });

    return unsubscribeAuth;
  }, [expoPushToken]); // Keep expoPushToken as a dependency

  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};