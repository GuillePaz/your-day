export const prerender = false;

// src/pages/api/schedule-push.ts
import type { APIRoute } from 'astro';
import { Client } from '@upstash/qstash';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { subscription, scheduledAt } = await request.json();

    const token = (locals as any).runtime?.env?.QSTASH_TOKEN
      || import.meta.env.QSTASH_TOKEN
      || process.env.QSTASH_TOKEN;

    if (!token) {
      throw new Error('No se encontró QSTASH_TOKEN en las variables de entorno.');
    }

    const qstash = new Client({
      token,
      baseUrl: "https://qstash-us-east-1.upstash.io" });


    const deviceId = subscription.endpoint.slice(-30);
        const timeId = new Date(scheduledAt).getTime();


    const deduplicationId = `push-${deviceId}-${timeId}`;
    // Calculamos los SEGUNDOS exactos hasta la fecha objetivo
    const delayInSeconds = Math.max(0, Math.floor((new Date(scheduledAt).getTime() - Date.now()) / 1000));

    const baseUrl = new URL(request.url).origin;

    const res = await qstash.publishJSON({
      url: `${baseUrl}/api/trigger-push`,
      body: {
        subscription,
        scheduledAt
      },
      delay: delayInSeconds,
      deduplicationId: deduplicationId
    });


    if (res.deduplicated) {

          return new Response(
            JSON.stringify({
              success: true,
              isDuplicate: true,
              message: 'Esta alerta ya estaba programada.'
            }),
            { status: 200 }
          );
        }

        // 🟢 Si NO estaba duplicada, se programó con éxito para el futuro
        return new Response(
          JSON.stringify({
            success: true,
            isDuplicate: false,
            message: '¡Alerta programada con éxito!'
          }),
          { status: 200 }
        );
  } catch (error: any) {
    // Esto te imprimirá el error real en tu consola si algo falla
    console.error('Error en schedule-push:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
