import { initializeApp } from 'firebase/app';
import {
  addDoc,
  collection, getFirestore, onSnapshot, query, serverTimestamp,
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged } from 'firebase/auth';
import firebaseConfig from '../data/firebase-config';

// Initialize Firebase
initializeApp(firebaseConfig);

// init services
const db = getFirestore();
const auth = getAuth();

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

// const addLib = addDoc(colRef, {
//   title: 'title',
//   desc: 'desc',
//   rating: 5,
//   voteCount: 0,
//   timestamp: serverTimestamp(),
// });

// Function to redirect to the dashboard
function redirectToDashboard() {
  window.location.href = 'dashboard.html';
  console.log('to dashboard')
}

// Sign-up
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      redirectToDashboard();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('Logged in: ', user);

    // Redirect to the dashboard if the user is already logged in
    redirectToDashboard();
  } else {
    console.log('Logged Out!');
  }
});
