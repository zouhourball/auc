import { fetchJSON } from 'libs/fetch'

const appUrl = `${PRODUCT_APP_URL_API}/auction`

// FILTER AUCTIONS
export const filterAuctions = async ({ queryKey }) => {
  const params = Object.keys(queryKey[1])
    .filter((key) => typeof queryKey[1][key] === 'number' || !!queryKey[1][key])
    .map((key) => `${key}=${queryKey[1][key]}`)
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/api/v1/filter/auctions${
        params.length ? `?${params.join('&')}` : ''
      }`,
      {
        method: 'POST',
        body: JSON.stringify(queryKey[2]),
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

// FILTER MY AUCTIONS THAT I PARTICIPATED IN
export const getMyAuctions = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/api/v1/filter/auctions/for-participant-member?auction_filter=${queryKey[2]}`,
      {
        method: 'POST',
        body: JSON.stringify(queryKey[1]),
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
// GET MY AUCTIONS
export const myAuctions = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/api/v1/my-auctions`, {
      method: 'GET',
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
// GET AUCTIONS BY PARTICIPANT
export const participantAuctions = async ({ body }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/api/v1/filter/auctions/for-participant-member`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
// CHECK IF PARTICIPANT
export const checkParticipant = async ({ queryKey }) => {
  let res

  try {
    res = await fetchJSON(
      `${appUrl}/api/v1/auctions/${queryKey[1]}/is-participant`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
// LIST AUCTIONs
export const listAuction = async ({ queryKey }) => {
  let res
  // &search_key=${'auctionspecialzouhour'}
  try {
    res = await fetchJSON(
      `${appUrl}/api/v1/auctions?auction_status=${queryKey[1]}&limit=${queryKey[2]}`,
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
export const auctionsRequest = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/api/v1/auctions/requests?q=${queryKey[1]}&auction_status=${queryKey[2]}`,
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
export const featuredAuctions = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/api/v1/featured/auctions?auction_status=${queryKey[1]}&limit=${queryKey[2]}`,
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
export const auctionProperty = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/api/v1/auctions/${queryKey[1]}/property`, {
      method: 'GET',
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
// GET FEATURED AUCTION'S PROPERTY
export const auctionFeaturedProperty = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/api/v1/featured/auctions/${queryKey[1]}/property`,
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
// export const payAuction = async ({ uuid, host }) => {
//   let res
//   try {
//     res = await fetchJSON(`${appUrl}/api/v1/auctions/${uuid}?host=${host}`, {
//       method: 'POST',
//     })
//   } catch (e) {
//     res = { error: e }
//   }
//   return res
// }
// PAY AUCTION SUCCESS CALLBACK
// export const payAuctionSuccess = async ({ trackID }) => {
//   let res
//   try {
//     res = await fetchJSON(
//       `${appUrl}/api/v1/auctions/pay/success/callback/${trackID}`,
//       {
//         method: 'GET',
//       },
//     )
//   } catch (e) {
//     res = { error: e }
//   }
//   return res
// }
// PAY AUCTION FAIL CALLBACK
// export const payAuctionFail = async ({ trackID, error }) => {
//   let res
//   try {
//     res = await fetchJSON(
//       `${appUrl}/api/v1/auctions/pay/success/callback/${trackID}/${error}`,
//       {
//         method: 'GET',
//       },
//     )
//   } catch (e) {
//     res = { error: e }
//   }
//   return res
// }
// GET AUCTION BY UUID
export const getAuction = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/api/v1/auctions/${queryKey[1]}`, {
      method: 'GET',
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
// GET FEATURED AUCTION BY UUID
export const getFeaturedAuction = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/api/v1/featured/auctions/${queryKey[1]}`, {
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
export const approveAuction = async ({ uuid, status }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/api/v1/auctions/${uuid}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
// SAVE AS FAVOURITE
export const saveAsFav = async ({ uuid }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/api/v1/auctions/${uuid}/save-as-fav`, {
      method: 'PUT',
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

// UNSAVE AS FAVOURITE
export const unsaveAsFav = async ({ uuid }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/api/v1/auctions/${uuid}/unsave-as-fav`, {
      method: 'PUT',
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const updateImgs = async ({ uuid, body }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/api/v1/auctions/${uuid}/images`, {
      method: 'PUT',
      body: JSON.stringify({ images: body }),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
// GET SAVED AUCTIONS
export const savedAuctions = async () => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/api/v1/auctions/saved`, {
      method: 'GET',
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
// GET GOVERNORATES
export const getGovernorates = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/api/v1/governorates`, {
      method: 'GET',
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

// GET WILAYATS

export const getWilayats = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/api/v1/wilayats`, {
      method: 'GET',
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
// get country

export const getCountry = async ({ queryKey, pageParam = 0 }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/api/v1/countries?page=${pageParam}&limit=${queryKey[0]}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const getCity = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/api/v1/countries/${queryKey[1]}/cities`, {
      method: 'GET',
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
