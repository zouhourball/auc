export function downloadFromBlob (blob, name) {
  let a = document.createElement('a')
  let url = window.URL.createObjectURL(blob)
  a.href = url
  a.download = name
  a.click()
  window.URL.revokeObjectURL(url)
}
