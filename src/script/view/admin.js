import { signOut, onAuthStateChanged } from 'firebase/auth';
import {
  addDoc, serverTimestamp, onSnapshot, doc,
  deleteDoc, updateDoc, getDoc,
} from 'firebase/firestore';
import { db, libRef, auth } from './init';
import { dbCollection } from '../data/firebase-config';

const btnAddNew = document.querySelector('#btn-add-new');
const secAdd = document.querySelector('#sec-add-form');
const secEdit = document.querySelector('#sec-edit-form');
const logoutBtn = document.querySelector('#logout');

btnAddNew.addEventListener('click', (e) => {
  e.preventDefault();
  secAdd.classList.remove('hidden');
  secEdit.classList.add('hidden');
});

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
  const tags = [...(addForm.querySelectorAll('.tag'))]
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
    secAdd.classList.add('hidden');
  });
});

addForm.resetx.addEventListener('click', (e) => {
  e.preventDefault();
  addForm.reset();
  secAdd.classList.add('hidden');
});

const editForm = document.querySelector('#edit-form');
function showEditForm(id) {
  secAdd.classList.add('hidden');
  secEdit.classList.remove('hidden');
  getDoc(doc(db, dbCollection.libraries, id)).then((docSnapshot) => {
    const data = docSnapshot.data();
    const editId = document.getElementById('edit-id');
    editId.innerText = id;
    editForm.title.value = data.title;
    editForm.desc.value = data.desc;
    editForm.url.value = data.url;
    editForm.category.value = data.category;
    const tagsElem = [...editForm.querySelectorAll('.tag')];
    tagsElem.forEach((tagInput, index) => {
      tagInput.value = data.tags[index] || '';
    });
  });
}

editForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('edit-id').innerText;

  updateDoc(doc(db, dbCollection.libraries, id), {
    title: editForm.title.value,
    desc: editForm.desc.value,
    url: editForm.url.value,
    category: editForm.category.value,
    tags: [...(editForm.querySelectorAll('.tag'))]
      .map((tagInput) => tagInput.value)
      .filter((tag) => tag.trim() !== ''),
  })
    .then(() => {
      editForm.reset();
      const editId = document.getElementById('edit-id');
      editId.innerText = '-';
      secEdit.classList.add('hidden');
    });
});

editForm.resetx.addEventListener('click', (e) => {
  e.preventDefault();
  editForm.reset();
  const editId = document.getElementById('edit-id');
  editId.innerText = '-';
  secEdit.classList.add('hidden');
});

onSnapshot(libRef, (snapshot) => {
  const data = [];
  snapshot.docs.forEach((document) => {
    data.push({ ...document.data(), id: document.id });
  });
  const libTable = document.querySelector('#lib-table');
  libTable.innerHTML = `
    <thead>
        <tr>
            <th class="-z-10">Action</th>
            <th>ID</th>
            <th>Title</th>
            <th class="max-w-md">Desc</th>
            <th>URL</th>
            <th>Category</th>
            <th>Tag</th>
        </tr>
    </thead>
  `;

  data.forEach((item) => {
    libTable.innerHTML += `
      <tr data-id="${item.id}">
          <td class=" max-w-xs flex flex-row gap-1">
            <span class="action edit material-symbols-outlined cursor-pointer hover:scale-110 ease-in-out duration-150">
              edit_note
            </span>
            <span class="action delete material-symbols-outlined hover:cursor-pointer hover:scale-110 ease-in-out duration-150">
              delete
            </span>
          </td>
          <td class="max-w-md align-top">${item.id}</td>
          <td class="max-w-md align-top">${item.title}</td>
          <td class="max-w-md align-top">${item.desc}</td>
          <td class="max-w-md align-top">${item.url}</td>
          <td class="max-w-md align-top">${item.category}</td>  
          <td class="max-w-sm align-top">${item.tags}</td>
      </tr>
    `;
  });

  const editButtons = [...document.querySelectorAll('.action.edit')];
  editButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const { id } = e.target.parentElement.parentElement.dataset;
      showEditForm(id);
    });
  });

  const deleteButtons = [...document.querySelectorAll('.action.delete')];
  deleteButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const { id } = e.target.parentElement.parentElement.dataset;
      deleteDoc(doc(db, 'libraries', id)).catch((err) => console.log(err));
    });
  });
});
