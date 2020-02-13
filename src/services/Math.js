function Clamp(number, min, max) {
  return Math.max(min, Math.min(number, max))
}

function percentage(total, value) {
  return (value / total) * 100;
}

export { Clamp, percentage }