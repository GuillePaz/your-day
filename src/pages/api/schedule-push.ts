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

    // Calculamos los SEGUNDOS exactos hasta la fecha objetivo
    const delayInSeconds = Math.max(0, Math.floor((new Date(scheduledAt).getTime() - Date.now()) / 1000));

    const baseUrl = new URL(request.url).origin;

    await qstash.publishJSON({
      url: `${baseUrl}/api/trigger-push`,
      body: {
        subscription,
        scheduledAt
      },
      delay: delayInSeconds,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    // Esto te imprimirá el error real en tu consola si algo falla
    console.error('Error en schedule-push:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
