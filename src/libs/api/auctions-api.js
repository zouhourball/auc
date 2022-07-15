import { fetchJSON } from 'libs/fetch'

const appUrl = `${PRODUCT_APP_URL_API}/auction`

// FILTER AUCTIONS
export const filterAuctions = async ({ body }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/api/v1/filter/auctions`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
// AWARD AUCTION BY UUID
export const awardAuction = async ({ uuid, body }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/api/v1/auctions/${uuid}/award`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
// PUBLISH AUCTION
export const publishAuction = async ({ body }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/api/v1/auctions`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

// CREATE NEW AUCTION
export const saveAuction = async ({ body }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/api/v1/auctions/save`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

// LIST AUCTIONs
export const listAuction = async ({ searchKey, status }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/api/v1/auctions?q=${searchKey}&auction_status=${status}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
// AUCTIONS REQUESTS
export const auctionsRequest = async ({ searchKey, status }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/api/v1/auctions/requests?q=${searchKey}&auction_status=${status}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
// FEATURED AUCTIONS
export const featuredAuctions = async ({ searchKey, endingSoon }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/api/v1/featured/auctions/requests?q=${searchKey}&ending_soon=${endingSoon}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
// GET AUCTION'S PROPERTY
export const auctionProperty = async ({ uuid }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/api/v1/auctions/${uuid}/property`, {
      method: 'GET',
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
// GET FEATURED AUCTION'S PROPERTY
export const auctionFeaturedProperty = async ({ uuid }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/api/v1/featured/auctions/${uuid}/property`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
// PAY AUCTION
export const payAuction = async ({ uuid, host }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/api/v1/auctions/${uuid}?host=${host}`, {
      method: 'GET',
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
// PAY AUCTION SUCCESS CALLBACK
export const payAuctionSuccess = async ({ trackID }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/api/v1/auctions/pay/success/callback/${trackID}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
// PAY AUCTION FAIL CALLBACK
export const payAuctionFail = async ({ trackID, error }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/api/v1/auctions/pay/success/callback/${trackID}/${error}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
// GET AUCTION BY UUID
export const getAuction = async ({ uuid }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/api/v1/auctions/${uuid}`, {
      method: 'GET',
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
// GET FEATURED AUCTION BY UUID
export const getFeaturedAuction = async ({ uuid }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/api/v1/featured/auctions/${uuid}`, {
      method: 'GET',
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
// AUCTION BID HISTORY
export const getAuctionBidHistory = async ({ uuid }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/api/v1/auctions/${uuid}/history`, {
      method: 'GET',
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

// UPDATE AUCTION BY UUID
export const updateAuction = async ({ uuid, body }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/api/v1/auctions/${uuid}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
// APPROVE AUCTION BY UUID
export const approveAuction = async ({ uuid, body }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/api/v1/auctions/${uuid}/approve`, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
