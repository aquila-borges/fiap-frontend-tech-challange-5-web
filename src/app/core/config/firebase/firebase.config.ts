import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { environment } from '../../../../environments/environment';

let firebaseApp: FirebaseApp | null = null;
let auth: Auth | null = null;

export function initializeFirebase(): void {
  if (firebaseApp && auth) {
    return;
  }

  firebaseApp = initializeApp(environment.firebase);
  auth = getAuth(firebaseApp);
}

export function getFirebaseAuth(): Auth {
  initializeFirebase();

  if (!auth) {
    throw new Error('Failed to initialize Firebase Auth.');
  }
  return auth;
}

export function getFirebaseApp(): FirebaseApp {
  initializeFirebase();

  if (!firebaseApp) {
    throw new Error('Failed to initialize Firebase App.');
  }
  return firebaseApp;
}
