import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from './init';
import { dbCollection } from '../data/firebase-config';

onAuthStateChanged(auth, (user) => {
  if (user) {
    getDoc(doc(db, dbCollection.users, user.uid))
      .then((docSnapshot) => {
        const { role } = docSnapshot.data();
        if (role !== 'admin' && role !== 'user') {
          alert('Invalid account role!');
          signOut(auth)
            .then(() => {
              window.location.href = window.location.origin;
            })
            .catch((error) => console.log(error));
        }
      });
  } else {
    window.location.href = window.location.origin;
  }
});

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
