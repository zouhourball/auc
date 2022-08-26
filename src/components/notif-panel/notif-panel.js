import { Button } from 'react-md'
import { navigate } from '@reach/router'

import './style.scss'

const NotifPanel = ({ notifications }) => {
  return (
    <div className="notifPanel">
      {notifications.map((item, index) => {
        return (
          <div key={index} className="notifPanel-item">
            <img src={item.icon} width="20px" height="20px" />
            <div className="notifPanel-item-data">
              <div className="label">{item.label}</div>
              <div className="date">{item.date}</div>
            </div>
            <div className="notificationCard-right">
              {item.withPoint && <div className="bluePoint" />}
            </div>
          </div>
        )
      })}
      <Button
        flat
        swapTheming
        onClick={() => navigate('/auctions/notifications')}
        className="load-more"
      >
        Load mere notifications
      </Button>
    </div>
  )
}

export default NotifPanel

NotifPanel.defaultProps = {
  notifications: [
    {
      icon: 'https://picsum.photos/200',
      label: 'You have outbid! Auction LOt #124',
      date: '23 minutes',
      withPoint: true,
    },
    {
      icon: 'https://picsum.photos/200',
      label: 'You have outbid! Auction LOt #124',
      date: '23 minutes',
      withPoint: true,
    },
    {
      icon: 'https://picsum.photos/200',
      label: 'You have outbid! Auction LOt #124',
      date: '23 minutes',
      withPoint: true,
    },
  ],
}
