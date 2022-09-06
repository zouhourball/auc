// import auctionWon from 'images/auction_won.svg'
// import myActivity from 'images/my_activity_enable.svg'
import bidPlace from 'images/bid_place_successfully.svg'
import './style.scss'

const NotificationCard = ({ icon, label, date, withPoint }) => {
  return (
    <div className="notificationCard">
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
NotificationCard.defaultProps = {
  icon: bidPlace,
  label: 'You have outbid! Auction LOt #124',
  date: '23 minutes',
}
