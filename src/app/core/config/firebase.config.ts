import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { environment } from '../../../environments/environment';

let firebaseApp: FirebaseApp;
let auth: Auth;

export function initializeFirebase(): void {
  firebaseApp = initializeApp(environment.firebase);
  auth = getAuth(firebaseApp);
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    throw new Error('Firebase não foi inicializado. Chame initializeFirebase() primeiro.');
  }
  return auth;
}

export function getFirebaseApp(): FirebaseApp {
  if (!firebaseApp) {
    throw new Error('Firebase não foi inicializado. Chame initializeFirebase() primeiro.');
  }
  return firebaseApp;
}
