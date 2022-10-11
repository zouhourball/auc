import { fetchJSON } from 'libs/fetch'

// import { encode as btoa } from 'base-64'

const appUrl = `${PRODUCT_APP_URL_API}/auction`

// FILTER AUCTIONS
export const filterAuctions = async ({ queryKey }) => {
  const params = Object.keys(queryKey[1])
    .filter((key) => typeof queryKey[1][key] === 'number' || !!queryKey[1][key])
    .map((key) => `${key}=${queryKey[1][key]}`)
  const arrayParams = Object.keys(queryKey[3])
    .filter((key) => !!queryKey[3][key])
    .map((key) => `${key}=${queryKey[3][key].map((el) => el)}`)
    .flatMap((el) => el)

  let res

  try {
    res = await fetchJSON(
      `${appUrl}/api/v1/filter/auctions${
        params.length ? `?${params.join('&')}` : ''
      }${
        arrayParams.length
          ? `${!params.length ? '?' : '&'}${arrayParams.join('&')}`
          : ''
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
export const filterFeatureAuctions = async ({ queryKey }) => {
  const params = Object.keys(queryKey[1])
    .filter((key) => typeof queryKey[1][key] === 'number' || !!queryKey[1][key])
    .map((key) => `${key}=${queryKey[1][key]}`)

  const arrayParams = Object.keys(queryKey[3])
    .filter((key) => !!queryKey[3][key])
    .map((key) => `${key}=${queryKey[3][key].map((el) => el)}`)
    .flatMap((el) => el)
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/api/v1/featured/filter/auctions${
        params.length ? `?${params.join('&')}` : ''
      }${
        arrayParams.length
          ? `${!params.length ? '?' : '&'}${arrayParams.join('&')}`
          : ''
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
    res = await fetchJSON(
      `${appUrl}/api/v1/my-auctions?auction_status=${queryKey[2]}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const allBrokers = async () => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/api/v1/brokers`, {
      method: 'GET',
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const allBrokersDetails = async () => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/api/v1/brokers-details`, {
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
      `${appUrl}/api/v1/auctions/requests?q=${queryKey[1]}&auction_status=${queryKey[2]}&limit=${queryKey[3]?.limit}&offset=${queryKey[3]?.offset}`,
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
      headers: {
        'Cache-Control': 'no-cache',
      },
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
// GET ALL LOCATIONS
export const allLocations = async () => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/api/v1/locations`, {
      method: 'GET',
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
// UPDATE AUCTION BY UUID ps: not approved
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
// UPDATE AUCTION BY UUID ps: approved
export const updateApprovedAuction = async ({ uuid, body }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/api/v1/approved-auctions/${uuid}`, {
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
      `${appUrl}/api/v1/countries?page=${pageParam}&limit=${
        queryKey[0]
      }&search_key=${queryKey[1] || ''}`,
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
    res = await fetchJSON(
      `${appUrl}/api/v1/countries/${queryKey[1]}/cities?search_key=${queryKey[2]}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
// REGISTER BIDDER
// ${base64.encode('nz-mdr:DzXZxyDObSpsnR7qLqQ4p1LEVoIiE49e')}
export const registerBidder = async ({ body }) => {
  return fetch(`${OAUTH_HOST}/api/register`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(
        `${OAUTH_CLIENT_ID}:${OAUTH_CLIENT_SECRET}`,
      )}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(async (response) => {
    const res = await response.json()

    if (response.status !== 200 && response.status !== 201) {
      throw res
    }
    return res
  })
}

export const genUploadToken = async ({ queryKey }) => {
  return fetch(
    `${PRODUCT_APP_URL_CONFIGURATOR}/v2/org/gen-upload-token?action=${queryKey[1]}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ).then(async (response) => {
    const res = await response.json()

    if (response.status !== 200 && response.status !== 201) {
      throw res
    }
    return res
  })
}

export const registerBroker = async ({ body }) => {
  let res
  try {
    res = await fetchJSON(`${PRODUCT_APP_URL_CONFIGURATOR}/v2/org`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const sendVerifiedCode = async ({ body }) => {
  let res
  try {
    res = await fetchJSON(`${OAUTH_CALLBACK_HOST}/api/v1/send-verified-code`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const checkVerifiedCode = async ({ body }) => {
  let res
  try {
    res = await fetchJSON(`${OAUTH_CALLBACK_HOST}/api/v1/check-verified-code`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const updatePassword = async ({ body }) => {
  let res
  try {
    res = await fetchJSON(`${OAUTH_HOST}/update-password`, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const updateEmail = async ({ body }) => {
  let res
  try {
    res = await fetchJSON(`${OAUTH_HOST}/update-email`, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const getFeaturedAuctionRemainingTime = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/api/v1/featured/auctions/${queryKey[1]}/remaining-time`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const getApprovals = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${PRODUCT_APP_URL_CONFIGURATOR}/v2/org/approvals?limit=${queryKey[1]?.limit}&offset=${queryKey[1]?.offset}&sortBy=status&sortType=desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const approveRejectBroker = async ({ orgId, apply }) => {
  let res
  try {
    res = await fetchJSON(
      `${PRODUCT_APP_URL_CONFIGURATOR}/v2/org/approval/${orgId}`,
      {
        method: 'POST',
        body: JSON.stringify({ apply }),
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
