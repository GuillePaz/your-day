// public/sw.js
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'Alarma', body: '¡Hora de la notificación!' };

  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/favicon.svg',
  });
});
