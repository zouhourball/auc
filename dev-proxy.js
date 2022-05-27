const VG = require(`./build-profile.js`)

const vGAppFullUrl = VG.PRODUCT_APP_URL_API.replace(/"/g, '')
const vGAppUrl = vGAppFullUrl.replace(/^https?:\/\//, '')

const proxyConfig = {
  '/graphql': {
    target: vGAppFullUrl,
    ssl: {},
    secure: false,
    changeOrigin: true,
    headers: {
      Host: vGAppUrl,
      Origin: vGAppFullUrl,
    },
  },
  '/api/v1': {
    target: vGAppFullUrl,
    ssl: {},
    secure: false,
    changeOrigin: true,
    headers: {
      Host: vGAppUrl,
      Origin: vGAppFullUrl,
    },
  },
  '/fm': {
    target: vGAppFullUrl,
    ssl: {},
    secure: false,
    changeOrigin: true,
    headers: {
      Host: vGAppUrl,
      Origin: vGAppFullUrl,
    },
  },
}

module.exports = proxyConfig
