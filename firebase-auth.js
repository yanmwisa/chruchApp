import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  deleteUser as firebaseDeleteUser
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseConfig } from "./firebase-config";

// Ensure Firebase is initialized only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// initialize Firebase Auth with AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Authentication functions
const signup = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  console.log("✅ Signed Up:", userCredential.user.email);
  return userCredential;
};

const signin = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  console.log("✅ Signed In:", userCredential.user.email);
  return userCredential;
};

const signout = async () => {
  await signOut(auth);
  console.log("🚪 Signed Out");
};

const deleteUser = async (user) => {
  return await firebaseDeleteUser(user);
};

export { auth, signup, signin, signout, deleteUser };
