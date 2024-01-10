import { initializeApp } from 'firebase/app';
import { signOut, getAuth } from 'firebase/auth';
import firebaseConfig from '../data/firebase-config';

// Initialize Firebase
initializeApp(firebaseConfig);

const auth = getAuth();

const logoutBtn = document.querySelector('#logout');
logoutBtn.addEventListener('click', (e) => {
  e.preventDefault();
  signOut(auth)
    .then(() => {
      window.location.href = '/';
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorCode, errorMessage);
    });
});
