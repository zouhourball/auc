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
  icon: 'https://picsum.photos/200',
  label: 'You have outbid! Auction LOt #124',
  date: '23 minutes',
}
