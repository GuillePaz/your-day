import { useState, useEffect } from 'react';

/**
 * Hook personalizado que calcula el tiempo restante hasta una fecha objetivo.
 * @param targetDate Fecha en formato string (ej: '2026-07-28T00:00:00') o un objeto Date.
 * @returns Un string formateado como "DD:HH:MM:SS" que se actualiza cada segundo.
 */
export function useCountdown(targetDate: string | Date): string {
  // Inicializamos con el estado en cero mientras se calcula el primer segundo
  const [timeLeft, setTimeLeft] = useState('00:00:00:00');

  useEffect(() => {
    const targetTime = new Date(targetDate).getTime();

    // Función que calcula la diferencia y actualiza el estado
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft('00:00:00:00');
        clearInterval(intervalId);
        return;
      }

      // Cálculos de tiempo
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      // Formateo a 2 dígitos
      const fDays = String(days).padStart(2, '0');
      const fHours = String(hours).padStart(2, '0');
      const fMinutes = String(minutes).padStart(2, '0');
      const fSeconds = String(seconds).padStart(2, '0');

      setTimeLeft(`${fDays} : ${fHours} : ${fMinutes} : ${fSeconds}`);
    };

    // Ejecutamos una vez al inicio para evitar el retraso de 1 segundo del setInterval
    updateCountdown();

    // Configuramos el intervalo para que corra cada segundo
    const intervalId = setInterval(updateCountdown, 1000);

    // IMPORTANTE: Limpieza del efecto si el componente se desmonta
    return () => clearInterval(intervalId);
  }, [targetDate]); // Se reinicia si la fecha objetivo cambia

  return timeLeft;
}
