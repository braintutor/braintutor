// TODO [DEPRECATED]
function dateFormat(date) {
  date = new Date(date);
  let day = format_two_digits(date.getDate());
  let month = format_two_digits(date.getMonth() + 1);
  let year = date.getFullYear();
  let hours = format_two_digits(date.getHours());
  let minutes = format_two_digits(date.getMinutes());
  date = `${day}/${month}/${year} ${hours}:${minutes}`;
  return date;
}

// TODO [DEPRECATED]
function dateFormatShort(date) {
  date = new Date(date);
  let day = format_two_digits(date.getDate());
  let month = format_two_digits(date.getMonth() + 1);
  let year = date.getFullYear();
  date = `${day}/${month}/${year}`;
  return date;
}

// TODO [DEPRECATED]
function format_two_digits(n) {
  return n < 10 ? "0" + n : n;
}

function toDateString(date) {
  return date.toLocaleString("es-ES", {
    // weekday: 'short', // "Sat"
    day: "2-digit", // "15"
    month: "long", // "junio"
    year: "numeric", // "1997"
  });
}

function toDateTimeString(date, long=true) {
  return date.toLocaleString("es-ES", {
    // weekday: 'short', // "Sat"
    day: "2-digit", // "15"
    month: long? "long": "2-digit", // "junio"
    year: "numeric", // "1997"
    hour: "2-digit",
    minute: "2-digit",
  });
}

export {
  dateFormat,
  dateFormatShort,
  format_two_digits,
  toDateString,
  toDateTimeString,
};
