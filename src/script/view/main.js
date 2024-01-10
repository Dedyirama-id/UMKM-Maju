import { initializeApp } from 'firebase/app';
import {
  collection, getFirestore, onSnapshot,
} from 'firebase/firestore';
import firebaseConfig from '../data/firebase-config';

// Initialize Firebase
initializeApp(firebaseConfig);

// init services
const db = getFirestore();

// collection ref
const colRef = collection(db, 'libraries');

export default colRef;
