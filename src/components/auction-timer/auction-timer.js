import './style.scss'
import { useTranslation } from 'react-i18next'

const AuctionTimer = ({ time, bid, minIncrement, label, iActive = true }) => {
  const { t } = useTranslation()
  const { days, hours, minutes, secondes } = time
  return (
    <div className={`auction-timer ${iActive ? 'active' : ''}`}>
      <div className="timer">
        <span>
          {days}
          {t('D')}
        </span>
        <span> : </span>
        <span>
          {hours} {t('H')}{' '}
        </span>
        <span>:</span>
        <span>
          {minutes} {t('M')}{' '}
        </span>
        <span>:</span>
        <span>
          {secondes} {t('S')}
        </span>
      </div>
      <div className="auction-timer-details">
        <div className="auction-timer-info">
          <div>
            <strong className={iActive ? 'active' : ''}>{bid} AED</strong>
          </div>
          <div>{label}</div>
        </div>
        <div className="sep" />
        <div className="auction-timer-info">
          <div>
            <strong>{minIncrement} AED</strong>
          </div>
          <div>{t('minimum_incr')}</div>
        </div>
      </div>
    </div>
  )
}

export default AuctionTimer
