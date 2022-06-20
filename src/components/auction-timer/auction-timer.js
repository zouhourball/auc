import './style.scss'
const AuctionTimer = ({ time, bid, minIncrement, label }) => {
  const { days, hours, minutes, secondes } = time
  return (
    <div className="auction-timer">
      <div className="timer">
        <h1>{`${days} D : ${hours} H : ${minutes} M : ${secondes} S`}</h1>
      </div>
      <div className="footer">
        <div className="my-bid">
          <h1>{bid} AED</h1>
          <h1>{label}</h1>
        </div>
        <div className="mine-increment">
          <h1>{minIncrement} AED</h1>
          <h1>Minimum Increment</h1>
        </div>
      </div>
    </div>
  )
}

export default AuctionTimer
