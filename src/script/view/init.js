import { initializeApp } from 'firebase/app';
import { collection, getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig, dbCollection } from '../data/firebase-config';

const initApp = initializeApp(firebaseConfig);
const db = getFirestore();
const libRef = collection(db, dbCollection.libraries);
const userRef = collection(db, dbCollection.users);
const auth = getAuth();

export {
  initApp, db, libRef, userRef, auth,
};
