const toggle = document.querySelector('.theme-controller');

toggle.addEventListener('click', () => {
  if (toggle.checked) {
    localStorage.setItem('theme', 'dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
    document.documentElement.setAttribute('data-theme', 'light');
  }
});

if (localStorage.getItem('theme') === 'dark') {
  toggle.checked = true;
  document.documentElement.setAttribute('data-theme', 'dark');
} else if (localStorage.getItem('theme') === 'light') {
  toggle.checked = false;
  document.documentElement.setAttribute('data-theme', 'light');
}
