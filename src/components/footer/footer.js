import './style.scss'
import { useTranslation } from 'react-i18next'

const { t } = useTranslation()
const Footer = () => {
  return (
    <div className="footer">
      <div onClick={() => {}} className="footer-logo">
        LOGO
      </div>
      <div className="footer-right">
        <div onClick={() => {}}>{t('download_app')}</div>
        <div onClick={() => {}}> {t('privacy_policy')}</div>
        <div onClick={() => {}}>{'terms_condition'}</div>
        <div onClick={() => {}}> {t('contact_us')}</div>
      </div>
    </div>
  )
}

export default Footer
