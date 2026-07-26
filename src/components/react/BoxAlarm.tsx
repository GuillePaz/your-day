import clsx from "clsx";
import { Text } from "./Text";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  schedulePushNotification,
  sendInstantTestPush,
} from "../../utils/push";

export default function BoxAlarm() {
  const isTest = import.meta.env.PUBLIC_MODE === "test";

  const VAPID_KEY = import.meta.env.PUBLIC_VAPID_KEY;

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  // Nuevo estado para recordar cuál fue el último botón que tuvo hover
  const [lastActiveIndex, setLastActiveIndex] = useState(0);

  const handlePushNotify = async () => {
    const result = !isTest
      ? await schedulePushNotification(
          new Date(2026, 6, 28, 9, 0, 0),
          VAPID_KEY,
        )
      : await sendInstantTestPush(VAPID_KEY);

    notify(result.message);
  };

  const handleMouseEnter = (index: number, e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;

    setHoveredIndex(index);
    setLastActiveIndex(index); // Guardamos la última posición válida
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const getVerticalPosition = () => {

     if (lastActiveIndex === 0) return "translate-y-[12px]";
    if (lastActiveIndex === 1) return "translate-y-[64px]";

    return "translate-y-0";
  };

  const sharedTransitionClasses = `absolute transform ease-out
        transition-[transform,opacity] duration-300
        ${getVerticalPosition()}
        ${hoveredIndex !== null ? "opacity-0 [@media(hover:hover)]:opacity-100" : "opacity-0 pointer-events-none"}
      `;

  return (
    <div className="mx-3 max-w-3xl self-center">
      <div className="corner-bevel rounded-full border border-white/35 bg-linear-to-b py-2 mx-auto px-20 mb-3 self-center w-max flex justify-center items-center from-black to-blue-900">
        <Text variant="h4" font="menu" className="text-white uppercase">
          28 de julio
        </Text>
      </div>
      <div className="bg-linear-to-t border-t border-white/35 from-sky-950/80 to-slate-950/80 py-6 px-12 rounded-t-lg">
        <Text variant="p" font="menu" className="text-white mx-4 text-center">
          ¿Dónde quieres programar tu alerta?
        </Text>
      </div>
      <div className="bg-linear-to-b from-slate-800/80 to-slate-600/80 py-8 px-3 flex flex-col gap-2 relative">
        <ButtonAlarm
          onMouseEnter={(e: any) => handleMouseEnter(0, e)}
          onMouseLeave={handleMouseLeave}
          onClick={abrirGoogleCalendar}
        >
          En mi Google Calendar
        </ButtonAlarm>

        <ButtonAlarm
          onClick={handlePushNotify}
          onMouseEnter={(e: any) => handleMouseEnter(1, e)}
          onMouseLeave={handleMouseLeave}
        >
          Como Notificación Web
        </ButtonAlarm>

        <div
          className={clsx(
            "absolute  left-0 top-4 size-12 transition-all glove-animate-loop ",
            sharedTransitionClasses,
          )}
        >
          <img
            src="/images/Menu Glove.webp"
            className="w-full h-full"
            alt="indicator"
          />
        </div>

        <div
          className={clsx(
            "absolute  -right-1 -top-1 size-12 transition-all light-animate-loop",
            sharedTransitionClasses,
          )}
        >
          <div className="relative h-full w-full">
            <img
              src="/images/Menu Light.webp"
              className="size-6 absolute top-0 right-0"
              alt="indicator"
            />
          </div>
        </div>
      </div>
      <div className="bg-linear-to-t from-blue-700/80 to-blue-900/80 border-b border-black/85 py-6 px-10 rounded-b-lg">
        <Text
          variant="p"
          font="menu"
          className="text-sky-400 mx-4  text-shadow-black text-shadow-2xs"
        >
          Selecciona el método de tu preferencia.
        </Text>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

const ButtonAlarm = ({
  onMouseLeave,
  onMouseEnter,
  onClick,
  children,
}: {
  onMouseLeave?: any;
  onMouseEnter?: any;
  onClick?: any;
  children: string;
}) => {
  return (
    <button
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className="bg-linear-to-tr from-stone-600 to-black rounded-full text-center py-2 cursor-pointer hover:outline-2 outline-white/40"
    >
      <Text variant="span" font="menu" className="text-white mx-4 text-center">
        {children}
      </Text>
    </button>
  );
};

const abrirGoogleCalendar = (): void => {
  // 1. Datos del evento definidos manualmente
  const titulo = "Cumpleaños de Guillermo Paz";
  const descripcion = "Felicita hoy a Guillermo Paz en su día";

  const fechaInicio = new Date("2026-07-28T08:00:00");
  const fechaFin = new Date("2026-07-28T09:00:00");

  // 2. Helper para dar formato ISO a la fecha (YYYYMMDDTHHmmssZ)
  const formatGoogleDate = (date: Date): string => {
    return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
  };

  const startISO = formatGoogleDate(fechaInicio);
  const endISO = formatGoogleDate(fechaFin);

  // 3. Construcción de la URL
  const baseUrl = "https://calendar.google.com/calendar/render";

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: titulo,
    details: descripcion,
    dates: `${startISO}/${endISO}`,
  });

  // 4. Abrir en pestaña nueva
  const w = window.open(
    `${baseUrl}?${params.toString()}`,
    "_blank",
    "noopener,noreferrer",
  );

  notify("¡Alerta programada con éxito!");
};

const notify = async (message: string) => {
  const imgIcon = "/images/Ability.webp";

  const imgLogo = "/images/Sora Heart.webp";

  toast.custom(
    <div className="h-16 max-w-xl flex flex-row gap-4 pl-4  items-center bg-[linear-gradient(to_right,rgba(0,0,0,0.8)_0%,transparent_100%),linear-gradient(to_top,#900000_0%,#400000_35%,#000000_70%)] relative border-2 border-white rounded-r-3xl rounded-l-[5rem]  ">
      <img src={imgIcon} className="size-8" alt="icon" />
      <Text font="menu" className="text-white max-sm:text-xs">
        {message}
      </Text>

      <img src={imgLogo} className="size-15" alt="icon" decoding="async" />
    </div>,
    {
      id: "message",
    },
  );
};
