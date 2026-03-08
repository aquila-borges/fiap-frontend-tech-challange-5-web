import { InjectionToken } from '@angular/core';
import { Auth } from 'firebase/auth';
import { getFirebaseAuth } from './firebase.config';

export const FIREBASE_AUTH_TOKEN = new InjectionToken<Auth>('FIREBASE_AUTH_TOKEN', {
  factory: () => getFirebaseAuth()
});
