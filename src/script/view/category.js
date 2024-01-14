import {
  query, onSnapshot, where,
} from 'firebase/firestore';
import { libRef } from './init';

const queryData = localStorage.getItem('query');
const drawerMenu = document.getElementById('drawer-menu');

const docTitle = document.getElementById('doc-title');
docTitle.innerText = queryData;

const categoryTitle = document.getElementById('category-title');
categoryTitle.innerText = queryData;
const searchQuery = queryData.replace('Search: ', '').toLowerCase();

if (queryData.includes('Search: ')) {
  onSnapshot(libRef, (snapshot) => {
    const data = [];
    snapshot.docs.forEach((document) => {
      if (document.data().title.toLowerCase().includes(searchQuery)
        || document.data().desc.toLowerCase().includes(searchQuery)
        || document.data().category.toLowerCase().includes(searchQuery)) {
        data.push({ ...document.data(), id: document.id });
      }
    });

    const dataContainer = document.getElementById('data-container');
    dataContainer.innerHTML = '';
    data.forEach((d, i) => {
      dataContainer.innerHTML += `
      <section class="flex flex-col gap-4">
        <h2 class="text-xl font-bold h-16">#${i + 1}. ${d.title}</h2>
        <a href="${d.url}" target="_blank">
          <div src="" alt="" class="data-img bg-gray-200 aspect-video w-full rounded-md shadow-md flex flex-col justify-center cursor-pointer p-2">
            <h3 class="mx-auto w-fit font-bold text-2xl">${d.url}</h3>
          </div>
        </a>
        <p>${d.desc}</p>
      </section>
    `;
    });
  });
} else {
  onSnapshot(query(libRef, where('category', '==', queryData)), (snapshot) => {
    const data = [];
    snapshot.docs.forEach((document) => {
      data.push({ ...document.data(), id: document.id });
    });

    const dataContainer = document.getElementById('data-container');
    dataContainer.innerHTML = '';
    data.forEach((d, i) => {
      dataContainer.innerHTML += `
      <section class="flex flex-col gap-4">
        <h2 class="text-xl font-bold h-16">#${i + 1}. ${d.title}</h2>
        <a href="${d.url}" target="_blank">
          <div src="" alt="" class="data-img bg-gray-200 aspect-video w-full rounded-md shadow-md flex flex-col justify-center cursor-pointer p-2">
            <h3 class="mx-auto w-fit font-bold text-2xl">${d.url}</h3>
          </div>
        </a>
        <p>${d.desc}</p>
      </section>
    `;
    });
  });
}

onSnapshot(libRef, (snapshot) => {
  const temp = [];
  snapshot.docs.forEach((document) => {
    temp.push(document.data().category);
  });
  const categoryList = [...new Set(temp)];

  drawerMenu.innerHTML = '';
  categoryList.forEach((c) => {
    const li = document.createElement('li');
    li.innerHTML = `<a>${c}</a>`;
    li.addEventListener('click', () => {
      localStorage.setItem('query', c);
      window.location.reload();
    });
    drawerMenu.appendChild(li);
  });
});

const backBtn = document.getElementById('back-btn');
backBtn.addEventListener('click', () => {
  localStorage.removeItem('query');
  window.location.href = 'user-dashboard.html';
});

const searchForm = document.querySelector('#search-form');
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const keyword = document.querySelector('#keyword');
  localStorage.setItem('query', `Search: ${keyword.value}`);
  window.location.reload();
});
