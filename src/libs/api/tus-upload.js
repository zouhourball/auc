import * as cookies from 'tiny-cookie'
import * as tus from 'tus-js-client'
import { downloadFromBlob } from 'libs/utils/download-blob'

import store from 'libs/store'
// let headers = s.defaultOptions.headers = headers

export function uploadFileTus (
  file,
  onError,
  onSuccess,
  onProgress,
  auth = true,
) {
  const fileToken =
    store?.getState()?.query?.DEFAULT?.getFSToken?.data?.['file_token']
  let token
  if (auth && process.env.NODE_ENV !== 'production') {
    token = localStorage.getItem('access_token')
  } else {
    token =
      cookies.get('__Secure-id_token') || cookies.get('__Secure-access_token')
  }
  // console.log('token', token)
  return new Promise(function (resolve, reject) {
    // function onSuccess() {
    //   resolve('I am done')
    // }
    // function onError(error) {
    //   reject(error)
    // }
    const upload = new tus.Upload(file, {
      endpoint: `${PRODUCT_APP_URL_API}/meerastorage/files/`,
      //   fingerprint: () => `${encodeMetadata(metadata)}`,
      metadata: {
        filename: file.name,
        filetype: file.type,
      },
      headers: {
        'X-Meera-Storage-Token': `Bearer ${fileToken}`, // TOKEN is from your backend(e.g: meeting backend).
        Authorization: `Bearer ${token}`, // Required if the `auth` in the
        // X-Meera-Storage-Token is true.
      },
      retryDelays: [0, 3000, 5000, 10000],
      onError: (err) => {
        const error = JSON.parse(err?.originalResponse?._xhr?.response)
        reject(onError(error))
      },

      onProgress,
      onSuccess: function () {
        resolve(onSuccess(upload))
      },
      removeFingerprintOnSuccess: true,
      //   headers: {
      //     ...headers,
      //     'Tus-Upload-Metadata': encodeMetadata(metadata),
      //   },
    })
    upload.start()
  })
}
export function encodeMetadata (metadata) {
  var encoded = []
  for (var key in metadata) {
    // eslint-disable-next-line
    encoded.push(key + ' ' + Base64.encode(metadata[key]))
  }
  return encoded.join(',')
}
export async function fileDownloadTus (URL, fileNameOnDownload, dlToken) {
  let token
  if (process.env.NODE_ENV !== 'production') {
    token = localStorage.getItem('access_token')
  } else {
    token =
      cookies.get('__Secure-id_token') || cookies.get('__Secure-access_token')
  }
  const apiResponseBlob = await fetch(
    `${PRODUCT_APP_URL_API}/meerastorage/files/${URL}?token=${dlToken}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  ).then((response) => response.blob())
  // let res
  // try {
  //   res = await fetchJSON(`${URL}?token=${dlToken}`, {
  //     method: 'GET',
  //   })
  //   downloadFromBlob(
  //     res.blob(),
  //     fileNameOnDownload || URL.split('/')[6],
  //   )
  // } catch (e) {
  //   res = { error: e }
  // }
  // return res
  downloadFromBlob(apiResponseBlob, fileNameOnDownload || URL.split('/')[6])
}
