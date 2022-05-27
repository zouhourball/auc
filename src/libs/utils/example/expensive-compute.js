export function expensiveCompute (num) {
  const count = num * 100
  let result = 1
  for (let i = 0; i < count * count; i++) {
    if (i % 2 === 0) {
      result = result + i * i * num
    } else {
      result = result - i * i * num
    }
  }
  return result
}
