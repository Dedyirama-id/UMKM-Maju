import { initializeApp } from 'firebase/app';
import { signOut, getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore, collection, addDoc,
  serverTimestamp, onSnapshot, doc,
  deleteDoc,
} from 'firebase/firestore';
import firebaseConfig from '../data/firebase-config';

const auth = getAuth();

// Initialize Firebase
initializeApp(firebaseConfig);

// init services
const db = getFirestore();

// collection ref
const libRef = collection(db, 'libraries');

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

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('Logged in: ', user);
  } else {
    console.log('Logged Out!');
  }
});

const addForm = document.querySelector('#add-book');
addForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = addForm.title.value;
  const desc = addForm.desc.value;
  const url = addForm.url.value;
  const category = addForm.category.value;
  const tag1 = addForm.tag1.value;
  const tag2 = addForm.tag2.value;
  const tag3 = addForm.tag3.value;
  const tags = [tag1, tag2, tag3];

  addDoc(libRef, {
    title,
    desc,
    url,
    category,
    rating: 0,
    voteCount: 0,
    tags,
    timestamp: serverTimestamp(),
  })
    .then(() => {
      addForm.reset();
    });
});

onSnapshot(libRef, (snapshot) => {
  const data = [];
  snapshot.docs.forEach((document) => {
    data.push({ ...document.data(), id: document.id });
  });
  const libTable = document.querySelector('#lib-table');
  libTable.innerHTML = `
    <tr>
        <th>ID</th>
        <th>Judul</th>
        <th>Deskripsi</th>
        <th>url</th>
        <th>Kategori</th>
        <th>Tag</th>
        <th>Action</th>
    </tr>
  `;

  data.forEach((item) => {
    libTable.innerHTML += `
      <tr data-id="${item.id}">
          <td>${item.id}</td>
          <td>${item.title}</td>
          <td>${item.desc}</td>
          <td>${item.url}</td>
          <td>${item.category}</td>  
          <td>${item.tags}</td>
          <td>
              <button class="btn edit">Edit</button>
              <button class="btn delete">Delete</button>
          </td>
      </tr>
    `;
  });

  const editButtons = [...document.querySelectorAll('.btn.edit')];
  editButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const { id } = e.target.parentElement.parentElement.dataset;
      editData(id);
    });
    const deleteButtons = [...document.querySelectorAll('.btn.delete')];
    deleteButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        const { id } = e.target.parentElement.parentElement.dataset;
        resetAddForm();
        deleteDoc(doc(db, 'libraries', id)).catch((err) => console.log(err));
      });
    });
  });
});

function editData(id) {
  onSnapshot(doc(db, 'libraries', id), (snapshot) => {
    const data = { ...snapshot.data(), id: snapshot.id };
    const formTitle = document.getElementById('add-book-title');
    const form = document.getElementById('add-book');
    formTitle.innerHTML = 'Edit Data';
    form.title.value = data.title;
    form.desc.value = data.desc;
    form.url.value = data.url;
    form.category.value = data.category;
    form.tag1.value = data.tags[0];
    form.tag2.value = data.tags[1];
    form.tag3.value = data.tags[2];
    form.submit.innerHTML = 'Edit Data';
  });
}

function resetAddForm() {
  const formTitle = document.getElementById('add-book-title');
  const form = document.getElementById('add-book');
  formTitle.innerHTML = 'Add New Data';
  form.title.value = '';
  form.desc.value = '';
  form.url.value = '';
  form.category.value = '';
  form.tag1.value = '';
  form.tag2.value = '';
  form.tag3.value = '';
  form.submit.innerHTML = 'Add Data';
}
