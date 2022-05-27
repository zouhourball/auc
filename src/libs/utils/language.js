import { getCookie, setCookie } from 'tiny-cookie'

const LANUAGE_KEY = 'language'

const curHost = window.location.hostname
const tokenDomainHost = new URL(`${TOKEN_DOMAIN || ''}` || window.location.href)
  .hostname
const isSubDomain = (curHost || '').includes(tokenDomainHost)
const domain = isSubDomain ? tokenDomainHost : curHost

export const getLanguage = () => {
  return getCookie(LANUAGE_KEY)
}

export const setLanguage = (language) => {
  return setCookie(LANUAGE_KEY, language, {
    domain,
  })
}
