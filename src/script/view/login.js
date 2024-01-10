import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword,
} from 'firebase/auth';

const auth = getAuth();

// Login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = 'admin-dashboard.html';
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
    window.location.href = 'admin-dashboard.html';
  } else {
    console.log('Logged Out!');
  }
});
