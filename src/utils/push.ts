// src/utils/push.ts

/**
 * Convierte la clave VAPID en formato Base64 a un Uint8Array requerido por la Web Push API.
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {



  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
   const base64 = (base64String + padding)
     .replace(/-/g, '+')
     .replace(/_/g, '/');
   const rawData = window.atob(base64);

   // 🟢 Creamos un ArrayBuffer con tamaño fijo exacto
   const outputArray = new Uint8Array(rawData.length);

   for (let i = 0; i < rawData.length; ++i) {
     outputArray[i] = rawData.charCodeAt(i);
   }

   return outputArray;
 }

/**
 * Solicita permisos, obtiene o genera la suscripción Push y registra la alarma en el servidor.
 *
 * @param scheduledAt Fecha y hora en que debe dispararse la notificación.
 * @param vapidPublicKey Clave pública VAPID (debe pasarse desde import.meta.env o process.env).
 */
export async function schedulePushNotification(
  scheduledAt: Date,
  vapidPublicKey: string
): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Verificar soporte del navegador
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      throw new Error('Las notificaciones Push no son soportadas en este navegador.');
    }

    // 2. Pedir permisos de notificación al usuario
    const permission = await Notification.requestPermission();

    console.log()

    if (permission !== 'granted') {
      throw new Error('El permiso para enviar notificaciones fue denegado.');
    }

    // 3. Registrar Service Worker y obtener/crear suscripción Push
    await navigator.serviceWorker.register('/sw.js');

const reg = await navigator.serviceWorker.ready;

    let sub = await reg.pushManager.getSubscription();

    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as unknown as BufferSource,
      });
    }

    // 4. Enviar los datos al backend
    const response = await fetch('/api/schedule-push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription: sub,
        scheduledAt: scheduledAt.toISOString(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Ocurrió un error al programar la alarma en el servidor.');
    }

    return {
      success: true,
      message: data.message || '¡Alerta programada con éxito!'
    };

  } catch (error: any) {
    console.error('Error al programar push:', error);
    return {
      success: false,
      message: error.message || 'Error desconocido al programar la notificación.'
    };
  }
}


/**
 * Envía una notificación Push instantánea de prueba.
 */
export async function sendInstantTestPush(vapidPublicKey?: string): Promise<{ success: boolean; message: string }> {
  try {

    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      throw new Error('Las notificaciones Push no son soportadas en este navegador.');
    }

    // 2. Pedir permisos de notificación al usuario
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      throw new Error('El permiso para enviar notificaciones fue denegado.');
    }

    // 3. Registrar Service Worker y obtener/crear suscripción Push


    // Esperamos a que el Service Worker esté activo
    await navigator.serviceWorker.register('/sw.js');

const reg = await navigator.serviceWorker.ready;

    let sub = await reg.pushManager.getSubscription();

    if (!sub) {
          // Usar la clave VAPID pública
          const key = vapidPublicKey || import.meta.env.VAPID_PUBLIC_KEY;

          if (!key) {
            throw new Error('Falta la clave VAPID pública para suscribirse.');
          }

          sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(key) as unknown as BufferSource,
          });
        }

    // Enviar directamente al endpoint de prueba instantáneo
    const response = await fetch('/api/test-push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription: sub }),
    });

    const data = await response.json();
    return { success: response.ok, message: data.message };

  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
