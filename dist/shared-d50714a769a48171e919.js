(self["webpackChunkumkm_maju"] = self["webpackChunkumkm_maju"] || []).push([[712],{

/***/ 142:
/***/ (() => {

var toggle = document.querySelector('.theme-controller');
toggle.addEventListener('click', function () {
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

/***/ }),

/***/ 976:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _script_view_theme_toggle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(142);
/* harmony import */ var _script_view_theme_toggle__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_script_view_theme_toggle__WEBPACK_IMPORTED_MODULE_0__);



/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__(976));
/******/ }
]);