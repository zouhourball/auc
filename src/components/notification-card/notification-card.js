// import auctionWon from 'images/auction_won.svg'
// import myActivity from 'images/my_activity_enable.svg'
import './style.scss'

const NotificationCard = ({ icon, label, date, withPoint, cardHandler }) => {
  return (
    <div className="notificationCard" onClick={() => cardHandler()}>
      <img src={icon} width="20px" height="20px" />
      <div className="label">{label}</div>
      <div className="notificationCard-right">
        <div className="date">{date}</div>
        {withPoint && <div className="bluePoint" />}
      </div>
    </div>
  )
}

export default NotificationCard
