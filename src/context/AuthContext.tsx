"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  sendPasswordResetEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth, db } from "@/firebase/config";
import { doc, setDoc } from "firebase/firestore";

interface UserType {
  uid: string | null;
  displayName: string | null;
  photoURL: string | null;
}

const AuthContext = createContext({});

export const useAuth = () => useContext<any>(AuthContext);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<UserType>({
    uid: null,
    displayName: null,
    photoURL: null,
  });
  const [loading, setLoading] = useState<Boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL
        });
      } else {
        setUser({
          uid: null,
          displayName: null,
          photoURL: null,
        });
      }
    });

    setLoading(false);

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    let result = null, error = null;
    try {
      result = await createUserWithEmailAndPassword(auth, email, password);
      if (result?.user) {
          const userRef = doc(db, "users", result.user.uid!);
          await setDoc(userRef, {uid: result.user.uid, email: email}, { merge: true });
      }
    } catch (e) {
      error = e;
    }
    return { result, error };
  };

  const logIn = async (email: string, password: string) => {
    let result = null,
      error = null;
    try {
      result = await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      error = e;
    }
    return { result, error };
  };

  const logOut = async () => {
    await signOut(auth);
    setUser({uid: null, displayName: null, photoURL: null});
    return 
  };

  const signInWithGoogle = async () => {
    let result = null,
      error = null;
    try {
      const provider = new GoogleAuthProvider();
      result = await signInWithPopup(auth, provider);
      if (result?.user) {
        let userData: any = {};
        if (result.user.email !== null) userData.email = result.user.email;
        if (result.user.displayName !== null) { userData.displayName = result.user.displayName;}
        if (result.user.phoneNumber !== null) userData.phoneNumber = result.user.phoneNumber;
        if (result.user.photoURL !== null) userData.photoURL = result.user.photoURL;

        const userRef = doc(db, "users", result.user.uid!);
        await setDoc(userRef, userData, { merge: true });
      }
    } catch (e) {
      error = e;
    }
    return { result, error };
  };

  const signInWithApple = async () => {
    let result = null,
      error = null;
    try {
      const provider = new OAuthProvider("apple.com");
      result = await signInWithPopup(auth, provider);
    } catch (e) {
      error = e;
    }
    return { result, error };
  };

  const signInWithPhone = async (
    phoneNumber: string,
    appVerifier: RecaptchaVerifier
  ) => {
    let result = null,
      error = null;
    try {
      result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    } catch (e) {
      error = e;
    }
    return { result, error };
  };

  const resetPassword = async (email: string) => {
    let result = null,
      error = null;
    try {
      result = await sendPasswordResetEmail(auth, email);
    } catch (e) {
      error = e;
    }
    return { result, error };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signUp,
        logIn,
        logOut,
        signInWithGoogle,
        signInWithApple,
        resetPassword,
        signInWithPhone,
      }}
    >
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
