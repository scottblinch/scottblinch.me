function loadServiceWorker() {
    navigator.serviceWorker.register('service-worker.js');
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', loadServiceWorker);
}
