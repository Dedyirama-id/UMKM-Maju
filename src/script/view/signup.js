import { createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import {
  doc, getDoc, setDoc,
} from 'firebase/firestore';
import { auth, db } from './init';
import { dbCollection } from '../data/firebase-config';

// signupForm
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = signupForm.email.value;
  const username = signupForm.username.value;
  const password = signupForm.password.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      setDoc(doc(db, dbCollection.users, cred.user.uid), {
        username,
        role: 'user',
      });
    })
    .catch((error) => {
      const parts = error.code.split('/');
      const filteredText = parts[parts.length - 1].replace(/-/g, ' ');
      const errMessage = filteredText.replace(/\b\w/g, (char) => char.toUpperCase());

      const errText = document.getElementById('error-message');
      errText.textContent = errMessage;
      errText.style.display = 'block';
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
