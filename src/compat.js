// Compatibility between Chrome and Firefox
window.browser = (function () {
  return window.msBrowser ||
    window.browser ||
    window.chrome;
})();

window.devtools = window.devtools || chrome.devtools
