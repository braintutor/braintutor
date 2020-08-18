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

function dateFormatShort(date) {
  date = new Date(date);
  let day = format_two_digits(date.getDate());
  let month = format_two_digits(date.getMonth() + 1);
  let year = date.getFullYear();
  date = `${day}/${month}/${year}`;
  return date;
}

function format_two_digits(n) {
  return n < 10 ? "0" + n : n;
}

export { dateFormat, dateFormatShort, format_two_digits };
