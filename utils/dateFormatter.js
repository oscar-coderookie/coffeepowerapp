import { Timestamp } from "firebase/firestore";

/**
 * Formatea un Timestamp o Date de Firestore en:
 *  - fecha: DD/MM/AA
 *  - hora: HH:MM a.m./p.m.
 * @param {Timestamp | Date | string} fecha
 * @returns {{ date: string, time: string }}
 */
export function formatFirestoreDateCompact(fecha) {
  let dateObj;

  if (!fecha) return { date: "", time: "" };

  if (fecha instanceof Timestamp) {
    dateObj = fecha.toDate();
  } else if (fecha instanceof Date) {
    dateObj = fecha;
  } else {
    dateObj = new Date(fecha);
  }

  const date = dateObj.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    timeZone: "Europe/Madrid",
  });

  const time = dateObj.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Europe/Madrid",
  });

  return { date, time };
}
