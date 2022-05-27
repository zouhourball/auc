// @ts-check
export function constructAvatarURL (/** @type {string} */ src) {
  if (!src) {
    // Don't construct wrong URL, because some component will show a broken img for it
    return ''
  }
  if (src.startsWith('http')) {
    return src
  }
  if (src.startsWith('/download')) {
    // @ts-ignore
    return `${PRODUCT_APP_URL_API}/fm${src}`
  } else {
    // @ts-ignore
    return `${PRODUCT_APP_URL_API}/fm/download/${src}`
  }
}
