import { initializeApp } from 'firebase/app';
import {
  addDoc,
  collection, getFirestore, onSnapshot, query, serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../data/firebase-config';

// Initialize Firebase
initializeApp(firebaseConfig);

// init services
const db = getFirestore();

// collection ref
const colRef = collection(db, 'libraries');

// queries
const q = query(colRef);

onSnapshot(colRef, (snapshot) => {
  const libraries = [];
  snapshot.docs.forEach((document) => {
    libraries.push({ ...document.data(), id: document.id });
  });
  console.log(libraries);
});

const addLib = addDoc(colRef, {
  title: 'title',
  desc: 'desc',
  rating: 5,
  voteCount: 0,
  timestamp: serverTimestamp(),
});
