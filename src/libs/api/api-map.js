import { fetchJSON } from 'libs/fetch'
// import { stringify } from 'querystring'
const appUrl =
  process.env.NODE_ENV === 'production' ? PRODUCT_APP_URL_TROVE : '/'

export const transformPoints = async (params) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}spatial/api/v1/transform/bulk/points`, {
      method: 'POST',
      body: JSON.stringify(params),
    })
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}
export const transformAllPoints = (key, params) => {
  return Promise.all(
    params.map((elem) => {
      return fetchJSON(`${appUrl}spatial/api/v1/transform/bulk/points`, {
        method: 'POST',
        body: JSON.stringify(elem),
      })
    }),
  ).then((res) => {
    return res
  })
}
export const checkIntersections = async (params) => {
  let res
  try {
    res = await fetchJSON(
      `${PRODUCT_APP_URL_MAP}/spatial/api/v1/wfs/readjson`,
      {
        method: 'POST',
        body: JSON.stringify(params),
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}
