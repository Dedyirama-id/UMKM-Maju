import { signOut, onAuthStateChanged } from 'firebase/auth';
import {
  addDoc, serverTimestamp, onSnapshot, doc,
  deleteDoc, updateDoc, getDoc,
} from 'firebase/firestore';
import { db, libRef, auth } from './init';
import { dbCollection } from '../data/firebase-config';

const logoutBtn = document.querySelector('#logout');
logoutBtn.addEventListener('click', (e) => {
  e.preventDefault();
  signOut(auth)
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorCode, errorMessage);
    });
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    getDoc(doc(db, dbCollection.users, user.uid))
      .then((docSnapshot) => {
        const { role } = docSnapshot.data();
        if (role === 'user') {
          window.location.href = 'user-dashboard.html';
        } else if (role !== 'admin') {
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

const addForm = document.querySelector('#add-form');
addForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = addForm.title.value;
  const desc = addForm.desc.value;
  const url = addForm.url.value;
  const category = addForm.category.value;
  const tags = Array.from(addForm.querySelectorAll('[name^="tag"]'))
    .map((tagInput) => tagInput.value)
    .filter((tag) => tag.trim() !== '');

  addDoc(libRef, {
    title,
    desc,
    url,
    category,
    rating: 0,
    voteCount: 0,
    tags,
    timestamp: serverTimestamp(),
  }).then(() => {
    addForm.reset();
  });
});

addForm.resetx.addEventListener('click', (e) => {
  e.preventDefault();
  addForm.reset();
});

const editForm = document.querySelector('#edit-form');
function showEditForm(id) {
  getDoc(doc(db, dbCollection.libraries, id)).then((docSnapshot) => {
    const data = docSnapshot.data();
    editForm.id.value = id;
    editForm.title.value = data.title;
    editForm.desc.value = data.desc;
    editForm.url.value = data.url;
    editForm.category.value = data.category;
    const tagsElem = Array.from(editForm.querySelectorAll('[name^="tag"]'));
    tagsElem.forEach((tagInput, index) => {
      tagInput.value = data.tags[index] || '';
    });
  });
}

editForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = editForm.id.value;

  updateDoc(doc(db, dbCollection.libraries, id), {
    title: editForm.title.value,
    desc: editForm.desc.value,
    url: editForm.url.value,
    category: editForm.category.value,
    tags: Array.from(editForm.querySelectorAll('[name^="tag"]'))
      .map((tagInput) => tagInput.value)
      .filter((tag) => tag.trim() !== ''),
  })
    .then(() => {
      editForm.reset();
    });
});

editForm.resetx.addEventListener('click', (e) => {
  e.preventDefault();
  editForm.reset();
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
      showEditForm(id);
    });
  });

  const deleteButtons = [...document.querySelectorAll('.btn.delete')];
  deleteButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const { id } = e.target.parentElement.parentElement.dataset;
      deleteDoc(doc(db, 'libraries', id)).catch((err) => console.log(err));
    });
  });
});
