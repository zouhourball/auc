import {
  Provider,
  createTinyI18NWrapper,
} from '@target-energysolutions/tiny-i18n'
import * as React from 'react'
import { fetchJSON } from 'libs/fetch'

import { getLanguage, setLanguage } from 'libs/utils/language'

export const { Wrapper, withTranslation, useTranslation } =
  createTinyI18NWrapper({
    productName: 'auctions-fe',
    translateVersion: 'v1',
  })

const ctx = React.createContext({
  change: () => 0,
  lang: 'en',
})

export function useChangeLanguage () {
  return React.useContext(ctx).change
}
export function useCurrentLang () {
  return React.useContext(ctx).lang
}
export function withTranslationEx (Com) {
  function TransEx (props) {
    const { t } = useTranslation()
    const lang = useCurrentLang()
    const change = useChangeLanguage()
    return <Com {...props} t={t} lang={lang} changeLanguage={change} />
  }
  return TransEx
}

function defaultLang () {
  const lang = getLanguage()
  if (lang === 'zh') {
    return 'zh-CN'
  }
  if (lang === 'en') {
    return 'en-US'
  }
  return lang || 'en-US'
}
export function LangProvider ({ children }) {
  const [lang, changeLang] = React.useState(defaultLang())
  const change = React.useCallback((lang) => {
    setLanguage(lang)
    if (lang === 'ar') {
      document.dir = 'rtl'
    } else {
      document.dir = 'ltr'
    }
    changeLang(lang)
  }, [])
  React.useEffect(() => {
    if (defaultLang() === 'en-US') {
      document.dir = 'ltr'
    }
  }, [])

  return (
    <ctx.Provider
      value={{
        lang: lang,
        change,
      }}
    >
      <Provider language={lang} i18nServiceEndpoint={PRODUCT_APP_URL_LANG}>
        <Wrapper>{children}</Wrapper>
      </Provider>
    </ctx.Provider>
  )
}
export function useSupportedLangs () {
  const [langs, setLangs] = React.useState([
    {
      key: 'en-US',
      label: 'English',
      name: 'English',
    },
    {
      key: 'zh-CN',
      label: '中文',
      name: '中文',
    },
    {
      key: 'fr',
      label: 'Français',
      name: 'Français',
    },
    {
      key: 'ar',
      label: 'العربية',
      name: 'العربية',
    },
  ])
  React.useEffect(() => {
    fetchJSON(`${PRODUCT_APP_URL_LANG}/rest/languages/v1/auctions-fe`).then(
      (resp) => {
        if (resp.success) {
          setLangs(
            resp.data.map((i) => ({
              key: i.code,
              label: i.text,
              name: i.text,
            })),
          )
        }
      },
    )
  }, [])

  return langs
}
