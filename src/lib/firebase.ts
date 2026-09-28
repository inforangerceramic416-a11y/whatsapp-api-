import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import configJson from '../../firebase-applet-config.json';

const firebaseConfig = {
  projectId: configJson.projectId,
  appId: configJson.appId,
  apiKey: configJson.apiKey,
  authDomain: configJson.authDomain,
  firestoreDatabaseId: configJson.firestoreDatabaseId,
  storageBucket: configJson.storageBucket,
  messagingSenderId: configJson.messagingSenderId,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Use specific database ID if configured
export const db = configJson.firestoreDatabaseId && configJson.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, configJson.firestoreDatabaseId)
  : getFirestore(app);

export const auth = getAuth(app);
export default app;
