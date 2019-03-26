if ('serviceWorker' in navigator) {
  function registerServiceWorker () {
    return navigator.serviceWorker.register('/sw.js')
  }

  window.addEventListener('load', registerServiceWorker)
}
