import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { dbCollection } from '../data/firebase-config';
import { auth, db } from './init';

// Login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;

  signInWithEmailAndPassword(auth, email, password)
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
