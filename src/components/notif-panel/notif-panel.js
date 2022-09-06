import { Button } from 'react-md'
import { navigate } from '@reach/router'
import auctionWon from 'images/auction_won.svg'
import myActivity from 'images/my_activity_enable.svg'
import bidPlace from 'images/bid_place_successfully.svg'

import './style.scss'

const NotifPanel = ({ notifications }) => {
  return (
    <div className="notifPanel">
      {notifications.map((item, index) => {
        return (
          <div key={index} className="notifPanel-item">
            <img
              className="notifPanel-item-icon"
              src={item.icon}
              width="20px"
              height="20px"
            />
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
      <div className="notifPanel-action">
        <Button
          flat
          primary
          onClick={() => navigate('/auctions/notifications')}
          className="load-more"
        >
          View All
        </Button>
      </div>
    </div>
  )
}

export default NotifPanel

NotifPanel.defaultProps = {
  notifications: [
    {
      icon: bidPlace,
      label: 'You have outbid! Auction LOt #124',
      date: '23 minutes',
      withPoint: true,
    },
    {
      icon: myActivity,
      label: 'You have outbid! Auction LOt #124',
      date: '23 minutes',
      withPoint: true,
    },
    {
      icon: auctionWon,
      label: 'You have outbid! Auction LOt #124',
      date: '23 minutes',
      withPoint: true,
    },
  ],
}
