import { getAccessToken } from 'utils/manageTokens'
import html2canvas from 'html2canvas'
import JsPDF from 'jspdf'

export function getPublicUrl (fileID) {
  if (!fileID) {
    // This test is useful to enable shortcuts such as "src={getPublicUrl(cardData.pictureURL) || defaultCompanyLogo}"
    return null
  } else if (fileID?.indexOf('/download') === 0) {
    return `${PRODUCT_APP_URL_API}/fm${fileID}`
  }
  return `${PRODUCT_APP_URL_API}/fm/download/${fileID}`
}

export function getPublicUrlWithToken (fileID) {
  if (!fileID) {
    // This test is useful to enable shortcuts such as "src={getPublicUrl(cardData.pictureURL) || defaultCompanyLogo}"
    return null
  }
  return `${PRODUCT_APP_URL_API}/fm/download/${fileID}?access_token=${getAccessToken()}`
}

export function getDomain (url, subdomain = false) {
  if (!url) {
    return
  }

  url = url.replace(/(https?:\/\/)?(www.)?/i, '')

  if (!subdomain) {
    url = url.split('.')

    url = url.slice(url.length - 2).join('.')
  }

  if (url.indexOf('/') !== -1) {
    return url.split('/')[0]
  }

  return url
}
export function isCreator (subject1, subject2) {
  return subject1 === subject2
}
export function endDateReached (endDate) {
  let today = new Date()
  today = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()),
  )
  return today.getTime() > new Date(endDate).getTime()
}
export function isProd () {
  if (process.env.NODE_ENV === 'production') return true
  else return false
}

export function transformUsers (users) {
  return users.map((el) => ({
    ...el,
    name: el.username,
    key: el.subject,
    subject: el.subject,
    avatar: getPublicUrl(el.pictureURL),
    secondary: el.email || 'n/a',
    userID: el.subject,
    endorsed: true,
  }))
}

export function matchSkills (arr1, arr2) {
  if (!arr1 || !arr2 || arr1.length === 0 || arr2.length === 0) {
    return false
  }
  const uncommon = arr2.filter((m) =>
    arr1.find((k) => k.skillName !== m.skillName),
  )
  return uncommon.length === 0
}

export function validURL (str) {
  var regex =
    /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i
  if (!regex.test(str)) {
    return false
  } else {
    return true
  }
}

export const flatten = (arr) => {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(
      Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten,
    )
  }, [])
}

export const formDataBody = (body) => {
  let newBody = new FormData()
  for (const [key, value] of Object.entries(body)) {
    newBody.append(key, value)
  }
  return newBody
}

export const addPageToPdf = async (dataTable) => {
  let canvas = {}
  let pdf = {}
  let numberOfPages = parseInt(dataTable.body.length / 50) + 1
  for (let index = 0; index < numberOfPages; index++) {
    canvas = await html2canvas(
      document.getElementById('data-table-container' + index),
      {
        scale: 1,
      },
    )
    var ctx = canvas.getContext('2d')
    ctx.mozImageSmoothingEnabled = false
    ctx.webkitImageSmoothingEnabled = false
    ctx.msImageSmoothingEnabled = false
    ctx.imageSmoothingEnabled = false
    const imgData = canvas.toDataURL('image/png')
    const pageWidth = canvas.width
    const imgWidth = canvas.width
    const pageHeight = canvas.height
    const imgHeight = canvas.height
    if (index === 0) {
      pdf = new JsPDF(pageWidth > pageHeight ? 'l' : 'p', 'px', [
        pageWidth,
        pageHeight,
      ])
    } else {
      pdf.addPage([pageWidth, pageHeight], pageWidth > pageHeight ? 'l' : 'p')
    }
    // pdf = new JsPDF(pageWidth > pageHeight ? 'l' : 'p', 'px', [
    //   pageWidth,
    //   pageHeight,
    // ])
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, null, 'FAST')
  }
  return pdf
}
