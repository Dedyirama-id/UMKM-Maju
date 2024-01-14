import {
  doc, getDoc, onSnapshot,
} from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db, libRef } from './init';
import { dbCollection } from '../data/firebase-config';

const categoryContainer = document.getElementById('category-container');

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

onSnapshot(libRef, (snapshot) => {
  const data = [];
  snapshot.docs.forEach((document) => {
    data.push(document.data().category);
  });
  const categories = [...new Set(data)];

  categoryContainer.innerHTML = '';
  categories.forEach((c) => {
    const card = `
      <section data-category = "${c}"
          class="bg-slate-300 dark:bg-opacity-20 aspect-video shadow-md p-2 overflow-hidden relative flex flex-col align-middle justify-center cursor-pointer group">
          <div class="flex flex-col align-middle justify-center">
              <p
                  class="text-xl font-bold flex-grow text-center group-hover:scale-105 ease-in-out duration-100">
                  ${c}</p>
          </div>
          <span class="material-symbols-outlined absolute right-1 bottom-1 cursor-pointer ">
              arrow_forward
          </span>
      </section>
    `;
    categoryContainer.innerHTML += card;
    const categoryElem = [...document.querySelectorAll('[data-category]')];
    categoryElem.forEach((item) => {
      item.addEventListener('click', () => {
        localStorage.setItem('query', item.dataset.category);
        window.location.href = 'category.html';
      });
    });
  });
});

const searchForm = document.querySelector('#search-form');
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const keyword = document.querySelector('#keyword');
  localStorage.setItem('query', `Search: ${keyword.value}`);
  window.location.href = 'category.html';
});
