import { fetchJSON } from 'libs/fetch'
import { downloadFromBlob } from 'libs/utils/download-blob'

const appendFileToForm = (form, file) => {
  form.append('file', file)
  return form
}

export function fileManagerUpload (files, isPublic) {
  const uploadURL = `${PRODUCT_APP_URL_API}/fm/upload?bucket=${'upload'}&share_with=${
    isPublic ? 'sys:anonymous' : 'sys:authenticated'
  }&permission=${'view'}`
  const opts = {
    method: 'POST',
    isFormData: true,
    body: Array.isArray(files)
      ? files.reduce(appendFileToForm, new FormData())
      : appendFileToForm(new FormData(), files),
  }

  return fetchJSON(uploadURL, opts)
}
export async function fileDownload (URL, fileNameOnDownload) {
  const apiResponseBlob = await fetch(URL, {
    responseType: 'blob',
  }).then((response) => response.blob())

  downloadFromBlob(
    apiResponseBlob,
    fileNameOnDownload || URL.split('/').reverse()[0],
  )
}
export function fileManagerUploadPublic (files) {
  return fileManagerUpload(files, true)
}

export function getPublicUrl (fileID) {
  if (!fileID) {
    // This test is useful to enable shortcuts such as "src={getPublicUrl(cardData.pictureURL) || defaultCompanyLogo}"
    return null
  }
  return `${PRODUCT_APP_URL_API}/fm/download/${fileID}`
}

export function AvatarUpload (files, isPublic) {
  const uploadURL = `${PRODUCT_APP_URL_API}/fm/upload?bucket=${'upload'}&share_with=sys:anonymous,sys:authenticated&permission=${'view'}`
  const opts = {
    method: 'POST',
    isFormData: true,
    body: Array.isArray(files)
      ? files.reduce(appendFileToForm, new FormData())
      : appendFileToForm(new FormData(), files),
  }

  return fetchJSON(uploadURL, opts)
}
