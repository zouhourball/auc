import { Button } from 'react-md'
import { navigate } from '@reach/router'
import auctionWon from 'images/auction_won.svg'
import myActivity from 'images/my_activity_enable.svg'
import bidPlace from 'images/bid_place_successfully.svg'
import { useTranslation } from 'libs/langs'
import moment from 'moment'

import './style.scss'

const NotifPanel = ({ notifications, markRead }) => {
  const { t } = useTranslation()

  return (
    <div className="notifPanel">
      {notifications.map((item, index) => {
        return (
          <div
            key={index}
            className="notifPanel-item"
            onClick={() => markRead(item?.id)}
          >
            <img
              className="notifPanel-item-icon"
              src={bidPlace}
              width="20px"
              height="20px"
            />
            <div className="notifPanel-item-data">
              <div className="label">{item.title}</div>
              <div className="date">
                {moment(item.createdAt).format('DD MM YYYY')}
              </div>
            </div>
            <div className="notificationCard-right">
              {!item.viewed && <div className="notifPoint" />}
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
          {t('view_all')}{' '}
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
      date: '23 minutes ago',
      withPoint: true,
    },
    {
      icon: myActivity,
      label: 'You have outbid! Auction LOt #124',
      date: '23 minutes ago',
      withPoint: true,
    },
    {
      icon: auctionWon,
      label: 'You have outbid! Auction LOt #124',
      date: '23 minutes ago',
      withPoint: true,
    },
  ],
}
