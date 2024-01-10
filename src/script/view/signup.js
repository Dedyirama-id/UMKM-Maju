import {
  createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword,
} from 'firebase/auth';
import {
  firestore, addDoc, collection, getFirestore, doc, setDoc, onSnapshot,
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../data/firebase-config';

initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
const userCollection = collection(db, 'users');

// signup
const signup = document.querySelector('#signup-form');
signup.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = signup.email.value;
  const username = signup.username.value;
  const password = signup.password.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      setDoc(doc(db, 'users', cred.user.uid), {
        username,
        role: 'user',
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
});

// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     onSnapshot(doc(db, 'users', user.uid), (docSnapshot) => {
//       if (docSnapshot.data().role === 'admin') {
//         window.location.href = 'admin-dashboard.html';
//       } else if (docSnapshot.data().role === 'user') {
//         window.location.href = 'user-dashboard.html';
//       }
//     });
//   } else {
//     console.log('Logged Out!');
//   }
// });
