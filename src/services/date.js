function toDateString(date) {
  return date.toLocaleString("es-ES", {
    // weekday: 'short', // "Sat"
    day: "2-digit", // "15"
    month: "long", // "junio"
    year: "numeric", // "1997"
  });
}

function toDateTimeString(date, long = true) {
  return date.toLocaleString("es-ES", {
    // weekday: 'short', // "Sat"
    day: "2-digit", // "15"
    month: long ? "long" : "2-digit", // "junio"
    year: "numeric", // "1997"
    hour: "2-digit",
    minute: "2-digit",
  });
}

export { toDateString, toDateTimeString };
