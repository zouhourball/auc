import './style.scss'
const AuctionTimer = ({ time, myBid, minIncrement }) => {
  const { days, hours, minutes, seconds } = time
  return (
    <div className="auction-timer">
      <div className="timer">
        <h1>{`${days} D : ${hours} H : ${minutes} M : ${seconds} S`}</h1>
      </div>
      <div className="footer">
        <div className="my-bid">
          <h1>{myBid} AED</h1>
          <h1>My Bid</h1>
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
