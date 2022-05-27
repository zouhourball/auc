import { getCookie } from 'tiny-cookie'

export const getAccessToken = () => {
  const accessToken =
    process.env.NODE_ENV !== 'production'
      ? localStorage.getItem('access_token')
      : getCookie('__Secure-id_token') || getCookie('__Secure-access_token')
  return accessToken
}
