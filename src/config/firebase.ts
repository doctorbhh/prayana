import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { getDatabase, ref, set, get } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL
};

// Log the configuration to debug
console.log("Firebase Config:", {
  apiKey: firebaseConfig.apiKey ? "Set" : "Missing",
  databaseURL: firebaseConfig.databaseURL,
  projectId: firebaseConfig.projectId
});

// Validate configuration
if (!firebaseConfig.apiKey) {
  throw new Error("Missing Firebase API Key. Check your environment variables.");
}
if (!firebaseConfig.databaseURL) {
  throw new Error("Missing Firebase Realtime Database URL. Check your environment variables.");
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getDatabase(app);

export const login = async (email: string, password: string) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    console.error("Login error:", error.code, error.message);
    throw error;
  }
};

export const register = async (email: string, password: string, name: string) => {
  try {
    const usersRef = ref(db, 'users');
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
      snapshot.forEach((child) => {
        if (child.val().name === name) {
          throw new Error("auth/username-already-in-use");
        }
      });
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await set(ref(db, `users/${user.uid}`), {
      email: user.email,
      name: name,
      balance: 100, // Initial balance of $100
      createdAt: new Date().toISOString()
    });

    return userCredential;
  } catch (error: any) {
    console.error("Register error:", error.code, error.message);
    throw error;
  }
};

export const signOut = async () => {
  try {
    return await firebaseSignOut(auth);
  } catch (error: any) {
    console.error("SignOut error:", error.code, error.message);
    throw error;
  }
};

export const onAuthStateChangedListener = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};