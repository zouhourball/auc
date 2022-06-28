import './style.scss'
const AuctionTimer = ({ time, bid, minIncrement, label, iActive = true }) => {
  const { days, hours, minutes, secondes } = time
  return (
    <div className={`auction-timer ${iActive ? 'active' : ''}`}>
      <div className="timer">
        <span>{days} D</span>
        <span> : </span>
        <span>{hours} H </span>
        <span>:</span>
        <span>{minutes} M </span>
        <span>:</span>
        <span>{secondes} S</span>
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
          <div>Minimum Increment</div>
        </div>
      </div>
    </div>
  )
}

export default AuctionTimer
