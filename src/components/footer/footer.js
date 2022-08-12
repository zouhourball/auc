import './style.scss'
import { useTranslation } from 'libs/langs'

const Footer = () => {
  const { t } = useTranslation()

  return (
    <div className="footer">
      <div onClick={() => {}} className="footer-logo">
        ZEED
      </div>
      <div className="footer-right">
        <div onClick={() => {}}>{t('download_app')}</div>
        <div onClick={() => {}}> {t('privacy_policy')}</div>
        <div onClick={() => {}}>{t('terms_condition')}</div>
        <div onClick={() => {}}> {t('contact')}</div>
      </div>
    </div>
  )
}

export default Footer
