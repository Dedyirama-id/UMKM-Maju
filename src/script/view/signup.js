import { createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import {
  doc, getDoc, setDoc,
} from 'firebase/firestore';
import { auth, db } from './init';
import { dbCollection } from '../data/firebase-config';

// signup
const signup = document.querySelector('#signup-form');
signup.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = signup.email.value;
  const username = signup.username.value;
  const password = signup.password.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      setDoc(doc(db, dbCollection.users, cred.user.uid), {
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

onAuthStateChanged(auth, (user) => {
  if (user) {
    getDoc(doc(db, dbCollection.users, user.uid))
      .then((docSnapshot) => {
        const { role } = docSnapshot.data();
        if (role === 'admin') {
          window.location.href = 'admin-dashboard.html';
        } else if (role === 'user') {
          window.location.href = 'user-dashboard.html';
        } else {
          alert('Invalid account type!');
          signOut(auth)
            .then(() => {
              window.location.href = window.location.origin;
            })
            .catch((error) => console.log(error));
        }
      });
  }
});
