module.exports = async function delay(min = 1000, max = 4000) {
  const time = Math.random() * (max - min) + min
  return new Promise(res => setTimeout(res, time))
}
