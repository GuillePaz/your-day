export const prerender = false; // 👈 Evita que Astro bloquee la petición POST

import type { APIRoute } from 'astro';
import webpush from 'web-push';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Lectura robusta de variables de entorno para Local y Producción
    const env = (locals as any).runtime?.env || {};
    const publicKey = env.PUBLIC_VAPID_KEY || import.meta.env.PUBLIC_VAPID_KEY || process.env.PUBLIC_VAPID_KEY;
    const privateKey = env.VAPID_PRIVATE_KEY || import.meta.env.VAPID_PRIVATE_KEY || process.env.VAPID_PRIVATE_KEY;

    if (!publicKey || !privateKey) {
      throw new Error('Faltan las claves PUBLIC_VAPID_KEY o VAPID_PRIVATE_KEY.');
    }

    // Configurar llaves VAPID
    webpush.setVapidDetails(
      'mailto:admin@tuapp.com', // Puedes cambiar esto por tu correo
      publicKey,
      privateKey
    );

    const { subscription } = await request.json();

    if (!subscription) {
      throw new Error('No se recibió la suscripción en el body.');
    }


    // Enviar notificación real al navegador
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: 'Cumpleaños de Guillermo Paz',
        body: `¡Felicita hoy 28 de Julio a Guillermo Paz en su día!`
      })
    );

    return new Response(JSON.stringify({ sent: true }), { status: 200 });
  } catch (error: any) {
    console.error('Error detallado en trigger-push:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
