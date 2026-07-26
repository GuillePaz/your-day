// src/pages/api/test-push.ts
export const prerender = false;

import type { APIRoute } from 'astro';
import webpush from 'web-push';

export const POST: APIRoute = async ({ request, locals }) => {

  console.log("llega aqui")

  try {
    const { subscription } = await request.json();

    const env = (locals as any).runtime?.env || {};
    const publicKey = env.PUBLIC_VAPID_KEY || import.meta.env.PUBLIC_VAPID_KEY || process.env.PUBLIC_VAPID_KEY;
    const privateKey = env.VAPID_PRIVATE_KEY || import.meta.env.VAPID_PRIVATE_KEY || process.env.VAPID_PRIVATE_KEY;



    webpush.setVapidDetails('mailto:admin@tuapp.com', publicKey, privateKey);

    // Disparo inmediato de la notificación
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: 'Cumpleaños de Guillermo Paz',
        body: '¡Felicita hoy 28 de Julio a Guillermo Paz en su día!'
      })
    );

    return new Response(JSON.stringify({ success: true,
    message: '¡Notificación enviada!' }), { status: 200 });
  } catch (error: any) {
    console.error('Error detallado en trigger-push:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
