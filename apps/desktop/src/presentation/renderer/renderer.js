(function () {
  const networkEl = document.getElementById('network');
  const api = window.posnepalDesktop;
  if (!api || !networkEl) return;

  api.getNetwork().then(function (snap) {
    networkEl.textContent = snap && snap.status === 'ONLINE' ? 'Online' : 'Offline';
  }).catch(function () {
    networkEl.textContent = 'Offline';
  });

  api.onNetworkChange(function (snap) {
    networkEl.textContent = snap && snap.status === 'ONLINE' ? 'Online' : 'Offline';
  });
})();
