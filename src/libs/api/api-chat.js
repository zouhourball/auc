import { getAuthToken } from 'libs/utils/oauth-token'

// export const jwtClaims = (jwt) => {
//   if (!jwt) throw new Error('not Logged in, probably a bug, try refresh')
//   const parts = jwt.split('.')
//   if (!parts) {
//     throw new Error('not logged in')
//   }
//   if (parts.length < 3) {
//     throw new Error('invalid access token')
//   }
//   const claims = JSON.parse(window.atob(parts[1]))
//   return claims
// }
export const connectWebsocket = (onMessage) => {
  const token = getAuthToken()
  const url = `${PRODUCT_APP_URL_API_WEBSOCKET}/chat/ws?access_token=${token}`
  // get userinfo
  // let me
  try {
    // me = jwtClaims(token)
  } catch (e) {
    return Promise.reject(new Error('invalid claim: ' + e.message))
  }
  let connRef = {}
  return new Promise((resolve, reject) => {
    try {
      ;(function initWebSocket () {
        const c = new WebSocket(url)
        // console.log(c, 'newEvent c')
        c.onmessage = function (e) {
          onMessage(e.data)
        }

        c.onopen = function () {
          const send = (channel, text, orgId) => {
            // console.log(channel, text, 'newEvent send')
            // sendMessage(connRef, channel, text, me, orgId)
          }
          resolve(send)
        }
        c.onerror = function (e) {
          reject(new Error('websocket error'))
        }
        c.onclose = function () {
          initWebSocket()
        }
        connRef.conn = c
      })()
    } catch (e) {
      reject(e)
    }
  })
}
// const sendMessage = ({ conn }, channel, text, me, orgId) => {
//   const textContent = {
//     raw: {
//       blocks: [
//         {
//           key: 'test',
//           text,
//           type: 'unstyled',
//           depth: 0,
//           inlineStyleRanges: [],
//           entityRanges: [],
//           data: {},
//         },
//       ],
//       entityMap: {},
//     },
//     mentionUsers: {},
//     prodName: 'elevate',
//   }
//   const payload = {
//     channelId: channel,
//     content: {
//       text: JSON.stringify(textContent),
//     },
//     productName: 'elevate',
//     createdAt: new Date(),
//     sentBy: me,

//     // workspaceId: null,
//     // workspaceName: null,
//     // orgId: parseInt(orgId),
//   }
//   conn.send(JSON.stringify(payload))
// }
