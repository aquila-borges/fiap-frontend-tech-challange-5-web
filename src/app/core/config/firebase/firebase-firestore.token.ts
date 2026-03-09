import { InjectionToken } from '@angular/core';
import { Firestore } from 'firebase/firestore';
import { getFirebaseFirestore } from './firebase.config';

export const FIREBASE_FIRESTORE_TOKEN = new InjectionToken<Firestore>(
  'FIREBASE_FIRESTORE_TOKEN',
  {
    factory: () => getFirebaseFirestore(),
  }
);
