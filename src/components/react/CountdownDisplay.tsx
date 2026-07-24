import { Text } from "./Text";
import React from 'react';
import { useCountdown } from './useCountdown'; // Ajusta la ruta según tu carpeta

interface CountdownDisplayProps {
  targetDate: string;
}

export default function CountdownDisplay({ targetDate }: CountdownDisplayProps) {


  const timeFormatted = useCountdown(targetDate);

  return (
    <div
        className="h-12  bg-linear-to-r from-5% via-black/60 to-95% from-white/0 to-white/0 relative"
    >

      <Text variant="span" font="menu" className="text-white absolute top-[50%] translate-y-[-50%] right-[50%] translate-x-[50%]"
            >{timeFormatted}</Text
        >
    </div>
  )
}
