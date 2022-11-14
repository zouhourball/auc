import { fetchJSON } from 'libs/fetch'

// import { encode as btoa } from 'base-64'

const appUrl = `${PRODUCT_APP_URL_API}/auction`

export const addAvailability = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/api/v1/auctions/${queryKey[1]}/viewing-appointments/availabilities`,
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
export const sendAppointmentsRequest = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/api/v1/auctions/${queryKey[1]}/viewing-appointments/requests`,
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
export const getAvailability = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/api/v1/auctions/${queryKey[1]}/viewing-appointments/availabilities`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const getAvailabilitiesConfig = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/api/v1/auctions/${queryKey[1]}/viewing-appointments/availabilities/config`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const getAppointmentsRequest = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/api/v1/auctions/${queryKey[1]}/viewing-appointments/requests`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const getRequestsForBroker = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/api/v1/auctions/${queryKey[1]}/viewing-appointments/requests-for-broker`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const getRequestsForBrokerCalendar = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/api/v1/auctions/${queryKey[1]}/viewing-appointments/requests-for-broker/calendar`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const getAppointmentRequest = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/api/v1/auctions/${queryKey[1]}/viewing-appointments/requests/${queryKey[2]}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const updateRequest = async ({ uuid, reqUuid, body }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/api/v1/auctions/${uuid}/viewing-appointments/requests/${reqUuid}`,
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const approveRequest = async ({ uuid, reqUuid }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/api/v1/auctions/${uuid}/viewing-appointments/requests/${reqUuid}/approve`,
      {
        method: 'PUT',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const rescheduleRequest = async ({ uuid, reqUuid }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/api/v1/auctions/${uuid}/viewing-appointments/requests/${reqUuid}/reschedule`,
      {
        method: 'PUT',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const cancelRequest = async ({ uuid, reqUuid }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/api/v1/auctions/${uuid}/viewing-appointments/requests/${reqUuid}/cancel`,
      {
        method: 'PUT',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const rejectRequest = async ({ uuid, reqUuid }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/api/v1/auctions/${uuid}/viewing-appointments/requests/${reqUuid}/reject`,
      {
        method: 'PUT',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const enableAppointments = async ({ uuid }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/api/v1/auctions/${uuid}/viewing-appointments/enable`,
      {
        method: 'PUT',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const disableAppointments = async ({ uuid }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/api/v1/auctions/${uuid}/viewing-appointments/disable`,
      {
        method: 'PUT',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
