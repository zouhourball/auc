const VG = require(`./build-profile.js`)

const vGAppFullUrl = VG.PRODUCT_APP_URL_API.replace(/"/g, '')
const vGAppUrl = vGAppFullUrl.replace(/^https?:\/\//, '')
const ssoHost = 'https://sso.test.meeraspace.com'

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
  '/api/register': {
    target: ssoHost,
    ssl: {},
    secure: false,
    changeOrigin: true,
    headers: {
      Host: ssoHost.replace(/^https?:\/\//, ''),
      Origin: ssoHost,
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
