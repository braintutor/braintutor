function createTimer(time, callback, callback_over) {
  let second = 1000
  let count = 0
  let interval = setInterval(() => {
    count += second
    callback(count / second)
    if (count >= time * second) {
      callback_over()
      clearInterval(interval)
    }
  }, second);
  return interval
}

export { createTimer }